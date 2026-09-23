import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ConnectionStatus,
  ConnectedUserInfo,
  LogFrame,
  WsMessage,
  SystemNoticePayload,
} from '../types/websocket';

export interface UseWebSocketOptions {
  defaultUrl?: string;
  defaultUserId?: string;
  defaultNickname?: string;
  autoHeartbeat?: boolean;
  heartbeatIntervalMs?: number;
  autoReconnect?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    defaultUrl = 'ws://localhost:8080/ws',
    defaultUserId = 'user_' + Math.floor(1000 + Math.random() * 9000),
    defaultNickname = '테스터',
    autoHeartbeat = true,
    heartbeatIntervalMs = 30000,
    autoReconnect = false,
  } = options;

  const [url, setUrl] = useState<string>(defaultUrl);
  const [userId, setUserId] = useState<string>(defaultUserId);
  const [nickname, setNickname] = useState<string>(defaultNickname);
  const [status, setStatus] = useState<ConnectionStatus>('DISCONNECTED');
  const [serverInfo, setServerInfo] = useState<ConnectedUserInfo | null>(null);

  const [heartbeatActive, setHeartbeatActive] = useState<boolean>(autoHeartbeat);
  const [reconnectActive, setReconnectActive] = useState<boolean>(autoReconnect);
  const [lastRtt, setLastRtt] = useState<number | null>(null);

  const [logs, setLogs] = useState<LogFrame[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<string[]>([]);
  const [broadcastMessages, setBroadcastMessages] = useState<WsMessage[]>([]);
  const [roomMessages, setRoomMessages] = useState<WsMessage[]>([]);
  const [directMessages, setDirectMessages] = useState<WsMessage[]>([]);
  const [echoReplies, setEchoReplies] = useState<Array<{ rtt: number; data: any; time: number }>>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const pingTimerRef = useRef<number | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectAttemptRef = useRef<number>(0);
  const lastPingTimestampRef = useRef<number | null>(null);
  const echoSentTimestamps = useRef<Map<number, number>>(new Map());

  // 로그 추가 헬퍼
  const addLog = useCallback(
    (direction: 'TX' | 'RX' | 'SYS' | 'ERR', raw: string, parsed?: WsMessage) => {
      const frame: LogFrame = {
        id: Math.random().toString(36).substring(2, 9),
        direction,
        timestamp: Date.now(),
        raw,
        parsed,
      };
      setLogs((prev) => [frame, ...prev.slice(0, 199)]); // 최근 200개 유지
    },
    []
  );

  // 메시지 전송 로우 함수
  const sendRaw = useCallback(
    (messageObj: WsMessage): boolean => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        addLog('ERR', '웹소켓이 연결되어 있지 않아 전송에 실패했습니다.', messageObj);
        return false;
      }
      try {
        const jsonStr = JSON.stringify(messageObj);
        wsRef.current.send(jsonStr);
        addLog('TX', jsonStr, messageObj);
        return true;
      } catch (err: any) {
        addLog('ERR', `전송 에러: ${err.message}`, messageObj);
        return false;
      }
    },
    [addLog]
  );

  // 수신 메시지 디스패치
  const handleIncomingMessage = useCallback(
    (event: MessageEvent) => {
      const raw = event.data;
      try {
        const msg: WsMessage = JSON.parse(raw);
        addLog('RX', raw, msg);

        switch (msg.type) {
          case 'SYSTEM_NOTICE': {
            const p = msg.payload as SystemNoticePayload;
            if (p && (p.sessionId || p.serverTime)) {
              setServerInfo({
                sessionId: p.sessionId,
                userId: p.userId || userId,
                clientIp: p.clientIp,
                serverTime: p.serverTime,
              });
            }
            break;
          }
          case 'PONG': {
            if (lastPingTimestampRef.current) {
              const rtt = Date.now() - lastPingTimestampRef.current;
              setLastRtt(rtt);
              lastPingTimestampRef.current = null;
            }
            break;
          }
          case 'ECHO': {
            let rtt = 0;
            const testId = msg.payload?.testId;
            if (testId && echoSentTimestamps.current.has(testId)) {
              const sentTime = echoSentTimestamps.current.get(testId)!;
              rtt = Date.now() - sentTime;
              echoSentTimestamps.current.delete(testId);
            }
            setEchoReplies((prev) => [{ rtt, data: msg.payload, time: Date.now() }, ...prev]);
            break;
          }
          case 'BROADCAST': {
            setBroadcastMessages((prev) => [...prev, msg]);
            break;
          }
          case 'ROOM_JOIN': {
            if (msg.roomId && !joinedRooms.includes(msg.roomId)) {
              setJoinedRooms((prev) => [...prev, msg.roomId!]);
            }
            break;
          }
          case 'ROOM_LEAVE': {
            if (msg.roomId) {
              setJoinedRooms((prev) => prev.filter((r) => r !== msg.roomId));
            }
            break;
          }
          case 'ROOM_MESSAGE': {
            setRoomMessages((prev) => [...prev, msg]);
            break;
          }
          case 'DIRECT_MESSAGE': {
            setDirectMessages((prev) => [...prev, msg]);
            break;
          }
          default:
            break;
        }
      } catch (err: any) {
        addLog('ERR', `메시지 파싱 실패: ${raw}`);
      }
    },
    [addLog, joinedRooms, userId]
  );

  // 연결 해제
  const disconnect = useCallback(() => {
    if (pingTimerRef.current) {
      clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    reconnectAttemptRef.current = 0;

    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated close');
      wsRef.current = null;
    }
    setStatus('DISCONNECTED');
    setServerInfo(null);
    setJoinedRooms([]);
    addLog('SYS', '연결이 정상 종료되었습니다.');
  }, [addLog]);

  // 연결 시도
  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    try {
      setStatus('CONNECTING');

      // 핸드셰이크 쿼리 파라미터 조합
      let fullUrl = url;
      const params = new URLSearchParams();
      if (userId.trim()) params.append('userId', userId.trim());
      if (nickname.trim()) params.append('nickname', nickname.trim());

      const paramStr = params.toString();
      if (paramStr) {
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + paramStr;
      }

      addLog('SYS', `연결 시도 중: ${fullUrl}`);
      const socket = new WebSocket(fullUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setStatus('CONNECTED');
        reconnectAttemptRef.current = 0;
        addLog('SYS', 'WebSocket 연결이 수립되었습니다.');

        // 하트비트 설정
        if (heartbeatActive) {
          if (pingTimerRef.current) clearInterval(pingTimerRef.current);
          pingTimerRef.current = window.setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              lastPingTimestampRef.current = Date.now();
              const pingMsg: WsMessage = { type: 'PING', payload: 'ping' };
              socket.send(JSON.stringify(pingMsg));
              addLog('TX', JSON.stringify(pingMsg), pingMsg);
            }
          }, heartbeatIntervalMs);
        }
      };

      socket.onmessage = handleIncomingMessage;

      socket.onerror = (err: Event) => {
        addLog('ERR', 'WebSocket 에러가 발생했습니다.');
      };

      socket.onclose = (event: CloseEvent) => {
        setStatus('DISCONNECTED');
        setServerInfo(null);
        if (pingTimerRef.current) {
          clearInterval(pingTimerRef.current);
          pingTimerRef.current = null;
        }

        addLog(
          'SYS',
          `연결 종료: code=${event.code} (${event.code === 1000 ? '정상종료' : event.code === 1006 ? '비정상 단절' : '기타'}), reason=${event.reason || '없음'}`
        );

        // 자동 재연결 로직 (1000 정상종료 제외)
        if (reconnectActive && event.code !== 1000) {
          reconnectAttemptRef.current += 1;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current - 1), 30000);
          addLog('SYS', `${delay / 1000}초 후 자동 재연결을 시도합니다 (시도 횟수: ${reconnectAttemptRef.current})...`);
          reconnectTimerRef.current = window.setTimeout(() => {
            connect();
          }, delay);
        }
      };
    } catch (err: any) {
      setStatus('DISCONNECTED');
      addLog('ERR', `연결 생성 실패: ${err.message}`);
    }
  }, [url, userId, nickname, heartbeatActive, heartbeatIntervalMs, reconnectActive, addLog, handleIncomingMessage]);

  // 하트비트 토글에 따른 타이머 제어
  useEffect(() => {
    if (status === 'CONNECTED' && heartbeatActive) {
      if (pingTimerRef.current) clearInterval(pingTimerRef.current);
      pingTimerRef.current = window.setInterval(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          lastPingTimestampRef.current = Date.now();
          const pingMsg: WsMessage = { type: 'PING', payload: 'ping' };
          wsRef.current.send(JSON.stringify(pingMsg));
          addLog('TX', JSON.stringify(pingMsg), pingMsg);
        }
      }, heartbeatIntervalMs);
    } else {
      if (pingTimerRef.current) {
        clearInterval(pingTimerRef.current);
        pingTimerRef.current = null;
      }
    }
    return () => {
      if (pingTimerRef.current) clearInterval(pingTimerRef.current);
    };
  }, [status, heartbeatActive, heartbeatIntervalMs, addLog]);

  // 언마운트 정리
  useEffect(() => {
    return () => {
      if (pingTimerRef.current) clearInterval(pingTimerRef.current);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
      }
    };
  }, []);

  // 고수준 메시지 전송 함수들
  const sendPing = useCallback(() => {
    lastPingTimestampRef.current = Date.now();
    return sendRaw({ type: 'PING', payload: 'ping' });
  }, [sendRaw]);

  const sendEcho = useCallback(
    (content: string | object) => {
      const testId = Date.now();
      echoSentTimestamps.current.set(testId, Date.now());
      const payload =
        typeof content === 'string'
          ? { testId, content }
          : { testId, ...content };
      return sendRaw({ type: 'ECHO', payload });
    },
    [sendRaw]
  );

  const sendBroadcast = useCallback(
    (payload: any) => {
      return sendRaw({
        type: 'BROADCAST',
        sender: nickname || userId,
        payload,
      });
    },
    [sendRaw, nickname, userId]
  );

  const joinRoom = useCallback(
    (roomId: string) => {
      const success = sendRaw({
        type: 'ROOM_JOIN',
        sender: nickname || userId,
        roomId: roomId.trim(),
      });
      if (success && !joinedRooms.includes(roomId.trim())) {
        setJoinedRooms((prev) => [...prev, roomId.trim()]);
      }
      return success;
    },
    [sendRaw, nickname, userId, joinedRooms]
  );

  const leaveRoom = useCallback(
    (roomId: string) => {
      const success = sendRaw({
        type: 'ROOM_LEAVE',
        sender: nickname || userId,
        roomId: roomId.trim(),
      });
      if (success) {
        setJoinedRooms((prev) => prev.filter((r) => r !== roomId.trim()));
      }
      return success;
    },
    [sendRaw, nickname, userId]
  );

  const sendRoomMessage = useCallback(
    (roomId: string, payload: any) => {
      return sendRaw({
        type: 'ROOM_MESSAGE',
        sender: nickname || userId,
        roomId: roomId.trim(),
        payload,
      });
    },
    [sendRaw, nickname, userId]
  );

  const sendDirectMessage = useCallback(
    (target: string, payload: any) => {
      return sendRaw({
        type: 'DIRECT_MESSAGE',
        sender: nickname || userId,
        target: target.trim(),
        payload,
      });
    },
    [sendRaw, nickname, userId]
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    url,
    setUrl,
    userId,
    setUserId,
    nickname,
    setNickname,
    status,
    serverInfo,
    heartbeatActive,
    setHeartbeatActive,
    reconnectActive,
    setReconnectActive,
    lastRtt,
    logs,
    joinedRooms,
    broadcastMessages,
    roomMessages,
    directMessages,
    echoReplies,
    connect,
    disconnect,
    sendRaw,
    sendPing,
    sendEcho,
    sendBroadcast,
    joinRoom,
    leaveRoom,
    sendRoomMessage,
    sendDirectMessage,
    clearLogs,
  };
}

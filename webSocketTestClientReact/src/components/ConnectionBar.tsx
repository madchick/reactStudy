import React from 'react';
import { ConnectionStatus, ConnectedUserInfo } from '../types/websocket';

interface ConnectionBarProps {
  url: string;
  setUrl: (url: string) => void;
  userId: string;
  setUserId: (id: string) => void;
  nickname: string;
  setNickname: (nick: string) => void;
  status: ConnectionStatus;
  serverInfo: ConnectedUserInfo | null;
  heartbeatActive: boolean;
  setHeartbeatActive: (val: boolean) => void;
  reconnectActive: boolean;
  setReconnectActive: (val: boolean) => void;
  lastRtt: number | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onSendPing: () => void;
}

export const ConnectionBar: React.FC<ConnectionBarProps> = ({
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
  onConnect,
  onDisconnect,
  onSendPing,
}) => {
  const isConnected = status === 'CONNECTED';
  const isConnecting = status === 'CONNECTING';

  const presets = [
    { label: 'Spring 직결 (:8080)', url: 'ws://localhost:8080/ws' },
    { label: 'Nginx 프록시 (:80)', url: 'ws://localhost/ws/' },
  ];

  return (
    <div className="card connection-bar">
      <div className="connection-header">
        <div className="app-title-area">
          <span className="logo-icon">📡</span>
          <div>
            <h1 className="app-title">WebSocket Test Client</h1>
            <p className="app-subtitle">Spring Boot & Nginx WebSocket Protocol Tester</p>
          </div>
        </div>

        <div className="status-badge-area">
          <span className={`status-pill status-${status.toLowerCase()}`}>
            <span className="status-dot"></span>
            {status === 'CONNECTED' && '연결됨 (Connected)'}
            {status === 'CONNECTING' && '연결 시도 중...'}
            {status === 'DISCONNECTED' && '연결 끊김 (Disconnected)'}
          </span>
          {isConnected && lastRtt !== null && (
            <span className="rtt-pill">
              ⏱️ RTT: <strong>{lastRtt} ms</strong>
            </span>
          )}
        </div>
      </div>

      <div className="connection-inputs">
        <div className="input-group flex-2">
          <label>WebSocket Server URL</label>
          <div className="url-input-wrapper">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isConnected || isConnecting}
              placeholder="ws://localhost/ws/"
            />
            <div className="preset-buttons">
              {presets.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  className="btn-preset"
                  disabled={isConnected || isConnecting}
                  onClick={() => setUrl(p.url)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="input-group">
          <label>User ID (쿼리 식별자)</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={isConnected || isConnecting}
            placeholder="user_1001"
          />
        </div>

        <div className="input-group">
          <label>닉네임 (Sender)</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="홍길동"
          />
        </div>

        <div className="input-group action-group">
          <label>&nbsp;</label>
          {isConnected ? (
            <button className="btn btn-danger" onClick={onDisconnect}>
              연결 해제
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={onConnect}
              disabled={isConnecting}
            >
              {isConnecting ? '연결 중...' : '서버 연결'}
            </button>
          )}
        </div>
      </div>

      <div className="connection-options-bar">
        <div className="options-left">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={heartbeatActive}
              onChange={(e) => setHeartbeatActive(e.target.checked)}
            />
            자동 하트비트 (PING 30초)
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={reconnectActive}
              onChange={(e) => setReconnectActive(e.target.checked)}
            />
            자동 재연결 (Exponential Backoff)
          </label>
          {isConnected && (
            <button className="btn-sm btn-outline" onClick={onSendPing}>
              수동 PING 전송
            </button>
          )}
        </div>

        {isConnected && serverInfo && (
          <div className="session-info-chips">
            <span className="chip">
              세션 ID: <code>{serverInfo.sessionId || '-'}</code>
            </span>
            {serverInfo.clientIp && (
              <span className="chip">
                접속 IP: <code>{serverInfo.clientIp}</code>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

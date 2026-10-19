import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  Lock,
  Unlock,
  Users,
  Plus,
  RefreshCw,
  Send,
  LogOut,
  Edit3,
  Trash2,
  Search,
  Terminal,
  ExternalLink,
  History,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { chatApi, normalizeBaseUrl } from './api/chatApi.js';
import ModalDialog from './components/ModalDialog.jsx';

const STORAGE_SERVER_KEY = 'gochat_server_url';
const STORAGE_SESSION_KEY = 'gochat_user_session';

export default function App() {
  // Server URL & Health state
  const [serverUrl, setServerUrl] = useState(
    () => localStorage.getItem(STORAGE_SERVER_KEY) || 'http://localhost:8080',
  );
  const [serverOnline, setServerOnline] = useState(false);

  // User Session (stored in sessionStorage so each browser tab can test a separate user easily)
  const [session, setSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Inspector logs (REST + WS packets)
  const [logs, setLogs] = useState([]);
  const [showInspector, setShowInspector] = useState(true);

  const appendLog = useCallback((entry) => {
    setLogs((prev) => [entry, ...prev.slice(0, 79)]);
  }, []);

  // Auth / Nickname Modals
  const [loginNickname, setLoginNickname] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  // Rooms List State
  const [rooms, setRooms] = useState([]);
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [roomsLoading, setRoomsLoading] = useState(false);

  // Create Room Modal State
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomIsPrivate, setRoomIsPrivate] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');
  const [roomIsUnlimited, setRoomIsUnlimited] = useState(true);
  const [roomMaxUsers, setRoomMaxUsers] = useState(10);
  const [createRoomError, setCreateRoomError] = useState('');

  // Password Verification Modal State (for joining private rooms)
  const [verifyTargetRoom, setVerifyTargetRoom] = useState(null);
  const [verifyPasswordInput, setVerifyPasswordInput] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Room Switch Confirmation Modal State
  const [switchTargetRoom, setSwitchTargetRoom] = useState(null);

  // Active Chat Room & WebSocket State
  const [activeRoom, setActiveRoom] = useState(null);
  const [activeRoomPassword, setActiveRoomPassword] = useState('');
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  // Save serverUrl
  useEffect(() => {
    localStorage.setItem(STORAGE_SERVER_KEY, normalizeBaseUrl(serverUrl));
  }, [serverUrl]);

  // Save session to sessionStorage
  const saveSession = useCallback((sess) => {
    setSession(sess);
    if (sess) {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sess));
    } else {
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }, []);

  // Check Server Health & Verify Stored Session on mount
  const checkServerAndSession = useCallback(async () => {
    try {
      await chatApi.checkHealth(serverUrl, appendLog);
      setServerOnline(true);
    } catch {
      setServerOnline(false);
    }

    if (session?.token) {
      try {
        const verified = await chatApi.getMe(serverUrl, session.token, appendLog);
        saveSession({ ...verified, token: session.token });
      } catch {
        saveSession(null);
      }
    }
  }, [serverUrl, session?.token, appendLog, saveSession]);

  useEffect(() => {
    checkServerAndSession();
  }, [checkServerAndSession]);

  // Fetch Rooms List
  const fetchRooms = useCallback(async () => {
    setRoomsLoading(true);
    try {
      const data = await chatApi.listRooms(serverUrl, visibilityFilter, appendLog);
      setRooms(Array.isArray(data.rooms) ? data.rooms : []);
      setServerOnline(true);
    } catch {
      setServerOnline(false);
    } finally {
      setRoomsLoading(false);
    }
  }, [serverUrl, visibilityFilter, appendLog]);

  useEffect(() => {
    fetchRooms();
    const timer = setInterval(fetchRooms, 5000);
    return () => clearInterval(timer);
  }, [fetchRooms]);

  // Scroll to bottom when new live message arrives
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // 1. Create or Reclaim Session (`POST /api/auth/session`)
  const handleCreateSession = async (e) => {
    e.preventDefault();
    const trimmed = loginNickname.trim();
    if (!trimmed) {
      setAuthError('닉네임을 입력해주세요.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const created = await chatApi.createSession(
        serverUrl,
        trimmed,
        loginPassword,
        appendLog,
      );
      saveSession(created);
      setLoginNickname('');
      setLoginPassword('');
      fetchRooms();
    } catch (err) {
      if (
        err.status === 409 ||
        err.message?.toLowerCase().includes('already taken')
      ) {
        setAuthError(
          `'${trimmed}'은(는) 이미 다른 사용자가 사용 중인 닉네임이거나 비밀번호(PIN)가 일치하지 않습니다. 본인 닉네임이라면 비밀번호를 확인해주세요. (409 Conflict)`,
        );
      } else {
        setAuthError(err.message || '세션 발급에 실패했습니다.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // 2. Update Nickname (`PUT /api/auth/nickname`)
  const handleUpdateNickname = async (e) => {
    e.preventDefault();
    const trimmed = newNickname.trim();
    if (!trimmed) {
      setNicknameError('변경할 닉네임을 입력해주세요.');
      return;
    }
    if (trimmed === session?.nickname) {
      setNicknameError('현재 사용 중인 닉네임과 동일합니다.');
      return;
    }
    setNicknameError('');
    try {
      const updated = await chatApi.updateNickname(
        serverUrl,
        session.token,
        trimmed,
        appendLog,
      );
      saveSession({ ...session, nickname: updated.nickname });
      setIsNicknameModalOpen(false);
    } catch (err) {
      if (
        err.status === 409 ||
        err.message?.toLowerCase().includes('already taken')
      ) {
        setNicknameError(
          `'${trimmed}'은(는) 이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요. (409 Conflict)`,
        );
      } else {
        setNicknameError(err.message || '닉네임 변경에 실패했습니다.');
      }
    }
  };

  // 3. Create Room (`POST /api/rooms`)
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const trimmedName = roomName.trim();
    if (!trimmedName) {
      setCreateRoomError('방 이름을 입력해주세요.');
      return;
    }
    if (roomIsPrivate && !roomPassword) {
      setCreateRoomError('비공개 방은 비밀번호를 설정해야 합니다.');
      return;
    }

    setCreateRoomError('');
    const savedPassword = roomIsPrivate ? roomPassword : '';

    try {
      const payload = {
        name: trimmedName,
        is_private: roomIsPrivate,
        password: savedPassword || undefined,
        is_unlimited: roomIsUnlimited,
        max_users: roomIsUnlimited ? 100 : Number(roomMaxUsers),
      };
      const createdRoom = await chatApi.createRoom(
        serverUrl,
        session.token,
        payload,
        appendLog,
      );
      setIsCreateRoomOpen(false);
      setRoomName('');
      setRoomPassword('');
      setRoomIsPrivate(false);
      setRoomIsUnlimited(true);
      setRoomMaxUsers(10);
      await fetchRooms();
      // Immediately enter the newly created room
      await connectToRoom(createdRoom, savedPassword);
    } catch (err) {
      if (
        err.status === 409 ||
        err.message?.toLowerCase().includes('already taken')
      ) {
        setCreateRoomError(
          `'${trimmedName}' 이름의 채팅방이 이미 존재합니다. 다른 방 이름을 입력해주세요. (409 Conflict)`,
        );
        fetchRooms();
      } else {
        setCreateRoomError(err.message || '방 생성에 실패했습니다.');
      }
    }
  };

  // 4. Delete Room (`DELETE /api/rooms/{id}`)
  const handleDeleteRoom = async (e, room) => {
    e.stopPropagation();
    if (!window.confirm(`'${room.name}' 채팅방을 삭제하시겠습니까?`)) return;
    try {
      await chatApi.deleteRoom(serverUrl, session.token, room.id, appendLog);
      if (activeRoom?.id === room.id) {
        leaveCurrentRoom();
      }
      fetchRooms();
    } catch (err) {
      alert(err.message || '방 삭제 권한이 없거나 실패했습니다.');
    }
  };

  // 5. Leave Current Room
  const leaveCurrentRoom = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setWsConnected(false);
    setActiveRoom(null);
    setActiveRoomPassword('');
    setMessages([]);
    setParticipants([]);
  }, []);

  // 6. Connect to Room (History via `GET /api/rooms/{id}/messages` + WebSocket `/ws/rooms/{id}`)
  const connectToRoom = useCallback(
    async (room, password = '') => {
      if (!session?.token) return;

      // Close previous connection if any
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      setActiveRoom(room);
      setActiveRoomPassword(password);
      setMessages([]);
      setParticipants([]);
      shouldAutoScrollRef.current = true;

      // Load recent 50 messages from SQLite
      try {
        const historyResp = await chatApi.getRoomMessages(
          serverUrl,
          session.token,
          room.id,
          { limit: 50, beforeId: 0, password },
          appendLog,
        );
        const initialMsgs = Array.isArray(historyResp.messages)
          ? historyResp.messages
          : [];
        setMessages(initialMsgs);
        setHasMoreHistory(initialMsgs.length >= 50);
      } catch (err) {
        appendLog({
          kind: 'HISTORY_ERR',
          direction: `GET /api/rooms/${room.id}/messages`,
          status: err.status || 'ERR',
          payload: { error: err.message },
          timestamp: new Date().toISOString(),
        });
      }

      // Open WebSocket connection
      const wsUrl = chatApi.buildWsUrl(serverUrl, room.id, session.token, password);
      appendLog({
        kind: 'WS_CONNECT',
        direction: `WS /ws/rooms/${room.id}`,
        status: 'CONNECTING',
        payload: { url: wsUrl },
        timestamp: new Date().toISOString(),
      });

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        appendLog({
          kind: 'WS_OPEN',
          direction: `WS /ws/rooms/${room.id}`,
          status: 'OPEN',
          payload: { room_id: room.id, nickname: session.nickname },
          timestamp: new Date().toISOString(),
        });
        fetchRooms();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          appendLog({
            kind: 'WS_IN',
            direction: `<- WS (${data.type})`,
            status: 'OK',
            payload: data,
            timestamp: new Date().toISOString(),
          });

          if (data.type === 'room_state') {
            setParticipants(Array.isArray(data.participants) ? data.participants : []);
            setActiveRoom((prev) =>
              prev && prev.id === data.room_id
                ? {
                    ...prev,
                    current_users: data.current_users,
                    max_users: data.max_users,
                  }
                : prev,
            );
            setRooms((prevRooms) =>
              prevRooms.map((r) =>
                r.id === data.room_id
                  ? {
                      ...r,
                      current_users: data.current_users,
                      max_users: data.max_users,
                    }
                  : r,
              ),
            );
          } else {
            shouldAutoScrollRef.current = true;
            setMessages((prev) => [...prev, data]);
          }
        } catch {
          // ignore malformed packet
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        appendLog({
          kind: 'WS_CLOSE',
          direction: `WS /ws/rooms/${room.id}`,
          status: 'CLOSED',
          payload: { room_id: room.id },
          timestamp: new Date().toISOString(),
        });
        fetchRooms();
      };

      ws.onerror = () => {
        setWsConnected(false);
      };
    },
    [serverUrl, session, appendLog, fetchRooms],
  );

  // 7. Proceed to enter room (Pre-verify via `POST /api/rooms/{id}/verify`)
  const proceedSelectRoom = async (room) => {
    if (!session?.token || !room) return;

    if (room.is_private) {
      setVerifyTargetRoom(room);
      setVerifyPasswordInput('');
      setVerifyError('');
      return;
    }

    // Public room: pre-verify capacity before joining
    try {
      const verified = await chatApi.verifyRoomAccess(
        serverUrl,
        room.id,
        '',
        appendLog,
      );
      await connectToRoom(verified.room || room, '');
    } catch (err) {
      if (err.status === 404) {
        alert('존재하지 않거나 인원이 0명이 되어 자동 삭제된 방입니다 (404 Not Found).');
        fetchRooms();
      } else if (err.status === 409) {
        alert('방 정원이 초과되어 입장할 수 없습니다.');
      } else {
        alert(err.message || '방 입장 확인에 실패했습니다.');
      }
    }
  };

  // Click Room Card -> Ask confirmation if already in another room
  const handleSelectRoom = async (room) => {
    if (!session?.token) return;
    if (activeRoom?.id === room.id && wsConnected) return;

    // If user already belongs to a room and clicked a different room, ask confirmation
    if (activeRoom && activeRoom.id !== room.id) {
      setSwitchTargetRoom(room);
      return;
    }

    await proceedSelectRoom(room);
  };

  const handleConfirmSwitchRoom = async () => {
    const target = switchTargetRoom;
    setSwitchTargetRoom(null);
    if (target) {
      await proceedSelectRoom(target);
    }
  };

  // 8. Submit Private Room Password (`POST /api/rooms/{id}/verify`)
  const handleVerifyPrivateRoom = async (e) => {
    e.preventDefault();
    if (!verifyTargetRoom) return;
    setVerifyLoading(true);
    setVerifyError('');

    try {
      const verified = await chatApi.verifyRoomAccess(
        serverUrl,
        verifyTargetRoom.id,
        verifyPasswordInput,
        appendLog,
      );
      const target = verified.room || verifyTargetRoom;
      const pwd = verifyPasswordInput;
      setVerifyTargetRoom(null);
      setVerifyPasswordInput('');
      await connectToRoom(target, pwd);
    } catch (err) {
      if (err.status === 403) {
        setVerifyError('비밀번호가 일치하지 않습니다 (403 Forbidden).');
      } else if (err.status === 404) {
        setVerifyError('존재하지 않거나 자동 삭제된 방입니다 (404 Not Found).');
        fetchRooms();
      } else if (err.status === 409) {
        setVerifyError('방 정원이 가득 찼습니다 (409 Conflict).');
      } else {
        setVerifyError(err.message || '입장 검증에 실패했습니다.');
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  // 9. Load Older Messages (`GET /api/rooms/{id}/messages?limit=50&before_id=<lowest_id>`)
  const handleLoadOlderMessages = async () => {
    if (!activeRoom || loadingHistory) return;
    const oldestMsgWithId = messages.find((m) => m.id && m.id > 0);
    if (!oldestMsgWithId) {
      setHasMoreHistory(false);
      return;
    }

    setLoadingHistory(true);
    shouldAutoScrollRef.current = false;
    try {
      const resp = await chatApi.getRoomMessages(
        serverUrl,
        session.token,
        activeRoom.id,
        {
          limit: 50,
          beforeId: oldestMsgWithId.id,
          password: activeRoomPassword,
        },
        appendLog,
      );
      const older = Array.isArray(resp.messages) ? resp.messages : [];
      if (older.length > 0) {
        setMessages((prev) => [...older, ...prev]);
      }
      setHasMoreHistory(older.length >= 50);
    } catch {
      setHasMoreHistory(false);
    } finally {
      setLoadingHistory(false);
    }
  };

  // 10. Send Chat Message over WebSocket (`{"type": "chat", "content": "..."}`)
  const handleSendChat = (e) => {
    e.preventDefault();
    const content = chatInput.trim();
    if (!content || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const payload = {
      type: 'chat',
      content,
    };
    wsRef.current.send(JSON.stringify(payload));
    appendLog({
      kind: 'WS_OUT',
      direction: '-> WS (chat)',
      status: 'SENT',
      payload,
      timestamp: new Date().toISOString(),
    });
    setChatInput('');
  };

  // Filtered rooms by search query, with the user's current activeRoom pinned to the top
  const filteredRooms = rooms
    .filter((r) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.name?.toLowerCase().includes(q) ||
        r.creator_name?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aIsMyRoom = activeRoom?.id === a.id;
      const bIsMyRoom = activeRoom?.id === b.id;
      if (aIsMyRoom && !bIsMyRoom) return -1;
      if (!aIsMyRoom && bIsMyRoom) return 1;
      return 0;
    });

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">Go</div>
          <div>
            <div className="brand-title">goChatServer Web Client</div>
            <div className="brand-subtitle">
              REST API + WebSocket 실시간 멀티플랫폼 채팅 테스트 클라이언트
            </div>
          </div>
        </div>

        <div className="topbar-controls">
          {/* Server URL Input & Live Status */}
          <div className="server-bar" title="Go 채팅 서버 주소">
            <span
              className={`status-dot ${serverOnline ? 'online' : 'offline'}`}
            />
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="http://localhost:8080"
              aria-label="서버 주소"
            />
            <button
              type="button"
              className="icon-btn"
              onClick={checkServerAndSession}
              title="서버 상태 확인 (/api/health)"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Open New Tab for Multi-User Testing */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.open(window.location.href, '_blank')}
            title="새 브라우저 탭을 열어 다른 닉네임으로 동시 접속 테스트를 할 수 있습니다"
          >
            <ExternalLink size={15} />
            새 유저 탭 열기
          </button>

          {/* Toggle Packet Inspector */}
          <button
            type="button"
            className={`btn ${showInspector ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowInspector((v) => !v)}
          >
            <Terminal size={15} />
            API/WS 로그 ({logs.length})
          </button>

          {/* User Profile & Session Controls */}
          {session && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setNewNickname(session.nickname);
                  setNicknameError('');
                  setIsNicknameModalOpen(true);
                }}
                title="닉네임 변경 (PUT /api/auth/nickname)"
              >
                <Edit3 size={14} />
                <span>{session.nickname}</span>
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  leaveCurrentRoom();
                  saveSession(null);
                }}
                title="세션 로그아웃"
              >
                <LogOut size={14} />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <div className={`workspace ${showInspector ? 'with-inspector' : ''}`}>
        {/* Left Sidebar: Room List */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '0.98rem', fontWeight: 700 }}>
                  채팅방 목록 ({filteredRooms.length})
                </h2>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={fetchRooms}
                  title="방 목록 새로고침 (GET /api/rooms)"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!session}
                onClick={() => {
                  setCreateRoomError('');
                  setIsCreateRoomOpen(true);
                }}
              >
                <Plus size={16} />
                방 만들기
              </button>
            </div>

            {/* Visibility Filter Tabs: all | public | private */}
            <div className="filter-tabs" role="tablist">
              {[
                { key: 'all', label: '전체 (all)' },
                { key: 'public', label: '공개방' },
                { key: 'private', label: '비공개방' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={visibilityFilter === tab.key}
                  className={`filter-tab ${
                    visibilityFilter === tab.key ? 'active' : ''
                  }`}
                  onClick={() => setVisibilityFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Room Search */}
            <div className="search-box">
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="방 이름 또는 개설자 검색..."
              />
            </div>
          </div>

          <div className="room-list">
            {filteredRooms.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={32} opacity={0.4} />
                <p style={{ fontSize: '0.86rem' }}>
                  {roomsLoading
                    ? '채팅방 목록을 불러오는 중...'
                    : '표시할 채팅방이 없습니다. 새 채팅방을 만들어보세요!'}
                </p>
              </div>
            ) : (
              filteredRooms.map((room) => {
                const isFull = room.current_users >= room.max_users;
                const isSelected = activeRoom?.id === room.id;
                const isOwner = session?.user_id === room.created_by;

                return (
                  <div
                    key={room.id}
                    className={`room-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectRoom(room)}
                  >
                    <div className="room-card-top">
                      <div className="room-name">
                        {room.is_private ? (
                          <Lock size={15} color="#fbbf24" />
                        ) : (
                          <Unlock size={15} color="#34d399" />
                        )}
                        <span>{room.name}</span>
                        {isSelected && (
                          <span
                            className="badge"
                            style={{
                              background: 'var(--accent)',
                              color: '#ffffff',
                            }}
                          >
                            참여 중
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span
                          className={`badge ${
                            room.is_private ? 'badge-private' : 'badge-public'
                          }`}
                        >
                          {room.is_private ? '비공개' : '공개'}
                        </span>
                        <span
                          className={`badge badge-capacity ${isFull ? 'full' : ''}`}
                        >
                          <Users size={11} />
                          {room.current_users} / {room.max_users}
                          {room.is_unlimited ? ' (무제한)' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="room-card-bottom">
                      <span>개설자: {room.creator_name || '알 수 없음'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{formatTime(room.created_at)}</span>
                        {isOwner && (
                          <button
                            type="button"
                            className="icon-btn"
                            style={{ width: 24, height: 24, color: '#f87171' }}
                            onClick={(e) => handleDeleteRoom(e, room)}
                            title="방 삭제 (DELETE /api/rooms/{id})"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Center Main Pane: Login Gate OR Active Room Chat */}
        <main className="chat-pane">
          {!session ? (
            <div className="empty-state">
              <div
                style={{
                  background: 'var(--bg-panel)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  width: '100%',
                  maxWidth: '400px',
                  textAlign: 'left',
                }}
              >
                <h2 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>
                  닉네임 등록 및 로그인
                </h2>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '18px',
                  }}
                >
                  <code>POST /api/auth/session</code> — 신규 닉네임은 새로 등록(
                  <code>201</code>)되며, 비밀번호(PIN)를 함께 설정하면 재접속 시 같은
                  닉네임과 비밀번호로 기존 계정(<code>user_id</code>)을 이어서 사용할 수
                  있습니다(<code>200</code>).
                </p>

                <form className="form-stack" onSubmit={handleCreateSession}>
                  {authError && <div className="error-banner">{authError}</div>}
                  <div className="form-field">
                    <label htmlFor="nickname-input">
                      닉네임 (최대 30자, 중복 불가)
                    </label>
                    <input
                      id="nickname-input"
                      type="text"
                      className="form-input"
                      maxLength={30}
                      placeholder="예: 홍길동"
                      value={loginNickname}
                      onChange={(e) => {
                        setLoginNickname(e.target.value);
                        if (authError) setAuthError('');
                      }}
                      autoFocus
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="nickname-password-input">
                      비밀번호 / PIN (선택 — 재접속·이어쓰기용)
                    </label>
                    <input
                      id="nickname-password-input"
                      type="password"
                      className="form-input"
                      placeholder="예: my-pin-1234"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (authError) setAuthError('');
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={authLoading}
                  >
                    {authLoading
                      ? '세션 확인 중...'
                      : '닉네임 시작 / 이어쓰기'}
                  </button>
                </form>
              </div>
            </div>
          ) : !activeRoom ? (
            <div className="empty-state">
              <MessageSquare size={48} opacity={0.35} />
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                참여할 채팅방을 선택하거나 새 방을 만들어보세요
              </h3>
              <p style={{ fontSize: '0.84rem', maxWidth: '420px' }}>
                왼쪽 목록에서 공개방은 즉시 입장할 수 있고, 비공개방은 비밀번호 검증(
                <code>POST /api/rooms/&#123;id&#125;/verify</code>) 후 WebSocket으로
                연결됩니다.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsCreateRoomOpen(true)}
              >
                <Plus size={16} />새 채팅방 만들기
              </button>
            </div>
          ) : (
            <>
              {/* Active Room Header */}
              <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {activeRoom.is_private ? (
                    <Lock size={18} color="#fbbf24" />
                  ) : (
                    <Unlock size={18} color="#34d399" />
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h2 style={{ fontSize: '1.02rem', fontWeight: 700 }}>
                        {activeRoom.name}
                      </h2>
                      <span
                        className={`badge ${
                          wsConnected ? 'badge-public' : 'badge-private'
                        }`}
                      >
                        {wsConnected ? (
                          <>
                            <CheckCircle2 size={11} /> WS 연결됨
                          </>
                        ) : (
                          <>
                            <AlertCircle size={11} /> 연결 끊김
                          </>
                        )}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Room ID: <code>{activeRoom.id}</code> · 인원:{' '}
                      <strong>
                        {activeRoom.current_users} / {activeRoom.max_users}명
                      </strong>
                      {activeRoom.is_unlimited ? ' (무제한 옵션)' : ''}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={leaveCurrentRoom}
                  >
                    방 나가기
                  </button>
                </div>
              </div>

              {/* Chat Messages + Live Participants Sidebar */}
              <div className="chat-body">
                <div className="messages-Column">
                  <div className="messages-scroll">
                    {hasMoreHistory && (
                      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleLoadOlderMessages}
                          disabled={loadingHistory}
                        >
                          <History size={14} />
                          {loadingHistory
                            ? '불러오는 중...'
                            : '이전 대화 내역 불러오기 (before_id)'}
                        </button>
                      </div>
                    )}

                    {messages.length === 0 ? (
                      <div className="empty-state">
                        <p style={{ fontSize: '0.85rem' }}>
                          아직 대화 내역이 없습니다. 첫 메시지를 보내보세요!
                        </p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => {
                        const key = msg.id ? `msg-${msg.id}` : `evt-${idx}`;
                        if (
                          msg.type === 'join' ||
                          msg.type === 'leave' ||
                          msg.type === 'error'
                        ) {
                          return (
                            <div
                              key={key}
                              className={`msg-system ${
                                msg.type === 'error' ? 'error' : ''
                              }`}
                            >
                              {msg.content} · {formatTime(msg.created_at)}
                            </div>
                          );
                        }

                        const isMine = msg.user_id === session.user_id;
                        return (
                          <div
                            key={key}
                            className={`msg-row ${isMine ? 'mine' : 'theirs'}`}
                          >
                            <div className="msg-meta">
                              <strong>{msg.nickname || '익명'}</strong>
                              <span>{formatTime(msg.created_at)}</span>
                            </div>
                            <div className="msg-bubble">{msg.content}</div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input Form */}
                  <form className="chat-input-bar" onSubmit={handleSendChat}>
                    <input
                      type="text"
                      placeholder={
                        wsConnected
                          ? `${session.nickname}(으)로 메시지 입력...`
                          : 'WebSocket 연결이 끊어졌습니다.'
                      }
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={!wsConnected}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!wsConnected || !chatInput.trim()}
                    >
                      <Send size={15} />
                      전송
                    </button>
                  </form>
                </div>

                {/* Live Participants (`room_state` event) */}
                <aside className="participants-panel">
                  <div className="participants-header">
                    <span>실시간 참여자 (room_state)</span>
                    <span className="badge badge-capacity">
                      {participants.length}명
                    </span>
                  </div>
                  <div className="participants-list">
                    {participants.map((p) => {
                      const isMe = p.user_id === session.user_id;
                      return (
                        <div key={p.user_id} className="participant-item">
                          <div className="participant-avatar">
                            {(p.nickname || '?').slice(0, 1).toUpperCase()}
                          </div>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <div style={{ fontWeight: 600 }}>
                              {p.nickname}{' '}
                              {isMe && (
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    color: '#818cf8',
                                  }}
                                >
                                  (나)
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: '0.68rem',
                                color: 'var(--text-muted)',
                              }}
                            >
                              {p.user_id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </aside>
              </div>
            </>
          )}
        </main>

        {/* Right Pane: Real-time REST & WebSocket Inspector */}
        {showInspector && (
          <aside className="inspector-pane">
            <div className="participants-header">
              <span>실시간 API / WS 패킷 로그</span>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                onClick={() => setLogs([])}
              >
                비우기
              </button>
            </div>
            <div className="inspector-list">
              {logs.length === 0 ? (
                <div className="empty-state" style={{ padding: '16px' }}>
                  <p style={{ fontSize: '0.78rem' }}>아직 기록된 패킷이 없습니다.</p>
                </div>
              ) : (
                logs.map((item, i) => (
                  <div key={i} className="log-entry">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color:
                          item.kind.startsWith('WS') ? '#34d399' : '#818cf8',
                        fontWeight: 700,
                      }}
                    >
                      <span>{item.direction}</span>
                      <span>
                        {item.status}
                        {item.elapsedMs !== undefined ? ` (${item.elapsedMs}ms)` : ''}
                      </span>
                    </div>
                    <pre>{JSON.stringify(item.payload, null, 2)}</pre>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Modal 1: Create Room (`POST /api/rooms`) */}
      <ModalDialog
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
        title="새 채팅방 만들기 (POST /api/rooms)"
        titleId="create-room-dialog-title"
      >
        <form className="form-stack" onSubmit={handleCreateRoom}>
          {createRoomError && (
            <div className="error-banner">{createRoomError}</div>
          )}

          <div className="form-field">
            <label htmlFor="room-name-input">
              채팅방 이름 (최대 60자, 중복 불가)
            </label>
            <input
              id="room-name-input"
              type="text"
              className="form-input"
              maxLength={60}
              placeholder="예: 자유 수다방 / 비밀 프로젝트방"
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
                if (createRoomError) setCreateRoomError('');
              }}
            />
            {roomName.trim() &&
              rooms.some(
                (r) =>
                  r.name?.trim().toLowerCase() ===
                  roomName.trim().toLowerCase(),
              ) && (
                <span style={{ fontSize: '0.78rem', color: '#f87171' }}>
                  이미 같은 이름의 채팅방이 존재합니다.
                </span>
              )}
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={roomIsPrivate}
              onChange={(e) => setRoomIsPrivate(e.target.checked)}
            />
            <span>비공개 방으로 설정 (비밀번호 필요, is_private: true)</span>
          </label>

          {roomIsPrivate && (
            <div className="form-field">
              <label htmlFor="room-password-input">비공개 방 비밀번호</label>
              <input
                id="room-password-input"
                type="password"
                className="form-input"
                placeholder="입장 비밀번호 입력"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
              />
            </div>
          )}

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={roomIsUnlimited}
              onChange={(e) => setRoomIsUnlimited(e.target.checked)}
            />
            <span>인원수 무제한 (is_unlimited: true, 최대 100명 자동 설정)</span>
          </label>

          {!roomIsUnlimited && (
            <div className="form-field">
              <label htmlFor="room-max-users">최대 인원수 지정 (1 ~ 100명)</label>
              <input
                id="room-max-users"
                type="number"
                min={1}
                max={100}
                className="form-input"
                value={roomMaxUsers}
                onChange={(e) => setRoomMaxUsers(e.target.value)}
              />
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '6px',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsCreateRoomOpen(false)}
            >
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              방 생성 및 입장
            </button>
          </div>
        </form>
      </ModalDialog>

      {/* Modal 2: Private Room Password Verification (`POST /api/rooms/{id}/verify`) */}
      <ModalDialog
        isOpen={Boolean(verifyTargetRoom)}
        onClose={() => setVerifyTargetRoom(null)}
        title={`비공개 방 입장 확인 — ${verifyTargetRoom?.name || ''}`}
        titleId="verify-room-dialog-title"
      >
        <form className="form-stack" onSubmit={handleVerifyPrivateRoom}>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            비공개 채팅방입니다. <code>POST /api/rooms/&#123;id&#125;/verify</code>로
            비밀번호와 정원을 사전 확인한 뒤 접속합니다.
          </p>

          {verifyError && <div className="error-banner">{verifyError}</div>}

          <div className="form-field">
            <label htmlFor="verify-password-input">비밀번호</label>
            <input
              id="verify-password-input"
              type="password"
              className="form-input"
              placeholder="방 비밀번호를 입력하세요"
              value={verifyPasswordInput}
              onChange={(e) => setVerifyPasswordInput(e.target.value)}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '6px',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setVerifyTargetRoom(null)}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={verifyLoading}
            >
              {verifyLoading ? '확인 중...' : '검증 후 입장하기'}
            </button>
          </div>
        </form>
      </ModalDialog>

      {/* Modal 3: Change Nickname (`PUT /api/auth/nickname`) */}
      <ModalDialog
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        title="닉네임 변경 (PUT /api/auth/nickname)"
        titleId="nickname-dialog-title"
      >
        <form className="form-stack" onSubmit={handleUpdateNickname}>
          {nicknameError && <div className="error-banner">{nicknameError}</div>}

          <div className="form-field">
            <label htmlFor="new-nickname-input">
              새 닉네임 (1 ~ 30자, 중복 불가)
            </label>
            <input
              id="new-nickname-input"
              type="text"
              className="form-input"
              maxLength={30}
              value={newNickname}
              onChange={(e) => {
                setNewNickname(e.target.value);
                if (nicknameError) setNicknameError('');
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '6px',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsNicknameModalOpen(false)}
            >
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              변경 저장
            </button>
          </div>
        </form>
      </ModalDialog>

      {/* Modal 4: Confirm Room Switch */}
      <ModalDialog
        isOpen={Boolean(switchTargetRoom)}
        onClose={() => setSwitchTargetRoom(null)}
        title="채팅방 이동 확인"
        titleId="switch-room-dialog-title"
      >
        <div className="form-stack">
          <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
            정말로 다른 방으로 이동 하시겠습니까?
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            현재 참여 중인 <strong>{activeRoom?.name}</strong> 방에서 퇴장하고{' '}
            <strong>{switchTargetRoom?.name}</strong> 방으로 이동합니다.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '8px',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSwitchTargetRoom(null)}
            >
              아니오
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirmSwitchRoom}
            >
              예
            </button>
          </div>
        </div>
      </ModalDialog>
    </>
  );
}

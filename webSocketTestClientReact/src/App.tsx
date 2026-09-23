import React, { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { ConnectionBar } from './components/ConnectionBar';
import { BroadcastPanel } from './components/BroadcastPanel';
import { RoomPanel } from './components/RoomPanel';
import { DirectMessagePanel } from './components/DirectMessagePanel';
import { EchoDiagnosisPanel } from './components/EchoDiagnosisPanel';
import { RestApiPanel } from './components/RestApiPanel';
import { PacketInspector } from './components/PacketInspector';
import './App.css';

type ActiveTab = 'BROADCAST' | 'ROOMS' | 'DM' | 'ECHO' | 'REST';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('BROADCAST');

  const ws = useWebSocket({
    defaultUrl: 'ws://localhost:8080/ws',
    defaultUserId: 'user_' + Math.floor(1000 + Math.random() * 9000),
    defaultNickname: '테스터',
    autoHeartbeat: true,
    heartbeatIntervalMs: 30000,
    autoReconnect: true,
  });

  const isConnected = ws.status === 'CONNECTED';
  const currentSender = ws.nickname || ws.userId;

  return (
    <div className="app-container">
      {/* 1. 상단 연결 바 */}
      <ConnectionBar
        url={ws.url}
        setUrl={ws.setUrl}
        userId={ws.userId}
        setUserId={ws.setUserId}
        nickname={ws.nickname}
        setNickname={ws.setNickname}
        status={ws.status}
        serverInfo={ws.serverInfo}
        heartbeatActive={ws.heartbeatActive}
        setHeartbeatActive={ws.setHeartbeatActive}
        reconnectActive={ws.reconnectActive}
        setReconnectActive={ws.setReconnectActive}
        lastRtt={ws.lastRtt}
        onConnect={ws.connect}
        onDisconnect={ws.disconnect}
        onSendPing={ws.sendPing}
      />

      {/* 2. 메인 대시보드 레이아웃 (탭 패널 + 패킷 인스펙터) */}
      <div className="dashboard-grid">
        <div className="main-panel">
          {/* 네비게이션 탭 바 */}
          <div className="nav-tabs">
            <button
              className={`nav-tab-btn ${activeTab === 'BROADCAST' ? 'active' : ''}`}
              onClick={() => setActiveTab('BROADCAST')}
            >
              📢 전체 브로드캐스트
              {ws.broadcastMessages.length > 0 && (
                <span className="tab-badge">{ws.broadcastMessages.length}</span>
              )}
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'ROOMS' ? 'active' : ''}`}
              onClick={() => setActiveTab('ROOMS')}
            >
              🚪 룸 / 채널 통신
              {ws.joinedRooms.length > 0 && (
                <span className="tab-badge room-badge">{ws.joinedRooms.length}개 방</span>
              )}
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'DM' ? 'active' : ''}`}
              onClick={() => setActiveTab('DM')}
            >
              💬 1:1 다이렉트 메시지
              {ws.directMessages.length > 0 && (
                <span className="tab-badge dm-badge">{ws.directMessages.length}</span>
              )}
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'ECHO' ? 'active' : ''}`}
              onClick={() => setActiveTab('ECHO')}
            >
              ⚡ 에코 & RTT 진단
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'REST' ? 'active' : ''}`}
              onClick={() => setActiveTab('REST')}
            >
              🌐 REST API 관리
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="tab-content-container">
            {activeTab === 'BROADCAST' && (
              <BroadcastPanel
                messages={ws.broadcastMessages}
                isConnected={isConnected}
                onSend={ws.sendBroadcast}
                currentSender={currentSender}
              />
            )}

            {activeTab === 'ROOMS' && (
              <RoomPanel
                joinedRooms={ws.joinedRooms}
                messages={ws.roomMessages}
                isConnected={isConnected}
                onJoinRoom={ws.joinRoom}
                onLeaveRoom={ws.leaveRoom}
                onSendRoomMessage={ws.sendRoomMessage}
                currentSender={currentSender}
              />
            )}

            {activeTab === 'DM' && (
              <DirectMessagePanel
                messages={ws.directMessages}
                isConnected={isConnected}
                onSendDirectMessage={ws.sendDirectMessage}
                currentSender={currentSender}
              />
            )}

            {activeTab === 'ECHO' && (
              <EchoDiagnosisPanel
                isConnected={isConnected}
                onSendEcho={ws.sendEcho}
                onSendPing={ws.sendPing}
                echoReplies={ws.echoReplies}
                lastRtt={ws.lastRtt}
              />
            )}

            {activeTab === 'REST' && <RestApiPanel />}
          </div>
        </div>

        {/* 3. 우측 실시간 패킷 인스펙터 */}
        <div className="side-panel">
          <PacketInspector logs={ws.logs} onClear={ws.clearLogs} />
        </div>
      </div>
    </div>
  );
}

export default App;

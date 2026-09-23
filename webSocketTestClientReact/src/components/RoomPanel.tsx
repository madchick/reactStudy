import React, { useState } from 'react';
import { WsMessage } from '../types/websocket';

interface RoomPanelProps {
  joinedRooms: string[];
  messages: WsMessage[];
  isConnected: boolean;
  onJoinRoom: (roomId: string) => boolean;
  onLeaveRoom: (roomId: string) => boolean;
  onSendRoomMessage: (roomId: string, payload: any) => boolean;
  currentSender: string;
}

export const RoomPanel: React.FC<RoomPanelProps> = ({
  joinedRooms,
  messages,
  isConnected,
  onJoinRoom,
  onLeaveRoom,
  onSendRoomMessage,
  currentSender,
}) => {
  const [newRoomId, setNewRoomId] = useState('dev-chat');
  const [selectedRoom, setSelectedRoom] = useState<string>('dev-chat');
  const [roomInput, setRoomInput] = useState('');

  // 현재 참여 중인 방이 바뀔 때 선택된 방 보정
  const activeRoom = joinedRooms.includes(selectedRoom)
    ? selectedRoom
    : joinedRooms[0] || '';

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomId.trim()) return;
    if (onJoinRoom(newRoomId.trim())) {
      setSelectedRoom(newRoomId.trim());
    }
  };

  const handleLeave = (roomId: string) => {
    onLeaveRoom(roomId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomInput.trim() || !activeRoom) return;
    if (onSendRoomMessage(activeRoom, roomInput)) {
      setRoomInput('');
    }
  };

  const currentRoomMessages = messages.filter((m) => m.roomId === activeRoom);

  return (
    <div className="tab-card room-panel">
      <div className="tab-card-header">
        <div>
          <h3>🚪 룸 / 채널 통신 (ROOM_*)</h3>
          <p className="section-desc">
            특정 룸(Channel/Room)에 가입(JOIN)한 사용자들끼리 격리된 그룹 메시지를 주고받습니다.
          </p>
        </div>
      </div>

      <div className="room-control-bar">
        <form onSubmit={handleJoin} className="room-join-form">
          <input
            type="text"
            value={newRoomId}
            onChange={(e) => setNewRoomId(e.target.value)}
            placeholder="룸 ID 입력 (예: dev-chat)"
            disabled={!isConnected}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isConnected || !newRoomId.trim()}
          >
            룸 입장 (ROOM_JOIN)
          </button>
        </form>

        <div className="joined-rooms-list">
          <span className="label">참여 중인 룸:</span>
          {joinedRooms.length === 0 ? (
            <span className="no-rooms-tag">참여 중인 방이 없습니다.</span>
          ) : (
            joinedRooms.map((r) => (
              <div
                key={r}
                className={`room-chip ${r === activeRoom ? 'active' : ''}`}
                onClick={() => setSelectedRoom(r)}
              >
                <span>#{r}</span>
                <button
                  type="button"
                  className="room-leave-btn"
                  title="방 퇴장"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLeave(r);
                  }}
                  disabled={!isConnected}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {activeRoom ? (
        <>
          <div className="room-chat-header">
            <h4># {activeRoom} 방 대화</h4>
          </div>
          <div className="message-history">
            {currentRoomMessages.length === 0 ? (
              <div className="empty-state">
                #{activeRoom} 방에 아직 메시지가 없습니다. 첫 메시지를 보내보세요!
              </div>
            ) : (
              currentRoomMessages.map((msg, idx) => {
                const isMe = msg.sender === currentSender;
                const timeStr = msg.timestamp
                  ? new Date(msg.timestamp).toLocaleTimeString()
                  : new Date().toLocaleTimeString();

                return (
                  <div
                    key={idx}
                    className={`chat-bubble-row ${isMe ? 'chat-mine' : 'chat-other'}`}
                  >
                    <div className="chat-bubble">
                      <div className="chat-bubble-meta">
                        <span className="sender-tag">{msg.sender || '알 수 없음'}</span>
                        <span className="time-tag">{timeStr}</span>
                      </div>
                      <div className="chat-content">
                        {typeof msg.payload === 'object' ? (
                          <pre>{JSON.stringify(msg.payload, null, 2)}</pre>
                        ) : (
                          <span>{String(msg.payload)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form className="message-input-bar" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="flex-1"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder={`#${activeRoom} 에 메시지 전송 (ROOM_MESSAGE)`}
              disabled={!isConnected}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isConnected || !roomInput.trim()}
            >
              전송
            </button>
          </form>
        </>
      ) : (
        <div className="empty-state large">
          위에서 룸 ID를 입력하고 <strong>[룸 입장]</strong> 버튼을 눌러 참여해 주세요.
        </div>
      )}
    </div>
  );
};

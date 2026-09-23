import React, { useState } from 'react';
import { WsMessage } from '../types/websocket';

interface DirectMessagePanelProps {
  messages: WsMessage[];
  isConnected: boolean;
  onSendDirectMessage: (target: string, payload: any) => boolean;
  currentSender: string;
}

export const DirectMessagePanel: React.FC<DirectMessagePanelProps> = ({
  messages,
  isConnected,
  onSendDirectMessage,
  currentSender,
}) => {
  const [targetId, setTargetId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [activePartner, setActivePartner] = useState<string>('');

  // 주고받은 DM 대상 목록 추출
  const partners = Array.from(
    new Set(
      messages
        .map((m) => (m.sender === currentSender ? m.target : m.sender))
        .filter(Boolean) as string[]
    )
  );

  const selectedTarget = activePartner || targetId;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTarget = (targetId || activePartner).trim();
    if (!finalTarget || !messageText.trim()) return;

    if (onSendDirectMessage(finalTarget, messageText)) {
      setMessageText('');
      if (!activePartner) {
        setActivePartner(finalTarget);
      }
    }
  };

  // 선택된 상대와의 메시지 필터링
  const filteredMessages = selectedTarget
    ? messages.filter(
        (m) =>
          (m.sender === selectedTarget && m.target === currentSender) ||
          (m.sender === currentSender && m.target === selectedTarget) ||
          m.target === selectedTarget ||
          m.sender === selectedTarget
      )
    : messages;

  return (
    <div className="tab-card dm-panel">
      <div className="tab-card-header">
        <div>
          <h3>💬 1:1 다이렉트 메시지 (DIRECT_MESSAGE)</h3>
          <p className="section-desc">
            특정 사용자(userId 또는 sessionId)에게 직접 비밀 메시지를 송신합니다.
          </p>
        </div>
      </div>

      <div className="dm-setup-bar">
        <div className="input-group flex-1">
          <label>수신 대상 (userId 또는 sessionId)</label>
          <div className="dm-target-row">
            <input
              type="text"
              value={targetId}
              onChange={(e) => {
                setTargetId(e.target.value);
                setActivePartner(e.target.value);
              }}
              placeholder="예: user_guest 또는 세션UUID"
              disabled={!isConnected}
            />
            {partners.length > 0 && (
              <div className="recent-partners">
                <span className="recent-label">최근 대화:</span>
                {partners.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`btn-tag ${activePartner === p ? 'active' : ''}`}
                    onClick={() => {
                      setActivePartner(p);
                      setTargetId(p);
                    }}
                  >
                    @{p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="message-history">
        {filteredMessages.length === 0 ? (
          <div className="empty-state">
            {selectedTarget
              ? `@${selectedTarget} 님과의 대화 내역이 없습니다.`
              : '수신 대상을 지정하고 메시지를 보내보세요.'}
          </div>
        ) : (
          filteredMessages.map((msg, idx) => {
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
                    <span className="sender-tag">
                      {isMe ? `To @${msg.target}` : `From @${msg.sender}`}
                    </span>
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

      <form className="message-input-bar" onSubmit={handleSend}>
        <input
          type="text"
          className="flex-1"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={
            selectedTarget
              ? `@${selectedTarget} 님에게 전송할 메시지...`
              : '수신 대상 아이디를 먼저 지정해 주세요'
          }
          disabled={!isConnected || !selectedTarget}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isConnected || !selectedTarget || !messageText.trim()}
        >
          1:1 전송
        </button>
      </form>
    </div>
  );
};

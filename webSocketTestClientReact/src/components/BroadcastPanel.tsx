import React, { useState } from 'react';
import { WsMessage } from '../types/websocket';

interface BroadcastPanelProps {
  messages: WsMessage[];
  isConnected: boolean;
  onSend: (payload: any) => boolean;
  currentSender: string;
}

export const BroadcastPanel: React.FC<BroadcastPanelProps> = ({
  messages,
  isConnected,
  onSend,
  currentSender,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    if (isJsonMode) {
      try {
        const parsed = JSON.parse(inputVal);
        setJsonError(null);
        if (onSend(parsed)) {
          setInputVal('');
        }
      } catch (err: any) {
        setJsonError(`유효하지 않은 JSON 형식입니다: ${err.message}`);
      }
    } else {
      if (onSend(inputVal)) {
        setInputVal('');
      }
    }
  };

  return (
    <div className="tab-card">
      <div className="tab-card-header">
        <div>
          <h3>📢 전체 브로드캐스트 (BROADCAST)</h3>
          <p className="section-desc">
            현재 WebSocket 서버에 접속된 모든 클라이언트에게 실시간 메시지를 전송합니다.
          </p>
        </div>
        <div className="toggle-mode">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isJsonMode}
              onChange={(e) => {
                setIsJsonMode(e.target.checked);
                setJsonError(null);
              }}
            />
            JSON Payload 모드
          </label>
        </div>
      </div>

      <div className="message-history">
        {messages.length === 0 ? (
          <div className="empty-state">
            아직 수신된 브로드캐스트 메시지가 없습니다. 메시지를 보내보세요!
          </div>
        ) : (
          messages.map((msg, idx) => {
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

      <form className="message-input-bar" onSubmit={handleSend}>
        {isJsonMode ? (
          <textarea
            className="flex-1"
            rows={2}
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setJsonError(null);
            }}
            placeholder='{"notice": "긴급 점검", "level": 1}'
            disabled={!isConnected}
          />
        ) : (
          <input
            type="text"
            className="flex-1"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="전체 공지 메시지를 입력하세요..."
            disabled={!isConnected}
          />
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isConnected || !inputVal.trim()}
        >
          전송
        </button>
      </form>
      {jsonError && <div className="form-error">{jsonError}</div>}
    </div>
  );
};

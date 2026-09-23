import React, { useState } from 'react';
import { LogFrame } from '../types/websocket';

interface PacketInspectorProps {
  logs: LogFrame[];
  onClear: () => void;
}

export const PacketInspector: React.FC<PacketInspectorProps> = ({ logs, onClear }) => {
  const [filter, setFilter] = useState<'ALL' | 'TX' | 'RX' | 'SYS_ERR'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'ALL') return true;
    if (filter === 'TX') return log.direction === 'TX';
    if (filter === 'RX') return log.direction === 'RX';
    if (filter === 'SYS_ERR') return log.direction === 'SYS' || log.direction === 'ERR';
    return true;
  });

  const handleCopy = (log: LogFrame) => {
    navigator.clipboard.writeText(log.raw);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="packet-inspector card">
      <div className="inspector-header">
        <div className="inspector-title-area">
          <span className="inspector-icon">🔍</span>
          <h3>실시간 패킷 인스펙터 (Live Frames)</h3>
          <span className="frame-count-pill">{logs.length} Frames</span>
        </div>

        <div className="inspector-actions">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              전체
            </button>
            <button
              className={`filter-btn ${filter === 'TX' ? 'active' : ''}`}
              onClick={() => setFilter('TX')}
            >
              송신 (TX)
            </button>
            <button
              className={`filter-btn ${filter === 'RX' ? 'active' : ''}`}
              onClick={() => setFilter('RX')}
            >
              수신 (RX)
            </button>
            <button
              className={`filter-btn ${filter === 'SYS_ERR' ? 'active' : ''}`}
              onClick={() => setFilter('SYS_ERR')}
            >
              시스템/에러
            </button>
          </div>
          <button className="btn-sm btn-outline danger" onClick={onClear}>
            로그 비우기
          </button>
        </div>
      </div>

      <div className="inspector-log-container">
        {filteredLogs.length === 0 ? (
          <div className="empty-state">
            해당 조건의 패킷 로그가 없습니다.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString();
            let parsedDisplay = null;
            try {
              const obj = JSON.parse(log.raw);
              parsedDisplay = JSON.stringify(obj, null, 2);
            } catch {
              parsedDisplay = log.raw;
            }

            return (
              <div key={log.id} className={`log-item log-dir-${log.direction.toLowerCase()}`}>
                <div className="log-item-header">
                  <div className="log-item-left">
                    <span className={`direction-badge dir-${log.direction.toLowerCase()}`}>
                      {log.direction}
                    </span>
                    <span className="log-timestamp">{timeStr}</span>
                    {log.parsed?.type && (
                      <span className="log-type-tag">{log.parsed.type}</span>
                    )}
                    {log.parsed?.sender && (
                      <span className="log-sender-tag">from:{log.parsed.sender}</span>
                    )}
                    {log.parsed?.roomId && (
                      <span className="log-room-tag">#{log.parsed.roomId}</span>
                    )}
                    {log.parsed?.target && (
                      <span className="log-target-tag">to:{log.parsed.target}</span>
                    )}
                  </div>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(log)}
                    title="JSON 복사"
                  >
                    {copiedId === log.id ? '✓ 복사됨' : '복사'}
                  </button>
                </div>
                <div className="log-payload-preview">
                  <pre>{parsedDisplay}</pre>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

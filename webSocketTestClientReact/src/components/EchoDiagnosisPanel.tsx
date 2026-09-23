import React, { useState } from 'react';

interface EchoDiagnosisPanelProps {
  isConnected: boolean;
  onSendEcho: (content: any) => boolean;
  onSendPing: () => boolean;
  echoReplies: Array<{ rtt: number; data: any; time: number }>;
  lastRtt: number | null;
}

export const EchoDiagnosisPanel: React.FC<EchoDiagnosisPanelProps> = ({
  isConnected,
  onSendEcho,
  onSendPing,
  echoReplies,
  lastRtt,
}) => {
  const [echoText, setEchoText] = useState('왕복 지연시간(RTT) 측정 테스트');
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);

  const handleSendSingleEcho = () => {
    if (!echoText.trim()) return;
    onSendEcho(echoText.trim());
  };

  const handleRunBenchmark = async () => {
    if (isRunningBenchmark || !isConnected) return;
    setIsRunningBenchmark(true);

    for (let i = 1; i <= 5; i++) {
      onSendEcho(`벤치마크 핑테스트 #${i}`);
      await new Promise((r) => setTimeout(r, 400));
    }

    setIsRunningBenchmark(false);
  };

  // 통계 계산
  const rttList = echoReplies.map((r) => r.rtt).filter((v) => v > 0);
  const minRtt = rttList.length ? Math.min(...rttList) : 0;
  const maxRtt = rttList.length ? Math.max(...rttList) : 0;
  const avgRtt = rttList.length
    ? Math.round(rttList.reduce((a, b) => a + b, 0) / rttList.length)
    : 0;

  return (
    <div className="tab-card echo-panel">
      <div className="tab-card-header">
        <div>
          <h3>⚡ 에코 및 RTT 진단 (ECHO & PING)</h3>
          <p className="section-desc">
            서버와 클라이언트 간의 네트워크 왕복 지연시간(RTT: Round Trip Time)을 정밀 측정합니다.
          </p>
        </div>
      </div>

      <div className="metric-cards-grid">
        <div className="metric-card">
          <div className="metric-label">최근 하트비트 PING RTT</div>
          <div className="metric-val">{lastRtt !== null ? `${lastRtt} ms` : '-'}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">ECHO 평균 RTT</div>
          <div className="metric-val">{avgRtt > 0 ? `${avgRtt} ms` : '-'}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">ECHO 최소 / 최대</div>
          <div className="metric-val">
            {minRtt > 0 ? `${minRtt} ms / ${maxRtt} ms` : '-'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">총 측정 횟수</div>
          <div className="metric-val">{echoReplies.length}회</div>
        </div>
      </div>

      <div className="echo-controls">
        <div className="echo-input-row">
          <input
            type="text"
            className="flex-1"
            value={echoText}
            onChange={(e) => setEchoText(e.target.value)}
            placeholder="에코로 보낼 페이로드 내용 입력..."
            disabled={!isConnected}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSendSingleEcho}
            disabled={!isConnected || !echoText.trim()}
          >
            단일 ECHO 전송
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleRunBenchmark}
            disabled={!isConnected || isRunningBenchmark}
          >
            {isRunningBenchmark ? '측정 진행 중...' : '연속 5회 벤치마크'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onSendPing()}
            disabled={!isConnected}
          >
            수동 PING
          </button>
        </div>
      </div>

      <div className="echo-history-section">
        <h4>ECHO 회신 응답 기록</h4>
        <div className="echo-log-list">
          {echoReplies.length === 0 ? (
            <div className="empty-state">
              에코 테스트 기록이 없습니다. 상단 버튼을 눌러 테스트를 실행해보세요.
            </div>
          ) : (
            echoReplies.map((item, idx) => (
              <div key={idx} className="echo-log-item">
                <span className="echo-time">
                  {new Date(item.time).toLocaleTimeString()}
                </span>
                <span className={`echo-rtt ${item.rtt < 10 ? 'fast' : item.rtt < 50 ? 'normal' : 'slow'}`}>
                  {item.rtt} ms
                </span>
                <span className="echo-payload">
                  <code>{JSON.stringify(item.data)}</code>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

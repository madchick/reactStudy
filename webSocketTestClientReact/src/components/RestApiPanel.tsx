import React, { useState } from 'react';
import { defaultRestApi } from '../services/restApi';
import { ServerSessionInfo, ServerStatusInfo } from '../types/websocket';

export const RestApiPanel: React.FC = () => {
  const [restBaseUrl, setRestBaseUrl] = useState('http://localhost:8080');
  const [serverStatus, setServerStatus] = useState<ServerStatusInfo | null>(null);
  const [sessions, setSessions] = useState<ServerSessionInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // REST Broadcast 폼
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);

  // REST Push 폼
  const [pushTarget, setPushTarget] = useState('');
  const [pushSender, setPushSender] = useState('SERVER_ADMIN');
  const [pushMsg, setPushMsg] = useState('');
  const [pushResult, setPushResult] = useState<string | null>(null);

  const updateUrl = (url: string) => {
    setRestBaseUrl(url);
    defaultRestApi.setBaseUrl(url);
  };

  const handleFetchStatus = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await defaultRestApi.getStatus();
      setServerStatus(data);
    } catch (err: any) {
      setApiError(`Status 조회 실패: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchSessions = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await defaultRestApi.getSessions();
      setSessions(data);
    } catch (err: any) {
      setApiError(`Sessions 조회 실패: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    setIsLoading(true);
    setBroadcastResult(null);
    setApiError(null);
    try {
      const res = await defaultRestApi.broadcast(broadcastMsg.trim());
      setBroadcastResult(JSON.stringify(res, null, 2));
      setBroadcastMsg('');
    } catch (err: any) {
      setApiError(`REST Broadcast 실패: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTarget.trim() || !pushMsg.trim()) return;
    setIsLoading(true);
    setPushResult(null);
    setApiError(null);
    try {
      const res = await defaultRestApi.sendToUser({
        target: pushTarget.trim(),
        sender: pushSender.trim() || undefined,
        message: pushMsg.trim(),
      });
      setPushResult(JSON.stringify(res, null, 2));
      setPushMsg('');
    } catch (err: any) {
      setApiError(`REST 단독 푸시 실패: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tab-card rest-panel">
      <div className="tab-card-header">
        <div>
          <h3>🌐 REST API 관리자 및 모니터링</h3>
          <p className="section-desc">
            Spring Boot 백엔드의 보조 HTTP 엔드포인트를 호출하여 서버 상태를 점검하거나 외부 푸시 메시지를 발송합니다.
          </p>
        </div>
      </div>

      <div className="rest-url-bar">
        <label>Spring Boot REST Base URL:</label>
        <input
          type="text"
          value={restBaseUrl}
          onChange={(e) => updateUrl(e.target.value)}
          placeholder="http://localhost:8080"
        />
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleFetchStatus}
          disabled={isLoading}
        >
          서버 상태 조회 (GET /api/status)
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleFetchSessions}
          disabled={isLoading}
        >
          세션 목록 조회 (GET /api/sessions)
        </button>
      </div>

      {apiError && <div className="alert alert-error">{apiError}</div>}

      {/* 상태 및 세션 표시 영역 */}
      <div className="rest-results-grid">
        {serverStatus && (
          <div className="result-box">
            <h4>📊 서버 상태 정보 (/api/status)</h4>
            <pre>{JSON.stringify(serverStatus, null, 2)}</pre>
          </div>
        )}

        {sessions && (
          <div className="result-box">
            <h4>👥 활성 세션 목록 (/api/sessions - 총 {sessions.length}건)</h4>
            <div className="table-responsive">
              <table className="sessions-table">
                <thead>
                  <tr>
                    <th>세션 ID</th>
                    <th>User ID</th>
                    <th>Client IP</th>
                    <th>접속 시간</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center">접속된 세션이 없습니다.</td>
                    </tr>
                  ) : (
                    sessions.map((s, idx) => (
                      <tr key={idx}>
                        <td><code>{s.sessionId}</code></td>
                        <td>{s.userId || '-'}</td>
                        <td>{s.clientIp || '-'}</td>
                        <td>{s.connectedAt ? new Date(s.connectedAt).toLocaleTimeString() : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="rest-actions-grid">
        {/* REST Broadcast */}
        <div className="action-card">
          <h4>📢 REST 전체 브로드캐스트 (POST /api/broadcast)</h4>
          <p className="card-hint">HTTP 호출을 통해 모든 웹소켓 클라이언트에게 공지 발송</p>
          <form onSubmit={handleSendBroadcast}>
            <input
              type="text"
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              placeholder="예: 서버 점검 예정 안내"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading || !broadcastMsg.trim()}
            >
              전체 공지 푸시 발송
            </button>
          </form>
          {broadcastResult && (
            <div className="api-result-preview">
              <span className="success-tag">발송 완료</span>
              <pre>{broadcastResult}</pre>
            </div>
          )}
        </div>

        {/* REST Send to User */}
        <div className="action-card">
          <h4>🎯 REST 특정 대상 단독 푸시 (POST /api/send-to-user)</h4>
          <p className="card-hint">특정 사용자(userId 또는 sessionId)에게 단독 푸시 메시지 발송</p>
          <form onSubmit={handleSendPush} className="push-form">
            <div className="form-row">
              <input
                type="text"
                value={pushTarget}
                onChange={(e) => setPushTarget(e.target.value)}
                placeholder="대상 (userId 또는 sessionId)"
                disabled={isLoading}
              />
              <input
                type="text"
                value={pushSender}
                onChange={(e) => setPushSender(e.target.value)}
                placeholder="발신자 (기본: SERVER_ADMIN)"
                disabled={isLoading}
              />
            </div>
            <input
              type="text"
              value={pushMsg}
              onChange={(e) => setPushMsg(e.target.value)}
              placeholder="전달할 메시지 본문..."
              disabled={isLoading}
            />
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading || !pushTarget.trim() || !pushMsg.trim()}
            >
              단독 푸시 전송
            </button>
          </form>
          {pushResult && (
            <div className="api-result-preview">
              <span className="success-tag">푸시 전송 완료</span>
              <pre>{pushResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

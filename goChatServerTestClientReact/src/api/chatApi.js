const DEFAULT_BASE_URL = 'http://localhost:8080';

export function normalizeBaseUrl(url) {
  const trimmed = (url || DEFAULT_BASE_URL).trim().replace(/\/+$/, '');
  return trimmed || DEFAULT_BASE_URL;
}

export function getWsBaseUrl(httpBaseUrl) {
  const base = normalizeBaseUrl(httpBaseUrl);
  if (base.startsWith('https://')) {
    return 'wss://' + base.slice('https://'.length);
  }
  if (base.startsWith('http://')) {
    return 'ws://' + base.slice('http://'.length);
  }
  return `ws://${base}`;
}

async function requestJson(baseUrl, path, options = {}, onLog) {
  const url = `${normalizeBaseUrl(baseUrl)}${path}`;
  const method = options.method || 'GET';
  const startTime = performance.now();

  try {
    const response = await fetch(url, options);
    const elapsedMs = Math.round(performance.now() - startTime);
    const data = await response.json().catch(() => ({}));

    onLog?.({
      kind: 'REST',
      direction: `${method} ${path}`,
      status: response.status,
      elapsedMs,
      payload: data,
      timestamp: new Date().toISOString(),
    });

    if (!response.ok) {
      const err = new Error(data.error || `HTTP Error ${response.status}`);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    if (!err.status) {
      onLog?.({
        kind: 'REST_ERR',
        direction: `${method} ${path}`,
        status: 'NETWORK_ERROR',
        payload: { message: err.message },
        timestamp: new Date().toISOString(),
      });
    }
    throw err;
  }
}

export const chatApi = {
  // GET /api/health
  checkHealth(baseUrl, onLog) {
    return requestJson(baseUrl, '/api/health', { method: 'GET' }, onLog);
  },

  // POST /api/auth/session
  createSession(baseUrl, nickname, password = '', onLog) {
    const payload = { nickname };
    if (password) {
      payload.password = password;
    }
    return requestJson(
      baseUrl,
      '/api/auth/session',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      onLog,
    );
  },

  // GET /api/auth/me
  getMe(baseUrl, token, onLog) {
    return requestJson(
      baseUrl,
      '/api/auth/me',
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
      onLog,
    );
  },

  // PUT /api/auth/nickname
  updateNickname(baseUrl, token, nickname, onLog) {
    return requestJson(
      baseUrl,
      '/api/auth/nickname',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nickname }),
      },
      onLog,
    );
  },

  // GET /api/rooms?visibility=all|public|private
  listRooms(baseUrl, visibility = 'all', onLog) {
    return requestJson(
      baseUrl,
      `/api/rooms?visibility=${encodeURIComponent(visibility)}`,
      { method: 'GET' },
      onLog,
    );
  },

  // POST /api/rooms
  createRoom(baseUrl, token, roomPayload, onLog) {
    return requestJson(
      baseUrl,
      '/api/rooms',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomPayload),
      },
      onLog,
    );
  },

  // GET /api/rooms/{id}
  getRoom(baseUrl, roomId, onLog) {
    return requestJson(
      baseUrl,
      `/api/rooms/${encodeURIComponent(roomId)}`,
      { method: 'GET' },
      onLog,
    );
  },

  // DELETE /api/rooms/{id}
  deleteRoom(baseUrl, token, roomId, onLog) {
    return requestJson(
      baseUrl,
      `/api/rooms/${encodeURIComponent(roomId)}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
      onLog,
    );
  },

  // POST /api/rooms/{id}/verify
  verifyRoomAccess(baseUrl, roomId, password = '', onLog) {
    return requestJson(
      baseUrl,
      `/api/rooms/${encodeURIComponent(roomId)}/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      },
      onLog,
    );
  },

  // GET /api/rooms/{id}/messages?limit=50&before_id=0
  getRoomMessages(baseUrl, token, roomId, { limit = 50, beforeId = 0, password = '' } = {}, onLog) {
    const params = new URLSearchParams({
      limit: String(limit),
      before_id: String(beforeId),
    });
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (password) {
      headers['X-Room-Password'] = password;
      params.set('password', password);
    }

    return requestJson(
      baseUrl,
      `/api/rooms/${encodeURIComponent(roomId)}/messages?${params.toString()}`,
      {
        method: 'GET',
        headers,
      },
      onLog,
    );
  },

  // Build WebSocket URL: ws://<host>:8080/ws/rooms/{room_id}?token=<token>&password=<password>
  buildWsUrl(baseUrl, roomId, token, password = '') {
    const wsBase = getWsBaseUrl(baseUrl);
    const params = new URLSearchParams({ token });
    if (password) {
      params.set('password', password);
    }
    return `${wsBase}/ws/rooms/${encodeURIComponent(roomId)}?${params.toString()}`;
  },
};

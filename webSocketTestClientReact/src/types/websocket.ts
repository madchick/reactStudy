export type WsMessageType =
  | 'PING'
  | 'PONG'
  | 'ECHO'
  | 'BROADCAST'
  | 'ROOM_JOIN'
  | 'ROOM_MESSAGE'
  | 'ROOM_LEAVE'
  | 'DIRECT_MESSAGE'
  | 'SYSTEM_NOTICE'
  | 'ERROR';

export interface WsMessage<T = any> {
  type: WsMessageType | string;
  sender?: string;
  target?: string;
  roomId?: string;
  payload?: T;
  timestamp?: number;
}

export interface SystemNoticePayload {
  sessionId?: string;
  userId?: string;
  clientIp?: string;
  serverTime?: number;
  message?: string;
  status?: string;
  target?: string;
  [key: string]: any;
}

export type ConnectionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';

export interface LogFrame {
  id: string;
  direction: 'TX' | 'RX' | 'SYS' | 'ERR';
  timestamp: number;
  raw: string;
  parsed?: WsMessage;
}

export interface ConnectedUserInfo {
  sessionId?: string;
  userId?: string;
  clientIp?: string;
  serverTime?: number;
}

export interface ServerStatusInfo {
  status?: string;
  uptime?: number;
  activeSessions?: number;
  rooms?: Record<string, number>;
  [key: string]: any;
}

export interface ServerSessionInfo {
  sessionId: string;
  userId?: string;
  clientIp?: string;
  connectedAt?: number;
  [key: string]: any;
}

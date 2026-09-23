import { ServerSessionInfo, ServerStatusInfo } from '../types/websocket';

export interface SendToUserParams {
  target: string;
  sender?: string;
  message: string;
}

export class RestApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8080') {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async getStatus(): Promise<ServerStatusInfo> {
    const res = await fetch(`${this.baseUrl}/api/status`);
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  async getSessions(): Promise<ServerSessionInfo[]> {
    const res = await fetch(`${this.baseUrl}/api/sessions`);
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  async broadcast(message: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP Error ${res.status}: ${errText || res.statusText}`);
    }
    return res.json();
  }

  async sendToUser(params: SendToUserParams): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/send-to-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok || data.result === 'FAIL') {
      throw new Error(data.error || `HTTP Error ${res.status}`);
    }
    return data;
  }
}

export const defaultRestApi = new RestApiService();

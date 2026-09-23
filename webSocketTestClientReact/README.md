# 📡 WebSocket React + TypeScript 테스트 클라이언트

`WEBSOCKET_SPEC.md` 연동 규격을 완벽하게 지원하는 React + TypeScript 기반 웹소켓 테스트 클라이언트입니다.

---

## 🚀 빠른 시작 (Quick Start)

### 1. 개발 서버 실행
```bash
npm run dev
```
기본적으로 `http://localhost:3000`에서 개발 서버가 구동됩니다.

### 2. 프로덕션 빌드
```bash
npm run build
```

### 3. 미리보기 (Preview)
```bash
npm run preview
```

---

## 🛠️ 주요 기능 및 사양 매핑

| 기능 영역 | 프로토콜 명세 | 클라이언트 UI 지원 |
|---|---|---|
| **연결 관리** | `ws://localhost/ws/` (Nginx)<br>`ws://localhost:8080/ws` (Spring 직결) | 원클릭 프리셋 버튼 및 커스텀 URL 입력, 연결/해제 토글 |
| **핸드셰이크 식별자** | `?userId={id}&nickname={nick}` | User ID 및 닉네임 입력 폼 (URL 쿼리 스트링 자동 조합) |
| **연결 완료 알림** | `SYSTEM_NOTICE` | 서버가 부여한 `sessionId`, `clientIp`, `serverTime` 칩 표시 |
| **하트비트 (Keep-Alive)** | `PING` ➔ `PONG` (30초 주기 권장) | 30초 주기 자동 PING 송신 및 PONG 회신 시 실시간 RTT(ms) 측정 뱃지 표시 |
| **자동 재연결** | Exponential Backoff (1s ~ 30s) | 네트워크 단절(1006 등) 시 점진적 재연결 시도 체크박스 옵션 |
| **전체 브로드캐스트** | `BROADCAST` | 실시간 채팅창, 일반 텍스트 및 JSON 객체 Payload 송수신 모드 지원 |
| **룸 / 채널 통신** | `ROOM_JOIN`<br>`ROOM_MESSAGE`<br>`ROOM_LEAVE` | 룸 ID 입력 후 입장, 멀티 룸 탭 전환 및 룸별 격리 대화, 방 퇴장 기능 |
| **1:1 다이렉트 메시지** | `DIRECT_MESSAGE` | 수신 대상(`userId` 또는 `sessionId`) 지정, 1:1 대화 및 서버 배달 ACK(`DELIVERED`) 확인, 최근 대화 상대 퀵 태그 |
| **RTT 에코 진단** | `ECHO` / `PING` | 임의 데이터 전송 후 회신 RTT 지연시간(ms) 측정, 5회 연속 벤치마크, 최소/최대/평균 통계 |
| **REST API 보조 연동** | `/api/status`<br>`/api/sessions`<br>`/api/broadcast`<br>`/api/send-to-user` | 백엔드 상태 및 활성 세션 목록 조회, REST를 통한 브로드캐스트 및 대상 단독 푸시 발송 |
| **실시간 패킷 인스펙터** | 전체 프레임 모니터링 | 모든 WebSocket Frame (TX: 송신, RX: 수신, SYS: 시스템, ERR: 에러) 실시간 JSON 뷰어 및 클립보드 복사, 필터링, 로그 비우기 |

---

## 📁 프로젝트 구조

```
webSocketTestClientReact/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx                  # React 렌더링 엔트리
│   ├── App.tsx                   # 메인 대시보드 및 탭 레이아웃
│   ├── App.css                   # 모던 다크 대시보드 테마 스타일
│   ├── types/
│   │   └── websocket.ts          # Envelope 및 메시지 타입 정의
│   ├── hooks/
│   │   └── useWebSocket.ts       # 웹소켓 연결, 하트비트, 재연결, 송수신 커스텀 훅
│   ├── services/
│   │   └── restApi.ts            # Spring Boot REST 보조 API 호출 서비스
│   └── components/
│       ├── ConnectionBar.tsx     # 상단 연결 컨트롤러 및 세션 정보
│       ├── BroadcastPanel.tsx    # 전체 브로드캐스트 탭
│       ├── RoomPanel.tsx         # 룸/채널 통신 탭
│       ├── DirectMessagePanel.tsx# 1:1 다이렉트 메시지 탭
│       ├── EchoDiagnosisPanel.tsx# 에코 & RTT 진단 탭
│       ├── RestApiPanel.tsx      # REST API 서버 제어 탭
│       └── PacketInspector.tsx   # 실시간 송수신 프레임 인스펙터
```

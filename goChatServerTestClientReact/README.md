# goChatServer React 웹 클라이언트 (`goChatServerTestClientReact`)

`C:\Projects\goStudy\goChatServer`의 REST API 및 WebSocket 명세에 맞춰 동작하는 **React 19 + Vite** 기반 실시간 채팅 웹 클라이언트입니다.

---

## 1. 개발 환경 실행 방법

### 사전 준비
- **Node.js** 18 이상 (권장: 20 LTS 이상)
- **Go 채팅 서버 (`goChatServer`)** 실행 중 (기본 주소: `http://localhost:8080`)

```powershell
# 1. 의존성 패키지 설치
npm install

# 2. 개발 서버 실행 (포트 3000, 실행 시 웹 브라우저 자동 오픈)
npm run dev
```
- 접속 주소: `http://localhost:3000`
- 상단 바의 서버 주소 입력창에서 실행 중인 `goChatServer` 주소(기본값 `http://localhost:8080`)를 실시간으로 변경하고 연결 상태를 확인할 수 있습니다.

---

## 2. 빌드 방법 (Production Build)

프로덕션 배포를 위한 정적 파일(`HTML`, `CSS`, `JS` 번들)을 생성합니다.

```powershell
# 프로덕션 빌드 실행
npm run build
```

빌드가 완료되면 프로젝트 루트의 `dist/` 폴더에 최적화된 정적 파일들이 생성됩니다.

```text
dist/
├── index.html
└── assets/
    ├── index-xxxxxx.css
    └── index-xxxxxx.js
```

### 로컬에서 빌드 결과물 미리보기 (Preview)
배포 전 로컬에서 `dist/` 폴더의 프로덕션 빌드 산출물이 정상 동작하는지 확인할 수 있습니다.

```powershell
# 빌드 산출물 로컬 웹 서버로 실행 (기본 포트: 4173)
npm run preview

# 특정 포트로 프리뷰 실행 예시
npx vite preview --port 3000 --open
```

---

## 3. 배포 방법 (Deployment)

이 프로젝트는 순수 정적 SPA(Single Page Application)로 빌드되므로 `dist/` 폴더를 다양한 웹 서버나 클라우드 호스팅에 배포할 수 있습니다.

### 방법 A. Nginx 정적 서빙 + Go 서버 리버스 프록시 (권장)
`dist/` 폴더를 서버의 `/var/www/gochat-client` 등에 복사한 뒤, Nginx에서 정적 파일 서빙과 함께 `/api` 및 `/ws` 경로를 `goChatServer`(`localhost:8080`)로 프록시하도록 설정할 수 있습니다.

```nginx
server {
    listen 80;
    server_name chat.example.com;

    # 1. React 정적 빌드 파일 서빙
    root /var/www/gochat-client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Go 채팅 서버 REST API 프록시
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 3. Go 채팅 서버 WebSocket 프록시 (Upgrade 헤더 필수)
    location /ws/ {
        proxy_pass http://127.0.0.1:8080/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 3600s;
    }
}
```

### 방법 B. Docker (Multi-Stage Build)로 컨테이너 배포
프로젝트 루트에 아래 `Dockerfile`을 작성하여 빌드부터 Nginx 서빙까지 단일 이미지로 패키징할 수 있습니다.

```dockerfile
# Stage 1: Build React App
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```powershell
# 도커 이미지 빌드 및 컨테이너 실행 (포트 3000 -> 80)
docker build -t gochat-react-client .
docker run -d -p 3000:80 --name gochat-client gochat-react-client
```

### 방법 C. 클라우드 정적 호스팅 (Vercel / Netlify / Cloudflare Pages / Firebase Hosting)
- **Build Command**: `npm run build`
- **Output Directory (Publish Directory)**: `dist`
- **주의사항 (HTTPS & Mixed Content)**:
  - 웹 클라이언트를 `https://` 도메인에 배포하는 경우, 브라우저 보안 정책(Mixed Content 차단)으로 인해 평문 `http://` 또는 `ws://` 서버로 요청할 수 없습니다.
  - 따라서 운영 환경에서는 `goChatServer` 앞단에 SSL/TLS(HTTPS/WSS)가 적용된 도메인(`https://api.example.com`)을 연결해야 합니다. 클라이언트는 입력된 서버 주소가 `https://`로 시작하면 WebSocket 주소를 자동으로 `wss://`로 변환하여 접속합니다.

---

## 4. 지원 기능 (서버 명세 100% 대응)

- **세션/인증 관리**
  - `POST /api/auth/session`: 닉네임 + 비밀번호(PIN) 기반 신규 세션 토큰(`201 Created`) 발급 및 기존 닉네임 재사용/이어쓰기(`200 OK`, 기존 `user_id` 유지) 지원. 타인이 사용 중이거나 비밀번호 불일치 시 `409 Conflict` 에러 안내
  - `GET /api/auth/me`: 저장된 세션 유효성 확인
  - `PUT /api/auth/nickname`: 실시간 닉네임 변경 (중복 닉네임 `409 Conflict` 및 동일 닉네임 검증 지원)
  - 탭별 독립 세션(`sessionStorage`)을 사용하여 **"새 유저 탭 열기"** 버튼으로 한 브라우저에서 여러 명의 유저로 동시 채팅 테스트 가능
- **채팅방 조회 / 생성 / 삭제 / 사전 검증**
  - `GET /api/rooms?visibility=all|public|private`: 전체 / 공개방 / 비공개방 필터링, 검색, **내가 속한 방 최상단 고정(`참여 중` 배지)** 및 다른 방 이동 시 확인 모달 지원
  - `POST /api/rooms`: 공개/비공개 여부, 비밀번호, 인원 제한(`1~100명` 또는 `is_unlimited: true`) 설정 후 생성 (중복 방 이름 실시간 경고 및 `409 Conflict` 에러 처리 지원)
  - `POST /api/rooms/{id}/verify`: 입장 전 비밀번호(`403 Forbidden`), 자동 삭제된 빈 방(`404 Not Found`), 정원 초과(`409 Conflict`) 사전 검증
  - `DELETE /api/rooms/{id}`: 본인이 생성한 채팅방 삭제
- **이전 대화 내역 및 실시간 WebSocket 채팅**
  - `GET /api/rooms/{id}/messages?limit=50&before_id=0`: 입장 시 최근 대화 조회 및 `before_id` 기반 이전 대화 페이지네이션
  - `ws://<서버주소>:8080/ws/rooms/{id}?token=...&password=...`: 실시간 채팅(`chat`), 입퇴장 시스템 알림(`join`, `leave`), 실시간 접속자 목록(`room_state`) 동기화
  - 우측 **실시간 API / WS 패킷 로그** 패널을 통해 오가는 REST 및 WebSocket JSON 데이터를 스크롤하며 즉시 확인 가능

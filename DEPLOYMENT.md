# 배포 가이드

이 문서는 voicememo 프로젝트를 자체 서버에 배포하는 방법을 설명합니다.

## 📋 사전 요구사항

- Docker가 설치된 서버
- GitHub 저장소 접근 권한
- SSH 접속 가능한 서버

## 🔧 1. GitHub Secrets 설정

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 secrets를 추가하세요:

### SSH 관련
- `SSH_HOST`: 서버 IP 주소 (예: 175.196.226.236)
- `SSH_USER`: SSH 사용자명
- `SSH_PRIVATE_KEY`: SSH 개인키 전체 내용
- `SSH_PORT`: SSH 포트 (기본값: 22)

### 데이터베이스
- `DB_HOST`: MySQL 호스트 (컨테이너에서는 host.docker.internal 사용)
- `DB_PORT`: MySQL 포트 (기본값: 3306)
- `DB_USERNAME`: MySQL 사용자명
- `DB_PASSWORD`: MySQL 비밀번호
- `DB_DATABASE`: 데이터베이스 이름

### Google Cloud
- `GOOGLE_CLOUD_PROJECT_ID`: GCP 프로젝트 ID
- `GOOGLE_API_KEY`: Google API 키
- `GCS_BUCKET_NAME`: Cloud Storage 버킷 이름
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`: 서비스 계정 JSON 전체 내용

### OpenAI
- `OPENAI_API_KEY`: OpenAI API 키

## 🔑 2. SSH 키 생성 및 설정

서버에 SSH 키로 접속할 수 있도록 설정합니다:

```bash
# 로컬에서 SSH 키 생성 (이미 있다면 건너뛰기)
ssh-keygen -t ed25519 -C "github-actions"

# 공개키를 서버에 복사
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server-ip

# 개인키 내용을 GitHub Secrets에 등록
cat ~/.ssh/id_ed25519
```

## 🚀 3. 배포 프로세스

### 자동 배포
`main` 브랜치에 push하면 자동으로 배포가 진행됩니다:

```bash
git add .
git commit -m "feat: 새 기능 추가"
git push origin main
```

### 배포 플로우
1. GitHub Actions가 트리거됨
2. Docker 이미지 빌드
3. GitHub Container Registry(GHCR)에 이미지 푸시
4. SSH로 서버 접속
5. 서버에서 새 이미지 pull
6. 기존 컨테이너 중지 및 제거
7. 새 컨테이너 시작

### 수동 배포 (서버에서 직접)

서버에 직접 접속하여 배포하려면:

```bash
# GHCR 로그인
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# 이미지 pull
docker pull ghcr.io/YOUR_USERNAME/voicememo:latest

# 기존 컨테이너 중지
docker stop voicememo-app
docker rm voicememo-app

# 환경변수 파일 생성 (서버의 /opt/voicememo/.env)
cat > /opt/voicememo/.env << EOF
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_API_KEY=your-api-key
# ... 나머지 환경변수
EOF

# 새 컨테이너 시작
docker run -d \
  --name voicememo-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file /opt/voicememo/.env \
  --add-host=host.docker.internal:host-gateway \
  ghcr.io/YOUR_USERNAME/voicememo:latest
```

## 🔍 4. 배포 확인

배포 후 다음 명령으로 확인:

```bash
# 컨테이너 상태 확인
docker ps | grep voicememo

# 로그 확인
docker logs -f voicememo-app

# 서비스 접속 테스트
curl http://localhost:3000
```

## 🛠️ 5. 로컬 Docker 테스트

배포 전 로컬에서 Docker 이미지를 테스트할 수 있습니다:

```bash
# 이미지 빌드
docker build -t voicememo-local .

# 컨테이너 실행
docker run -p 3000:3000 --env-file .env.local voicememo-local

# 브라우저에서 확인
open http://localhost:3000
```

## 🐛 트러블슈팅

### 컨테이너가 시작되지 않음
```bash
# 로그 확인
docker logs voicememo-app

# 환경변수 확인
docker exec voicememo-app env
```

### 데이터베이스 연결 실패
- `DB_HOST`가 `host.docker.internal`로 설정되어 있는지 확인
- 서버의 MySQL이 3306 포트로 열려있는지 확인
- 방화벽 설정 확인

### 이미지 pull 실패
- GHCR 로그인 상태 확인
- GitHub 저장소 권한 확인
- 네트워크 연결 확인

## 📦 롤백 방법

문제 발생 시 이전 버전으로 롤백:

```bash
# 이전 이미지로 실행
docker stop voicememo-app
docker rm voicememo-app
docker run -d \
  --name voicememo-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file /opt/voicememo/.env \
  --add-host=host.docker.internal:host-gateway \
  ghcr.io/YOUR_USERNAME/voicememo:main-PREVIOUS_SHA
```

## 🔄 다운타임

현재 배포 전략은 단순 재시작 방식으로, 약 10-30초의 다운타임이 발생합니다.
무중단 배포가 필요한 경우 Blue-Green 또는 Rolling 배포 전략을 고려하세요.

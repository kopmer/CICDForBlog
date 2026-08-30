# Jenkins CI/CD 블로그 데모

GitHub에 push하면 Jenkins가 테스트와 프론트엔드 빌드를 수행한 뒤 Docker Compose로 로컬 PC에 재배포하는 예제입니다.

## 구조

```text
GitHub push → ngrok → Jenkins (8081) → 테스트/빌드 → Docker Compose → 홈페이지 (8080)
```

- `backend`: Spring Boot 3 / Java 21, `GET /api/health`
- `frontend`: React + Vite 단일 홈 화면
- `docker-compose.app.yml`: 실제 홈페이지 배포용
- `docker-compose.jenkins.yml`: Jenkins 실행용
- `Jenkinsfile`: 테스트, 프론트 빌드, 재배포 단계

## 1. Jenkins 실행

Docker Desktop을 시작한 뒤 프로젝트 루트에서 실행합니다.

```powershell
docker compose -f docker-compose.jenkins.yml up -d --build
docker compose -f docker-compose.jenkins.yml exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

`http://localhost:8081`로 접속해 표시된 비밀번호를 입력합니다. 권장 플러그인 대신 이 프로젝트 이미지에 포함된 플러그인을 유지하고, 관리자 계정을 생성합니다.

> 이 예제는 Jenkins가 호스트의 Docker 소켓을 사용합니다. 개인 로컬 데모에서만 사용하세요. 운영 환경에서는 권한이 분리된 Jenkins Agent를 사용해야 합니다.

## 2. GitHub 저장소와 Jenkins Job 연결

1. 이 폴더를 GitHub 저장소로 push합니다.
2. Jenkins에서 **새 Item** → **Pipeline**을 선택합니다.
3. Pipeline 정의를 **Pipeline script from SCM**으로 선택합니다.
4. SCM은 **Git**, Repository URL은 GitHub 저장소 주소, Script Path는 `Jenkinsfile`로 입력합니다.
5. 저장 후 한 번 **Build Now**를 실행합니다.

첫 배포 뒤 홈페이지는 `http://localhost:8080`, 상태 API는 `http://localhost:8080/api/health`에서 확인할 수 있습니다.

## 3. ngrok과 GitHub Webhook 연결

별도 PowerShell에서 Jenkins 포트를 외부로 공개합니다.

```powershell
ngrok http 8081
```

ngrok이 출력한 HTTPS URL을 복사한 뒤, GitHub 저장소의 **Settings → Webhooks → Add webhook**에서 다음처럼 입력합니다.

| 항목 | 값 |
| --- | --- |
| Payload URL | `https://발급된-ngrok-주소/github-webhook/` |
| Content type | `application/json` |
| 이벤트 | `Just the push event` |

저장 후 커밋을 push하면 Jenkins 빌드가 자동 실행됩니다. ngrok 무료 주소는 재시작할 때 바뀔 수 있으므로 주소가 바뀌면 GitHub Webhook도 갱신하세요.

## 종료

```powershell
docker compose -p cicd-blog -f docker-compose.app.yml down
docker compose -f docker-compose.jenkins.yml down
```

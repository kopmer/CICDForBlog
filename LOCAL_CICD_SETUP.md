# 로컬 Jenkins CI/CD 실행

이 파일들은 Windows Docker Desktop 환경에서 테스트한 실행 경로입니다.

```powershell
docker compose -f docker-compose.jenkins.local.yml up -d --build
docker compose -f docker-compose.jenkins.local.yml exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Jenkins에서 Pipeline Job을 만들고, Git 저장소의 **Script Path**를 `Jenkinsfile.local`로 지정합니다. 첫 빌드는 **Build Now**로 실행합니다.

애플리케이션은 `docker compose up -d --build`로 기동되며 `http://localhost:8080`에서 확인합니다.

GitHub Webhook URL은 `https://ngrok-주소/github-webhook/`입니다. ngrok은 다음처럼 Jenkins 포트를 노출합니다.

```powershell
ngrok http 8081
```

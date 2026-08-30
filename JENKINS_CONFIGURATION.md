# Jenkins 구성 구분

이 프로젝트는 로컬 학습 환경과 일반 서버 환경을 모두 설명하기 위해 Jenkins 구성을 두 가지로 관리한다.

| 구분 | 로컬 학습용 | 일반 서버용 |
| --- | --- | --- |
| Jenkins 이미지 정의 | `jenkins-local/` | `jenkins/` |
| Compose 파일 | `docker-compose.jenkins.local.yml` | `docker-compose.jenkins.yml` |
| Pipeline 파일 | `Jenkinsfile.local` | `Jenkinsfile` |
| 테스트·빌드 방식 | Jenkins 컨테이너에 설치된 Maven·Node.js로 실행 | Maven·Node.js Docker 이미지로 실행 |

## 현재 사용할 구성

Windows Docker Desktop에서 CI/CD 흐름을 학습할 때는 아래 조합을 사용한다.

```text
docker-compose.jenkins.local.yml
Jenkinsfile.local
```

```powershell
docker compose -f docker-compose.jenkins.local.yml up -d --build
```

Jenkins는 `http://localhost:8081`에서, 애플리케이션은 `http://localhost:8080`에서 확인한다.

## 일반 서버 구성

Linux 등의 일반 서버로 옮길 때는 아래 조합을 사용한다.

```text
docker-compose.jenkins.yml
Jenkinsfile
```

`Jenkinsfile`은 Maven과 Node.js를 Jenkins 컨테이너에 직접 의존하지 않고, 각각 고정된 Docker 이미지에서 실행한다. 따라서 빌드 환경을 더 일관되게 유지할 수 있다.

## GitHub에 포함할 파일

다음 파일과 폴더는 재현 가능한 Jenkins 구성 코드이므로 GitHub에 포함한다.

```text
jenkins/
jenkins-local/
docker-compose.jenkins.yml
docker-compose.jenkins.local.yml
Jenkinsfile
Jenkinsfile.local
```

반면 `jenkins_home/`은 Jenkins 실행 중 생성되는 데이터 폴더다. 계정 정보, 설정, 플러그인 데이터, 초기 비밀번호가 포함될 수 있으므로 GitHub에 올리지 않는다. `.gitignore`에서 제외한다.

## 주의 사항

두 Jenkins Compose 파일은 모두 호스트 포트 `8081`과 `jenkins_home/`을 사용한다. 따라서 두 구성을 동시에 실행하지 않는다.

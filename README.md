# OpenAI serverless

### 📝script
- `dev` : local 환경에서 nodemon을 사용해 `ts-node app.ts` 를 실행합니다.
- `postbuild` : AWS Lambda 에 .zip 파일로 배포하기 위한 압축파일을 생성합니다.
- `build:openai` : `esbuild` 를 사용해서 AWS Lambda 에 업로드할 수 있도록 번들링 작업을 한 후 `postbuild` 까지 실행합니다.

### 💻development environment
- **Express.js**
  - local 에서 handler function 을 테스트하기 위한 서버 환경
  - 가볍고 빠르게 개발 가능
- **ioRedis**
  - redis 의 모든 기능을 제공하면서 node.js 환경에 최적화된 라이브러리
  - AWS Lambda 환경이여서 배포환경의 메모리를 사용하면 cold start 때 마다 휘발되기 때문에 cloud redis 에서 database 생성 후 연결해서 사용
- **OpenAI**
  - createChatCompletion : 대화를 구성하는 메시지 목록이 주어지면 모델은 응답을 반환.
  - model : gpt-3.5-turbo
  - 요청 파라미터에 원하는 아웃풋을 출력하기 위해 조건 설정 후 원하는 아웃풋 형태로 나올 때까지 재귀 형태로 반복요청(10번 중 1번 꼴로 다른 아웃풋이 나오고 기본 AWS Lambda 에 있는 timeout 으로 무한 로딩 차단)
- **AWS Lambda cloud function**
  - 서버까지 빌드할 리소스가 아니기에 함수형태로 cloud 에 빌드
  - warm start 로 실행될 때 반복적인 redis 인스턴스 생성 방지

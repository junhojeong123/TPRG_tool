import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module'; // 실제 AppModule을 사용

describe('VttController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // 실제 애플리케이션 모듈을 사용하여 테스트 환경을 구성합니다.
    // 이 때, 데이터베이스와 Redis 연결은 테스트용 인스턴스를 바라보도록 설정해야 합니다.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/vtt (POST) should accept a VTT file and return a job ID', () => {
    return request(app.getHttpServer())
     .post('/vtt')
     .attach('file', Buffer.from('WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nTest cue'), 'test.vtt')
     .expect(202) // 202 Accepted
     .then((response) => {
        expect(response.body).toHaveProperty('jobId');
        expect(response.body).toHaveProperty('vttId');
        expect(response.body).toHaveProperty('statusUrl');
      });
  });

  // 추가적인 E2E 테스트 케이스:
  // 1. 업로드 후, GET /vtt/:vttId 로 조회했을 때 초기 상태가 'PROCESSING'인지 확인
  // 2. (큐와 워커가 동작한 후) 잠시 뒤에 다시 조회했을 때 상태가 'COMPLETED'로 변경되었는지 확인
  // 3. 잘못된 형식의 파일을 업로드했을 때 400 에러를 반환하는지 확인
});
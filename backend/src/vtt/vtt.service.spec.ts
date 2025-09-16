import { Test, TestingModule } from '@nestjs/testing';
import { VttService } from './vtt.service';
import { VttRepository } from './vtt.repository';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';

// 가짜 리포지토리 객체 생성
const mockVttRepository = {
  createVtt: jest.fn(),
  findVttByIdWithCues: jest.fn(),
  saveProcessedVtt: jest.fn(),
  updateVttStatus: jest.fn(),
};

// 가짜 큐 객체 생성
const mockVttParsingQueue = {
  add: jest.fn(),
};

describe('VttService', () => {
  let service: VttService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers:,
    }).compile();

    service = module.get<VttService>(VttService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createVttJob', () => {
    it('should create a VTT record and add a job to the queue', async () => {
      const mockFile = { originalname: 'test.vtt', buffer: Buffer.from('WEBVTT') } as Express.Multer.File;
      const mockVtt = { id: 'uuid-123' };
      const mockJob = { id: 'job-1' };

      mockVttRepository.createVtt.mockResolvedValue(mockVtt);
      mockVttParsingQueue.add.mockResolvedValue(mockJob);

      const result = await service.createVttJob(mockFile);

      // 리포지토리의 createVtt가 올바른 인자와 함께 호출되었는지 확인
      expect(mockVttRepository.createVtt).toHaveBeenCalledWith(mockFile.originalname);
      // 큐의 add가 올바른 인자와 함께 호출되었는지 확인
      expect(mockVttParsingQueue.add).toHaveBeenCalledWith('parse-vtt', {
        vttId: mockVtt.id,
        fileContent: mockFile.buffer.toString('utf-8'),
      });
      // 반환값이 기대하는 값과 일치하는지 확인
      expect(result).toEqual({ jobId: mockJob.id, vttId: mockVtt.id });
    });
  });
});
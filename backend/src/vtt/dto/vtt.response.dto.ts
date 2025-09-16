import { Expose, Type } from 'class-transformer';
import { VttStatus } from '../entities/vtt.entity';
import { ApiProperty } from '@nestjs/swagger';

class VttCueDto {
  @Expose()
  @ApiProperty({ example: 1, description: '큐의 고유 ID' })
  id: number;

  @Expose()
  @ApiProperty({ example: '00:00:01.234', description: '큐 시작 시간' })
  startTime: number;

  @Expose()
  @ApiProperty({ example: '00:00:05.678', description: '큐 종료 시간' })
  endTime: number;

  @Expose()
  @ApiProperty({ example: 'Hello, world!', description: '캡션 텍스트' })
  text: string;
}

export class VttResponseDto {
  @Expose()
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'VTT의 고유 ID',
  })
  id: string;

  @Expose()
  @ApiProperty({ example: 'my-video.vtt', description: '원본 파일명' })
  originalFileName: string;

  @Expose()
  @ApiProperty({
    enum: VttStatus,
    example: VttStatus.COMPLETED,
    description: '처리 상태',
  })
  status: VttStatus;

  @Expose()
  @ApiProperty({ example: 'en', description: '감지된 언어 코드' })
  language: string;

  @Expose()
  @Type(() => VttCueDto)
  @ApiProperty({ type:, description: 'VTT에 포함된 큐 목록' })
  cues: VttCueDto;

  @Expose()
  @ApiProperty({ example: '2023-10-27T10:00:00.000Z' })
  createdAt: Date;
}
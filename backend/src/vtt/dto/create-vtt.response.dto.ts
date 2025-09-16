import { ApiProperty } from '@nestjs/swagger';

export class CreateVttResponseDto {
  @ApiProperty({
    example: '123',
    description: '백그라운드에서 실행되는 작업의 고유 ID',
  })
  jobId: string | number;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: '생성된 VTT 리소스의 고유 ID',
  })
  vttId: string;

  @ApiProperty({
    example: '/vtt/jobs/123',
    description: '작업 상태를 폴링할 수 있는 URL',
  })
  statusUrl: string;
}
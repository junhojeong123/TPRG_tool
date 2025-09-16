import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VttService } from './vtt.service';
import { CreateVttResponseDto } from './dto/create-vtt.response.dto';
import { VttResponseDto } from './dto/vtt.response.dto';
import { plainToInstance } from 'class-transformer';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('VTT')
@Controller('vtt')
export class VttController {
  constructor(private readonly vttService: VttService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED) // 202 Accepted: 요청이 접수되었으나 처리가 완료되지 않음
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'VTT 파일 업로드 및 파싱 작업 생성' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 202, type: CreateVttResponseDto })
  async uploadVttFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreateVttResponseDto> {
    const { jobId, vttId } = await this.vttService.createVttJob(file);
    return {
      jobId,
      vttId,
      statusUrl: `/vtt/jobs/${jobId}`, // 작업 상태 확인을 위한 URL 제공
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 VTT 상세 정보 조회' })
  @ApiResponse({ status: 200, type: VttResponseDto })
  @ApiResponse({ status: 404, description: 'VTT를 찾을 수 없음' })
  async getVttById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<VttResponseDto> {
    const vtt = await this.vttService.getVttById(id);
    // 엔티티를 DTO로 변환하여 응답합니다.
    // `plainToInstance`는 @Expose() 데코레이터가 붙은 속성만 포함시킵니다.
    return plainToInstance(VttResponseDto, vtt, {
      excludeExtraneousValues: true,
    });
  }

  // 작업 상태를 확인하는 엔드포인트는 별도의 'jobs' 컨트롤러로 분리하는 것이 더 나은 구조일 수 있습니다.
  // 여기서는 편의상 VttController에 포함합니다.
  @Get('/jobs/:jobId')
  @ApiOperation({ summary: 'VTT 파싱 작업 상태 조회' })
  async getJobStatus(@Param('jobId') jobId: string) {
    // 실제 구현에서는 Bull 큐에서 job 정보를 가져와 상태를 반환해야 합니다.
    // 예: const job = await this.vttParsingQueue.getJob(jobId);
    //      if (!job) throw new NotFoundException();
    //      return { status: await job.getState() };
    return { message: `Status check for job ${jobId} not implemented yet.` };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ID로 VTT 및 관련 큐 삭제' })
  @ApiResponse({ status: 204, description: '성공적으로 삭제됨' })
  async deleteVtt(@Param('id', new ParseUUIDPipe()) id: string) {
    // VttService에 delete 로직을 구현해야 합니다.
    // 예: await this.vttService.deleteVtt(id);
    return;
  }
}
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetsService } from './assets.service';
import { plainToInstance } from 'class-transformer';
import { AssetResponseDto } from './dto/asset.response.dto';
// import { JwtAuthGuard } from '../../auth/jwt-auth.guard'; // 실제 프로젝트에서는 이 가드를 사용합니다.

// @UseGuards(JwtAuthGuard) // 컨트롤러 전체에 인증 가드를 적용합니다.
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAsset(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any, // 실제로는 Express.Request 타입
  ): Promise<AssetResponseDto> {
    // TODO: req.user.id는 실제 인증 가드에서 주입되어야 합니다.
    // 지금은 임시로 하드코딩된 값을 사용합니다.
    const userId = req.user?.id |

| '00000000-0000-0000-0000-000000000000';
    const asset = await this.assetsService.uploadAsset(file, userId);
    return plainToInstance(AssetResponseDto, asset, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async getAsset(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AssetResponseDto> {
    const asset = await this.assetsService.getAssetById(id);
    return plainToInstance(AssetResponseDto, asset, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAsset(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.assetsService.deleteAsset(id);
  }
}
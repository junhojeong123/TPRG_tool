import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
  UnauthorizedException,
  BadRequestException,
  Query,
  Get,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { UploadService } from './upload.service';
import { Image } from '../images/image.entity';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image')) // 메모리 저장소 사용 (디스크에 저장하지 않음)
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // 파일 존재 여부 체크
      if (!file) {
        return res.status(400).json({ error: '파일이 없습니다.' });
      }

      // 파일 유효성 검증
      const validation = this.uploadService.validateFile(file);
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.message || '파일 검증 실패' });
      }

      // 사용자 정보 추출
      const userId = 1; // 임시 테스트용
      const userRole = 'USER'; // 임시 테스트용

      // 사용자 권한 체크
      try {
        await this.uploadService.checkUserPermission(userId, userRole);
      } catch (permissionError: any) {
        return res.status(401).json({ error: permissionError.message || '권한이 없습니다.' });
      }

      // 중복 파일 체크 (옵션)
      const isDuplicate = await this.uploadService.checkDuplicateFile(file, userId);
      if (isDuplicate) {
        return res.status(409).json({ error: '이미 업로드된 파일입니다.' });
      }

      // 데이터베이스에 이미지 정보 저장 (파일 데이터 포함)
      const savedImage = await this.uploadService.saveImageInfo(
        file.buffer, // 파일 버퍼 (메모리에 저장된 데이터)
        file.originalname || 'unnamed.png',
        file.mimetype || 'application/octet-stream',
        userId,
        file.size || 0
      );

      // 성공 응답
      return res.status(201).json({
        id: savedImage.id,
        filename: savedImage.filename,
        originalname: savedImage.originalname,
        mimetype: (savedImage as any).mimetype,
        size: (savedImage as any).size ?? 0,
        uploadedAt: savedImage.uploadedAt,
        message: '이미지가 성공적으로 업로드되었습니다.'
      });

    } catch (error: any) {
      console.error('업로드 처리 중 에러:', error);
      
      // 특정 에러 타입에 따라 다른 응답
      if (error instanceof UnauthorizedException) {
        return res.status(401).json({ error: error.message || '인증이 필요합니다.' });
      }
      
      if (error instanceof BadRequestException) {
        return res.status(400).json({ error: error.message || '잘못된 요청입니다.' });
      }
      
      return res.status(500).json({ error: '이미지 업로드 중 오류가 발생했습니다.' });
    }
  }

  // 이미지 삭제 엔드포인트
  @Delete('image/:id')
  async deleteImage(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // 사용자 정보 추출
      const userId = 1; // 임시 테스트용

      const result = await this.uploadService.deleteImage(id, userId);
      
      if (result.success) {
        return res.status(200).json({ message: result.message || '삭제되었습니다.' });
      } else {
        return res.status(404).json({ error: result.message || '이미지를 찾을 수 없습니다.' });
      }
    } catch (error: any) {
      console.error('이미지 삭제 중 에러:', error);
      return res.status(500).json({ error: '이미지 삭제 중 오류가 발생했습니다.' });
    }
  }

  // 사용자별 이미지 목록 조회
  @Get('images')
  async getUserImages(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Res() res: Response,
  ) {
    try {
      const userId = 1; // 임시 테스트용
      
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 20;
      
      const result = await this.uploadService.getUserImages(userId, pageNum, limitNum);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('이미지 목록 조회 중 에러:', error);
      return res.status(500).json({ error: '이미지 목록 조회 중 오류가 발생했습니다.' });
    }
  }

  // 이미지 파일 다운로드/조회 엔드포인트
  @Get('image/:id')
  async getImage(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const image = await this.uploadService.getImageById(id);
      
      if (!image) {
        return res.status(404).json({ error: '이미지를 찾을 수 없습니다.' });
      }

      // 파일 데이터를 응답으로 전송
      res.setHeader('Content-Type', (image as any).mimetype);
      res.setHeader('Content-Disposition', `inline; filename="${image.filename}"`);
      
      // Base64 디코딩하여 전송
      const fileBuffer = Buffer.from((image as any).fileData, 'base64');
      return res.status(200).send(fileBuffer);

    } catch (error: any) {
      console.error('이미지 조회 중 에러:', error);
      return res.status(500).json({ error: '이미지 조회 중 오류가 발생했습니다.' });
    }
  }
}
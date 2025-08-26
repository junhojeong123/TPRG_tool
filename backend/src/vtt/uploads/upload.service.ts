import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../images/image.entity';
import { extname } from 'path';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  // static 메서드 - 파일 이름 생성
  static generateUniqueFileName(originalName: string = 'unnamed'): string {
    // 특수문자 제거 및 안전한 파일명 생성
    const safeName = originalName.replace(/[^a-zA-Z0-9가-힣._-]/g, '');
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    
    // 확장자 추출
    const ext = extname(safeName) || '.png';
    const nameWithoutExt = safeName.replace(ext, '') || 'image';
    
    // 최대 길이 제한
    const maxLength = 100;
    const truncatedName = nameWithoutExt.substring(0, maxLength);
    
    return `${truncatedName}_${timestamp}_${randomString}${ext}`;
  }

  // 파일 유효성 검증
  validateFile(file: Express.Multer.File): { isValid: boolean; message?: string } {
    // 파일 존재 여부 체크
    if (!file) {
      return { isValid: false, message: '파일이 없습니다.' };
    }

    // 파일 크기 체크 (5MB 제한)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { isValid: false, message: `파일 크기는 5MB를 초과할 수 없습니다. (현재: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB)` };
    }

    // 파일 타입 체크 (이미지 파일만 허용)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      return { isValid: false, message: `허용되지 않는 파일 형식입니다. (${file.mimetype}) 허용 형식: JPG, PNG, GIF, WEBP, SVG` };
    }

    // 파일 이름 길이 체크
    if (file.originalname.length > 255) {
      return { isValid: false, message: '파일 이름이 너무 깁니다.' };
    }

    return { isValid: true };
  }

  // 사용자 권한 체크
  async checkUserPermission(userId: number, userRole: string): Promise<boolean> {
    // 실제 프로젝트에서는 데이터베이스에서 사용자 정보 확인
    if (!userId) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    // 역할 기반 권한 체크 (예: ADMIN, USER)
    const allowedRoles = ['ADMIN', 'USER', 'MODERATOR'];
    if (!allowedRoles.includes(userRole)) {
      throw new UnauthorizedException('업로드 권한이 없습니다.');
    }

    // 사용자별 업로드 제한 체크 (예: 하루 100개 제한)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const uploadCount = await this.imageRepository
      .createQueryBuilder('image')
      .where('image.userId = :userId', { userId })
      .andWhere('image.uploadedAt >= :today', { today })
      .getCount();

    const dailyLimit = 100;
    if (uploadCount >= dailyLimit) {
      throw new BadRequestException(`하루 업로드 제한(${dailyLimit}개)을 초과했습니다.`);
    }

    return true;
  }

  // 중복 파일 체크
  async checkDuplicateFile(file: Express.Multer.File, userId: number): Promise<boolean> {
    // 파일 크기와 이름으로 중복 체크 (더 정밀한 체크도 가능)
    const existingFile = await this.imageRepository
      .createQueryBuilder('image')
      .where('image.userId = :userId', { userId })
      .andWhere('image.originalname = :originalname', { originalname: file.originalname })
      .andWhere('image.size = :size', { size: file.size })
      .getOne();

    return !!existingFile;
  }

  // 이미지 정보 데이터베이스에 저장 (파일 데이터 포함)
  async saveImageInfo(
    fileBuffer: Buffer,
    originalname: string,
    mimetype: string,
    userId?: number,
    fileSize?: number
  ): Promise<Image> {
    const image: any = new Image();
    
    // 파일 데이터를 Base64로 인코딩하여 저장
    image.fileData = fileBuffer.toString('base64');
    image.filename = UploadService.generateUniqueFileName(originalname);
    image.originalname = originalname;
    image.mimetype = mimetype;
    image.url = `/upload/image/${Date.now()}`; // 조회용 URL
    
    if (userId !== undefined) {
      image.userId = userId;
    }
    
    if (fileSize !== undefined) {
      image.size = fileSize;
    }
    
    image.uploadedAt = new Date();

    return await this.imageRepository.save(image);
  }

  // 이미지 삭제 (DB에서만)
  async deleteImage(id: number, userId?: number): Promise<{ success: boolean; message?: string }> {
    try {
      const image = await this.imageRepository.findOne({ 
        where: { id },
        // userId가 있는 경우 해당 사용자의 이미지만 삭제 가능
        ...(userId && { userId })
      });
      
      if (!image) {
        return { success: false, message: '이미지를 찾을 수 없습니다.' };
      }

      // 데이터베이스에서 삭제
      await this.imageRepository.delete(id);
      return { success: true, message: '이미지가 삭제되었습니다.' };
    } catch (error) {
      return { success: false, message: '이미지 삭제 중 오류가 발생했습니다.' };
    }
  }

  // 사용자별 이미지 목록 조회
  async getUserImages(userId: number, page: number = 1, limit: number = 20): Promise<any> {
    const [images, total] = await this.imageRepository
      .createQueryBuilder('image')
      .where('image.userId = :userId', { userId })
      .orderBy('image.uploadedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      images,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // ID로 이미지 조회
  async getImageById(id: number): Promise<Image | null> {
    return await this.imageRepository.findOne({ where: { id } });
  }
}
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAssetRepository } from './repositories/iasset.repository';
import { Asset, AssetType } from './entities/asset.entity';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AssetsService {
  private readonly ASSETS_BASE_PATH = './uploads/assets';
  private readonly ASSETS_PUBLIC_URL: string;

  constructor(
    @Inject(IAssetRepository)
    private readonly assetRepository: IAssetRepository,
    private readonly configService: ConfigService,
  ) {
    // 서버의 기본 URL을 환경 변수에서 가져와 공개 URL을 구성합니다.
    const port = this.configService.get<number>('port');
    this.ASSETS_PUBLIC_URL = `http://localhost:${port}/assets`;
  }

  async uploadAsset(
    file: Express.Multer.File,
    userId: string,
  ): Promise<Asset> {
    // 1. 고유한 파일명 생성 (충돌 방지)
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.ASSETS_BASE_PATH, uniqueFileName);

    // 2. 파일 시스템에 파일 저장
    await fs.mkdir(this.ASSETS_BASE_PATH, { recursive: true }); // 디렉토리 없으면 생성
    await fs.writeFile(filePath, file.buffer);

    // 3. 데이터베이스에 메타데이터 저장
    const assetData: Partial<Asset> = {
      userId,
      originalFileName: file.originalname,
      filePath,
      url: `${this.ASSETS_PUBLIC_URL}/${uniqueFileName}`,
      mimeType: file.mimetype,
      size: file.size,
      type: this.getAssetType(file.mimetype),
    };

    return this.assetRepository.createAsset(assetData);
  }

  async getAssetById(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new NotFoundException(`Asset with ID "${id}" not found`);
    }
    return asset;
  }

  async deleteAsset(id: string): Promise<void> {
    // 1. 데이터베이스에서 에셋 정보 조회
    const asset = await this.getAssetById(id);

    // 2. 파일 시스템에서 실제 파일 삭제
    try {
      await fs.unlink(asset.filePath);
    } catch (error) {
      // 파일이 이미 없어도 오류를 무시하고 계속 진행 (멱등성)
      console.warn(`File not found during deletion: ${asset.filePath}`);
    }

    // 3. 데이터베이스에서 메타데이터 삭제
    await this.assetRepository.deleteById(id);
  }

  private getAssetType(mimeType: string): AssetType {
    if (mimeType.startsWith('image/')) return AssetType.IMAGE;
    if (mimeType.startsWith('audio/')) return AssetType.AUDIO;
    if (mimeType.startsWith('video/')) return AssetType.VIDEO;
    return AssetType.UNKNOWN;
  }
}
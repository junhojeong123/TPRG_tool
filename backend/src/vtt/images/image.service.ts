import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async getImages() {
    try {
      const images = await this.imageRepository.find({
        order: {
          priority: 'ASC',
          uploadedAt: 'DESC',
        },
      });
      return { images };
    } catch (error) {
      console.error('데이터베이스 조회 에러:', error);
      return { images: [] };
    }
  }

  async deleteImage(id: number) {
    try {
      const image = await this.imageRepository.findOne({ where: { id } });
      if (!image) {
        return { success: false, message: '이미지를 찾을 수 없습니다.' };
      }

      const filePath = join(process.cwd(), image.url);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }

      await this.imageRepository.delete(id);
      return { success: true, message: '이미지가 삭제되었습니다.' };
    } catch (error) {
      console.error('이미지 삭제 에러:', error);
      return { success: false, message: '이미지 삭제 중 오류가 발생했습니다.' };
    }
  }

  async updatePriority(id: number, priority?: number, zIndex?: number) {
    try {
      const image = await this.imageRepository.findOne({ where: { id } });
      if (!image) {
        return { success: false, message: '이미지를 찾을 수 없습니다.' };
      }

      image.priority = priority ?? image.priority;
      image.zIndex = zIndex ?? image.zIndex;
      await this.imageRepository.save(image);

      return { success: true, message: '우선도가 업데이트되었습니다.', image };
    } catch (error) {
      console.error('우선도 업데이트 에러:', error);
      return { success: false, message: '우선도 업데이트 중 오류가 발생했습니다.' };
    }
  }

  async reorderImages(imageIds: number[]) {
    try {
      for (let i = 0; i < imageIds.length; i++) {
        await this.imageRepository.update(imageIds[i], {
          priority: i,
          zIndex: i,
        });
      }
      return { success: true, message: '이미지 순서가 업데이트되었습니다.', reorderedIds: imageIds };
    } catch (error) {
      console.error('순서 재정렬 에러:', error);
      return { success: false, message: '순서 재정렬 중 오류가 발생했습니다.' };
    }
  }

  async getImagesByPriorityRange(min: number, max: number) {
    try {
      const images = await this.imageRepository
        .createQueryBuilder('image')
        .where('image.priority >= :min AND image.priority <= :max', { min, max })
        .orderBy('image.priority', 'ASC')
        .getMany();

      return { images };
    } catch (error) {
      console.error('우선도 범위 조회 에러:', error);
      return { images: [] };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VttScene } from './vtt-scene.entity';

@Injectable()
export class VttScenesService {
  constructor(
    @InjectRepository(VttScene)
    private readonly sceneRepository: Repository<VttScene>,
  ) {}

  async findAll() {
    return this.sceneRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number) {
    return this.sceneRepository.findOne({
      where: { id },
      relations: ['tokens']
    });
  }

  async findByRoom(roomId: number) {
    return this.sceneRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' }
    });
  }

  async create(roomId: number, createSceneDto: any) {
    const scene = this.sceneRepository.create();
    scene.name = createSceneDto.name || '새 맵';
    scene.width = createSceneDto.width || 1000;
    scene.height = createSceneDto.height || 800;
    scene.backgroundImage = createSceneDto.backgroundImage;
    scene.properties = createSceneDto.properties || {};
    scene.isActive = createSceneDto.isActive || false;
    scene.roomId = roomId;
    scene.backgroundImageId = createSceneDto.backgroundImageId;

    return await this.sceneRepository.save(scene);
  }

  async update(id: number, updateSceneDto: any) {
    const scene = await this.sceneRepository.findOne({ where: { id } });
    if (!scene) {
      throw new Error('맵을 찾을 수 없습니다.');
    }

    if (updateSceneDto.name !== undefined) scene.name = updateSceneDto.name;
    if (updateSceneDto.width !== undefined) scene.width = updateSceneDto.width;
    if (updateSceneDto.height !== undefined) scene.height = updateSceneDto.height;
    if (updateSceneDto.backgroundImage !== undefined) scene.backgroundImage = updateSceneDto.backgroundImage;
    if (updateSceneDto.properties !== undefined) scene.properties = updateSceneDto.properties;
    if (updateSceneDto.isActive !== undefined) scene.isActive = updateSceneDto.isActive;
    if (updateSceneDto.roomId !== undefined) scene.roomId = updateSceneDto.roomId;
    if (updateSceneDto.backgroundImageId !== undefined) scene.backgroundImageId = updateSceneDto.backgroundImageId;

    return await this.sceneRepository.save(scene);
  }

  async activate(id: number, roomId: number) {
    // 같은 방의 다른 씬 비활성화
    await this.sceneRepository
      .createQueryBuilder()
      .update(VttScene)
      .set({ isActive: false })
      .where('roomId = :roomId', { roomId })
      .execute();
    
    // 현재 씬 활성화
    const scene = await this.sceneRepository.findOne({ where: { id } });
    if (scene) {
      scene.isActive = true;
      await this.sceneRepository.save(scene);
    }
    
    return { success: true, message: '맵이 활성화되었습니다.' };
  }

  async remove(id: number) {
    return await this.sceneRepository.delete(id);
  }
}
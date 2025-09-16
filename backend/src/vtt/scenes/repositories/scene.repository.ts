import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scene } from '../entities/scene.entity';
import { ISceneRepository } from './iscene.repository';
import { CreateSceneDto } from '../dto/create-scene.dto';
import { UpdateSceneDto } from '../dto/update-scene.dto';

@Injectable()
export class SceneRepository implements ISceneRepository {
  constructor(
    @InjectRepository(Scene)
    private readonly sceneTypeOrmRepo: Repository<Scene>,
  ) {}

  async createScene(createSceneDto: CreateSceneDto): Promise<Scene> {
    const scene = this.sceneTypeOrmRepo.create(createSceneDto);
    return this.sceneTypeOrmRepo.save(scene);
  }

  async findById(id: string): Promise<Scene | null> {
    // 씬 상세 조회 시에는 배경 에셋 정보도 함께 가져옵니다.
    return this.sceneTypeOrmRepo.findOne({
      where: { id },
      relations: ['backgroundAsset'],
    });
  }

  async findAll(): Promise<Scene> {
    // 씬 목록 조회 시에는 가볍게 씬 정보만 가져옵니다.
    return this.sceneTypeOrmRepo.find();
  }

  async updateScene(id: string, updateSceneDto: UpdateSceneDto): Promise<Scene> {
    await this.sceneTypeOrmRepo.update(id, updateSceneDto);
    return this.findById(id);
  }

  async deleteById(id: string): Promise<void> {
    await this.sceneTypeOrmRepo.delete(id);
  }
}
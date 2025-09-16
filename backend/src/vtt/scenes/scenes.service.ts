import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISceneRepository } from './repositories/iscene.repository';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { Scene } from './entities/scene.entity';

@Injectable()
export class ScenesService {
  constructor(
    @Inject(ISceneRepository)
    private readonly sceneRepository: ISceneRepository,
  ) {}

  async create(createSceneDto: CreateSceneDto): Promise<Scene> {
    return this.sceneRepository.createScene(createSceneDto);
  }

  async findAll(): Promise<Scene> {
    return this.sceneRepository.findAll();
  }

  async findOne(id: string): Promise<Scene> {
    const scene = await this.sceneRepository.findById(id);
    if (!scene) {
      throw new NotFoundException(`Scene with ID "${id}" not found`);
    }
    return scene;
  }

  async update(id: string, updateSceneDto: UpdateSceneDto): Promise<Scene> {
    await this.findOne(id); // 씬이 존재하는지 먼저 확인
    return this.sceneRepository.updateScene(id, updateSceneDto);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // 씬이 존재하는지 먼저 확인
    return this.sceneRepository.deleteById(id);
  }
}
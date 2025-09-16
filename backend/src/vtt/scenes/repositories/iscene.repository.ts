import { Scene } from '../entities/scene.entity';
import { CreateSceneDto } from '../dto/create-scene.dto';
import { UpdateSceneDto } from '../dto/update-scene.dto';

export abstract class ISceneRepository {
  abstract createScene(createSceneDto: CreateSceneDto): Promise<Scene>;
  abstract findById(id: string): Promise<Scene | null>;
  abstract findAll(): Promise<Scene>;
  abstract updateScene(id: string, updateSceneDto: UpdateSceneDto): Promise<Scene>;
  abstract deleteById(id: string): Promise<void>;
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marker } from './marker.entity';

@Injectable()
export class MarkersService {
  constructor(
    @InjectRepository(Marker)
    private readonly repo: Repository<Marker>,
  ) {}

  findAll() {
    return this.repo.find({
      order: { createdAt: 'ASC' },
      relations: ['image', 'scene'],
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['image', 'scene'],
    });
  }

  async create(dto: any) {
    const m = this.repo.create({
      name: dto.name ?? '마커',
      x: dto.x ?? 0,
      y: dto.y ?? 0,
      rotation: dto.rotation ?? 0,
      width: dto.width ?? 100,
      height: dto.height ?? 100,
      zIndex: dto.zIndex ?? 0,
      stats: dto.stats ?? {},
      properties: dto.properties ?? {},
      imageId: dto.imageId,
      sceneId: dto.sceneId, // ← mapId 대신 sceneId 사용
    });
    return this.repo.save(m);
  }

  async updatePosition(id: number, pos: any) {
    await this.repo.update(id, {
      x: pos.x, y: pos.y, rotation: pos.rotation,
    });
    return this.repo.findOne({ where: { id }, relations: ['image', 'scene'] });
  }

  async update(id: number, dto: any) {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id }, relations: ['image', 'scene'] });
  }

  remove(id: number) { return this.repo.delete(id); }

  findByScene(sceneId: number) {
    return this.repo.find({
      where: { scene: { id: sceneId } },
      order: { zIndex: 'ASC', createdAt: 'ASC' },
      relations: ['image'],
    });
  }
}
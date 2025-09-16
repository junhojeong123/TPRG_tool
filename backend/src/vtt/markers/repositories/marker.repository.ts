import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marker } from '../entities/marker.entity';
import { IMarkerRepository } from './imarker.repository';

@Injectable()
export class MarkerRepository implements IMarkerRepository {
  constructor(
    @InjectRepository(Marker)
    private readonly markerTypeOrmRepo: Repository<Marker>,
  ) {}

  async findById(id: string): Promise<Marker | null> {
    return this.markerTypeOrmRepo.findOneBy({ id });
  }

  async findAllBySceneId(sceneId: string): Promise<Marker> {
    return this.markerTypeOrmRepo.find({ where: { sceneId } });
  }

  async save(marker: Marker): Promise<Marker> {
    return this.markerTypeOrmRepo.save(marker);
  }
}
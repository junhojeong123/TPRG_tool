import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMarkersBySceneQuery } from '../impl/get-markers-by-scene.query';
import { IMarkerRepository } from '../../repositories/imarker.repository';
import { Inject } from '@nestjs/common';
import { Marker } from '../../entities/marker.entity';

@QueryHandler(GetMarkersBySceneQuery)
export class GetMarkersBySceneHandler implements IQueryHandler<GetMarkersBySceneQuery, Marker[]> {
  constructor(
    @Inject(IMarkerRepository)
    private readonly markerRepository: IMarkerRepository,
  ) {}

  async execute(query: GetMarkersBySceneQuery): Promise<Marker[]> {
    return this.markerRepository.findAllBySceneId(query.sceneId);
  }
}
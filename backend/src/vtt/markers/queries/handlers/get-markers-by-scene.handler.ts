import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMarkersBySceneQuery } from '../impl/get-markers-by-scene.query';
import { IMarkerRepository } from '../../repositories/imarker.repository';
import { Inject } from '@nestjs/common';
import { Marker } from '../../entities/marker.entity';

@QueryHandler(GetMarkersBySceneQuery)
export class GetMarkersBySceneHandler implements IQueryHandler<GetMarkersBySceneQuery> {
  constructor(
    @Inject(IMarkerRepository)
    private readonly markerRepository: IMarkerRepository,
  ) {}

  async execute(query: GetMarkersBySceneQuery): Promise<Marker> {
    const { sceneId } = query;
    // 리포지토리를 통해 데이터를 조회하는 로직만 수행합니다.
    return this.markerRepository.findAllBySceneId(sceneId);
  }
}
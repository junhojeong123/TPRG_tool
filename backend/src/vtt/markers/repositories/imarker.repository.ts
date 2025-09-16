import { Marker } from '../entities/marker.entity';

// 서비스 계층이 의존할 계약(Contract)을 정의합니다.
export interface IMarkerRepository {
  findById(id: string): Promise<Marker | null>;
  findAllBySceneId(sceneId: string): Promise<Marker[]>; // 수정: Marker → Marker[]
  save(marker: Marker): Promise<Marker>;
}
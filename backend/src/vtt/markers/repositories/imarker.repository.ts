import { Marker } from '../entities/marker.entity';

// 서비스 계층이 의존할 계약(Contract)을 정의합니다.
export abstract class IMarkerRepository {
  abstract findById(id: string): Promise<Marker | null>;
  abstract findAllBySceneId(sceneId: string): Promise<Marker>; // 반환 타입을 배열로 수정
  abstract save(marker: Marker): Promise<Marker>;
}
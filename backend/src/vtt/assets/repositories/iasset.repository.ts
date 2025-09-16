import { Asset } from '../entities/asset.entity';

// 서비스 계층이 의존할 계약(Contract)을 정의합니다.
export abstract class IAssetRepository {
  abstract createAsset(assetData: Partial<Asset>): Promise<Asset>;
  abstract findById(id: string): Promise<Asset | null>;
  abstract deleteById(id: string): Promise<void>;
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../entities/asset.entity';
import { IAssetRepository } from './iasset.repository';

@Injectable()
export class AssetRepository implements IAssetRepository {
  constructor(
    @InjectRepository(Asset)
    private readonly assetTypeOrmRepo: Repository<Asset>,
  ) {}

  async createAsset(assetData: Partial<Asset>): Promise<Asset> {
    const asset = this.assetTypeOrmRepo.create(assetData);
    return this.assetTypeOrmRepo.save(asset);
  }

  async findById(id: string): Promise<Asset | null> {
    return this.assetTypeOrmRepo.findOneBy({ id });
  }

  async deleteById(id: string): Promise<void> {
    await this.assetTypeOrmRepo.delete(id);
  }
}
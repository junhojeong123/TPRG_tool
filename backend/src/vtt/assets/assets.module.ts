import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Asset } from './entities/asset.entity';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { IAssetRepository } from './repositories/iasset.repository';
import { AssetRepository } from './repositories/asset.repository';

@Module({
  imports:[, ConfigModule],
  controllers: [AssetsController],
  providers:
})
export class AssetsModule {}
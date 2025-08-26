import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marker } from './marker.entity';
import { MarkersController } from './markers.controller';
import { MarkersGateway } from './markers.gateway';
import { MarkersService } from './markers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Marker])],
  controllers: [MarkersController],
  providers: [MarkersGateway, MarkersService],
  exports: [MarkersService],
})
export class MarkersModule {}

import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  ParseIntPipe,
  Body 
} from '@nestjs/common';
import { VttScenesService } from './vtt-scenes.service';

@Controller('maps')
export class MapController {
  constructor(private mapService: VttScenesService) {}

  @Get()
  async getAllMaps() {
    return await this.mapService.findAll();
  }

  @Get(':id')
  async getMap(@Param('id', ParseIntPipe) id: number) {
    return await this.mapService.findOne(id);
  }

  @Get('room/:roomId')
  async getMapsByRoom(@Param('roomId', ParseIntPipe) roomId: number) {
    return await this.mapService.findByRoom(roomId);
  }

  @Post('room/:roomId')
  async createMapForRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() createMapDto: any
  ) {
    return await this.mapService.create(roomId, createMapDto);
  }

  @Put(':id')
  async updateMap(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMapDto: any
  ) {
    return await this.mapService.update(id, updateMapDto);
  }

  @Put(':id/activate')
  async activateMap(
    @Param('id', ParseIntPipe) id: number,
    @Body('roomId') roomId: number
  ) {
    return await this.mapService.activate(id, roomId);
  }

  @Delete(':id')
  async deleteMap(@Param('id', ParseIntPipe) id: number) {
    return await this.mapService.remove(id);
  }
}
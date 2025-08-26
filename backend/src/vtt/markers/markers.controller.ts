import { Controller, Get, Param, Post, Patch, Delete, Body, ParseIntPipe } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersGateway } from './markers.gateway';

@Controller('api/vtt/markers')
export class MarkersController {
  constructor(
    private readonly tokenService: MarkersService,
    private readonly tokenGateway: MarkersGateway,
  ) {}

  @Get()
  getAllMarkers() { return this.tokenService.findAll(); }

  @Get(':id')
  getMarker(@Param('id', ParseIntPipe) id: number) { return this.tokenService.findOne(id); }

  @Get('by-scene/:sceneId')
  getMarkersByScene(@Param('sceneId', ParseIntPipe) sceneId: number) {
    return this.tokenService.findByScene(sceneId);
  }

  @Post()
  async createMarker(@Body() dto: any) {
    const savedMarker = await this.tokenService.create(dto);
    this.tokenGateway.broadcast('markerCreated', { marker: savedMarker });
    return savedMarker;
  }

  @Patch(':id/position')
  async updateMarkerPosition(@Param('id', ParseIntPipe) id: number, @Body() pos: any) {
    const updatedMarker = await this.tokenService.updatePosition(id, pos);
    this.tokenGateway.broadcast('markerMoved', { marker: updatedMarker });
    return updatedMarker;
  }

  @Patch(':id')
  async updateMarker(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    const updated = await this.tokenService.update(id, dto);
    return updated;
  }

  @Delete(':id')
  async deleteMarker(@Param('id', ParseIntPipe) id: number) {
    await this.tokenService.remove(id);
    this.tokenGateway.broadcast('markerDeleted', { markerId: id });
    return { success: true };
  }
}
import {
  Controller,
  Get,
  Delete,
  Patch,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ImagesService } from './image.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  getImages() {
    return this.imagesService.getImages();
  }

  @Delete(':id')
  deleteImage(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.deleteImage(id);
  }

  @Patch(':id/priority')
  updatePriority(
    @Param('id', ParseIntPipe) id: number,
    @Body('priority') priority: number,
    @Body('zIndex') zIndex: number,
  ) {
    return this.imagesService.updatePriority(id, priority, zIndex);
  }

  @Post('reorder')
  reorderImages(@Body('imageIds') imageIds: number[]) {
    return this.imagesService.reorderImages(imageIds);
  }

  @Get('priority/:min/:max')
  getImagesByPriorityRange(
    @Param('min', ParseIntPipe) min: number,
    @Param('max', ParseIntPipe) max: number,
  ) {
    return this.imagesService.getImagesByPriorityRange(min, max);
  }
}

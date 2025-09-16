import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ScenesService } from './scenes.service';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { SceneResponseDto } from './dto/scene.response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('scenes')
export class ScenesController {
  constructor(private readonly scenesService: ScenesService) {}

  @Post()
  async create(@Body() createSceneDto: CreateSceneDto): Promise<SceneResponseDto> {
    const scene = await this.scenesService.create(createSceneDto);
    return plainToInstance(SceneResponseDto, scene, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll(): Promise<SceneResponseDto> {
    const scenes = await this.scenesService.findAll();
    return plainToInstance(SceneResponseDto, scenes, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<SceneResponseDto> {
    const scene = await this.scenesService.findOne(id);
    return plainToInstance(SceneResponseDto, scene, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSceneDto: UpdateSceneDto,
  ): Promise<SceneResponseDto> {
    const updatedScene = await this.scenesService.update(id, updateSceneDto);
    return plainToInstance(SceneResponseDto, updatedScene, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.scenesService.remove(id);
  }
}
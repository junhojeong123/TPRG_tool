import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MoveMarkerCommand } from '../impl/move-marker.command';
import { IMarkerRepository } from '../../repositories/imarker.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { Marker } from '../../entities/marker.entity';

@CommandHandler(MoveMarkerCommand)
export class MoveMarkerHandler implements ICommandHandler<MoveMarkerCommand> {
  constructor(
    @Inject(IMarkerRepository)
    private readonly markerRepository: IMarkerRepository,
  ) {}

  // 수정: 반환 타입을 Promise<Marker>로 명확하게 명시
  async execute(command: MoveMarkerCommand): Promise<Marker[]> {
    const { markerId, newPosition } = command;

    const marker = await this.markerRepository.findById(markerId);
    if (!marker) {
      throw new NotFoundException(`Marker with ID "${markerId}" not found`);
    }

    marker.position = newPosition;

    return this.markerRepository.save(marker);
  }
}
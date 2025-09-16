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

  async execute(command: MoveMarkerCommand): Promise<Marker> {
    const { markerId, newPosition } = command;

    const marker = await this.markerRepository.findById(markerId);
    if (!marker) {
      throw new NotFoundException(`Marker with ID "${markerId}" not found`);
    }

    // 비즈니스 로직: 위치를 업데이트합니다.
    marker.position = newPosition;

    // 변경된 상태를 데이터베이스에 저장합니다.
    return this.markerRepository.save(marker);
  }
}
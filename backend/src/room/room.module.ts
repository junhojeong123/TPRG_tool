import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]),
  UsersModule,
  ],
  providers: [RoomService,],
  exports: [RoomService,],
})
export class RoomModule {}
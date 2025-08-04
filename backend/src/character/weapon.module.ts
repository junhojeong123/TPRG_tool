import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeaponService } from './weapon.service';
import { Weapon } from './entities/weapon.entity';
import { Character } from './entities/character.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Weapon, Character]), // WeaponRepository 등록
  ],
  providers: [WeaponService],
  exports: [WeaponService],
})
export class WeaponModule {}
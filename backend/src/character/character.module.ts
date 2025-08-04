import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Character } from './entities/character.entity';
import { Stats } from './entities/stats.entity';
import { Weapon } from './entities/weapon.entity';
import { SanLoss } from './entities/san-loss.entity';
import { CharacterOwnershipGuard } from './guards/character-ownership.guard';
import { CharacterExistsGuard } from './guards/character-exists.guard';
import { WeaponModule } from './weapon.module';
import { SkillModule } from './skill.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Character, Stats, Skill, Weapon, SanLoss]),
    WeaponModule,
    SkillModule,
  ],
  providers: [
    CharacterService,
    CharacterExistsGuard,
    CharacterOwnershipGuard,
  ],
  controllers: [CharacterController],
  exports : [CharacterService]
})
export class CharacterModule { }

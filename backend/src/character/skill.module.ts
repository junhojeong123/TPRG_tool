import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillService } from './skill.service';
import { Skill } from './entities/skill.entity';
import { Character } from './entities/character.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, Character])],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillModule {}

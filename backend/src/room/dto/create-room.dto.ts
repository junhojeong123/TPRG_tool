import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: '방 이름 (1~50자)' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '비밀번호 (4자 이상)' })
  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string | null;

  @ApiProperty({ description: '최대 참여자 수 (2~8)', default: 2 })
  @IsInt()
  @Min(2)
  @Max(8)
  maxParticipants: number = 2;

  @ApiProperty({ description: '방 공개 여부', default: true})
  @IsOptional()
  @IsBoolean()
  isPublic: boolean = true;
}


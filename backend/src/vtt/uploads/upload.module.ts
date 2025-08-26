
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../images/image.entity';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),  
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [TypeOrmModule],  
})
export class UploadModule {}
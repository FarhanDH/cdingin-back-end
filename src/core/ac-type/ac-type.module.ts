import { Module } from '@nestjs/common';
import { AcTypeService } from './ac-type.service';
import { AcTypeController } from './ac-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcType } from './entities/ac-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcType])],
  controllers: [AcTypeController],
  providers: [AcTypeService],
})
export class AcTypeModule {}

import { Module } from '@nestjs/common';
import { ProblemTypeService } from './problem-type.service';
import { ProblemTypeController } from './problem-type.controller';
import { ProblemType } from './entities/problem-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProblemType])],
  controllers: [ProblemTypeController],
  providers: [ProblemTypeService],
})
export class ProblemTypeModule {}

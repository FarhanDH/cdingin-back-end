import { Module } from '@nestjs/common';
import { ProblemTypeService } from './problem-type.service';
import { ProblemTypeController } from './problem-type.controller';

@Module({
  controllers: [ProblemTypeController],
  providers: [ProblemTypeService],
})
export class ProblemTypeModule {}

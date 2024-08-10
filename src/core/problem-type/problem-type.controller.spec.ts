import { Test, TestingModule } from '@nestjs/testing';
import { ProblemTypeController } from './problem-type.controller';
import { ProblemTypeService } from './problem-type.service';

describe('ProblemTypeController', () => {
  let controller: ProblemTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProblemTypeController],
      providers: [ProblemTypeService],
    }).compile();

    controller = module.get<ProblemTypeController>(ProblemTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

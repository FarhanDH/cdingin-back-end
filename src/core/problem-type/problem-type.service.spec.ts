import { Test, TestingModule } from '@nestjs/testing';
import { ProblemTypeService } from './problem-type.service';

describe('ProblemTypeService', () => {
  let service: ProblemTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProblemTypeService],
    }).compile();

    service = module.get<ProblemTypeService>(ProblemTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

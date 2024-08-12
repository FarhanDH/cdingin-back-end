import { Test, TestingModule } from '@nestjs/testing';
import { AcTypeService } from './ac-type.service';

describe('AcTypeService', () => {
  let service: AcTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcTypeService],
    }).compile();

    service = module.get<AcTypeService>(AcTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

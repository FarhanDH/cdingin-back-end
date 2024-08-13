import { Test, TestingModule } from '@nestjs/testing';
import { BuildingTypeService } from './building-type.service';

describe('BuildingTypeService', () => {
  let service: BuildingTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuildingTypeService],
    }).compile();

    service = module.get<BuildingTypeService>(BuildingTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

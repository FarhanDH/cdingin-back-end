import { Test, TestingModule } from '@nestjs/testing';
import { BuildingTypeController } from './building-type.controller';
import { BuildingTypeService } from './building-type.service';

describe('BuildingTypeController', () => {
  let controller: BuildingTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildingTypeController],
      providers: [BuildingTypeService],
    }).compile();

    controller = module.get<BuildingTypeController>(BuildingTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

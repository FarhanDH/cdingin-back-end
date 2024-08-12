import { Test, TestingModule } from '@nestjs/testing';
import { AcTypeController } from './ac-type.controller';
import { AcTypeService } from './ac-type.service';

describe('AcTypeController', () => {
  let controller: AcTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcTypeController],
      providers: [AcTypeService],
    }).compile();

    controller = module.get<AcTypeController>(AcTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

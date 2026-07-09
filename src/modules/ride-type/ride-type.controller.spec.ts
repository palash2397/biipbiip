import { Test, TestingModule } from '@nestjs/testing';
import { RideTypeController } from './ride-type.controller';
import { RideTypeService } from './ride-type.service';

describe('RideTypeController', () => {
  let controller: RideTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideTypeController],
      providers: [RideTypeService],
    }).compile();

    controller = module.get<RideTypeController>(RideTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

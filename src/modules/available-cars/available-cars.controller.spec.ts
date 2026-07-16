import { Test, TestingModule } from '@nestjs/testing';
import { AvailableCarsController } from './available-cars.controller';
import { AvailableCarsService } from './available-cars.service';

describe('AvailableCarsController', () => {
  let controller: AvailableCarsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailableCarsController],
      providers: [AvailableCarsService],
    }).compile();

    controller = module.get<AvailableCarsController>(AvailableCarsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

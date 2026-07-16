import { Test, TestingModule } from '@nestjs/testing';
import { AvailableCarsService } from './available-cars.service';

describe('AvailableCarsService', () => {
  let service: AvailableCarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailableCarsService],
    }).compile();

    service = module.get<AvailableCarsService>(AvailableCarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

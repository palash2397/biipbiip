import { Test, TestingModule } from '@nestjs/testing';
import { RideTypeService } from './ride-type.service';

describe('RideTypeService', () => {
  let service: RideTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RideTypeService],
    }).compile();

    service = module.get<RideTypeService>(RideTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

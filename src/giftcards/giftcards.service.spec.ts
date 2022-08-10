import { Test, TestingModule } from '@nestjs/testing';
import { GiftcardsService } from './giftcards.service';

describe('GiftcardsService', () => {
  let service: GiftcardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiftcardsService],
    }).compile();

    service = module.get<GiftcardsService>(GiftcardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

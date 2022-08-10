import { Test, TestingModule } from '@nestjs/testing';
import { GiftcardsController } from './giftcards.controller';

describe('GiftcardsController', () => {
  let controller: GiftcardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftcardsController],
    }).compile();

    controller = module.get<GiftcardsController>(GiftcardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

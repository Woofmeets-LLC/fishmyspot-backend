import { Test, TestingModule } from '@nestjs/testing';
import { SharetribeController } from './sharetribe.controller';

describe('SharetribeController', () => {
  let controller: SharetribeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharetribeController],
    }).compile();

    controller = module.get<SharetribeController>(SharetribeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

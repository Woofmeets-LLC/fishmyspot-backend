import { ApiProperty } from '@nestjs/swagger';

class LinkDetailDto {
  @ApiProperty()
  href: string;
  @ApiProperty()
  rel: string;
  @ApiProperty()
  method: string;
  @ApiProperty()
  description: string;
}

export class GenerateOnBoardingSignupUrl {
  @ApiProperty({
    type: () => [LinkDetailDto],
  })
  links: LinkDetailDto[];
}

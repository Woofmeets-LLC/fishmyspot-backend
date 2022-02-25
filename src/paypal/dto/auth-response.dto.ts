import { ApiProperty } from '@nestjs/swagger';

export class PaypalAuthResponse {
  @ApiProperty()
  access_token: string;
  @ApiProperty({
    required: false,
  })
  app_id?: string;
  @ApiProperty({
    required: false,
  })
  nonce?: string;
  @ApiProperty({
    required: false,
  })
  expires_in?: string;
  @ApiProperty({
    required: false,
    isArray: true,
  })
  scope?: string[];
}

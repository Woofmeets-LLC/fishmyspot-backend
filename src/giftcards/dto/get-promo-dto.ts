import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetPromoDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}

export class VerifyPromoDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;
}

export class ApplyPromoDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  promo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  anglerId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  transactionId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  usedAmount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  paymentIntent: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  pondId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  pondOwnerId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordBodyDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email!: string;
}

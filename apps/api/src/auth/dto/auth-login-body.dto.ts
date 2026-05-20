import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthLoginBodyDto {
  @ApiProperty({ format: 'email', example: 'email@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ format: 'password' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

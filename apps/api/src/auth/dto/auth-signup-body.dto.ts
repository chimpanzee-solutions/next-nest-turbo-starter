import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthSignupBodyDto {
  @ApiProperty({ example: 'Acme Workspace' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  organizationName!: string;

  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ format: 'email', example: 'jane@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ format: 'password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: true })
  @Equals(true, { message: 'You must accept the terms and privacy policy' })
  acceptTerms!: true;

  @ApiProperty({ required: false, example: 'growth' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  planCode?: string;
}

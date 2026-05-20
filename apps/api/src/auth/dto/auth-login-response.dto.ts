import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';
}

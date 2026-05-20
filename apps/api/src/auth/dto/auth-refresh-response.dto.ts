import { ApiProperty } from '@nestjs/swagger';

export class AuthRefreshResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';
}

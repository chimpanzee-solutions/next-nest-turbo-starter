import { ApiProperty } from '@nestjs/swagger';
import { AuthMeResponseDto } from './auth-me-response.dto';

export class AuthSessionResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({ type: AuthMeResponseDto })
  me!: AuthMeResponseDto;
}

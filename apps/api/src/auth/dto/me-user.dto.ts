import { ApiProperty } from '@nestjs/swagger';

export class MeUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty({ nullable: true, type: String })
  name!: string | null;

  @ApiProperty()
  isPlatformOwner!: boolean;
}

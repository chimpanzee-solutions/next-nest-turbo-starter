import { AccessContext } from '@generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class MePermissionDto {
  @ApiProperty()
  key!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  module!: string;

  @ApiProperty({ enum: AccessContext })
  contextType!: AccessContext;
}

import { ApiProperty } from '@nestjs/swagger';
import { AccessContext } from '@generated/prisma/enums';

export class MeRoleDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: AccessContext })
  contextType!: AccessContext;

  @ApiProperty({ nullable: true, type: String })
  organizationId!: string | null;

  @ApiProperty()
  isSystem!: boolean;
}

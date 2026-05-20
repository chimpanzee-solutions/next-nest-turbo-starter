import { MembershipStatus, OrganizationType } from '@generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class MeOrganizationDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: OrganizationType })
  type!: OrganizationType;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ enum: MembershipStatus })
  membershipStatus!: MembershipStatus;

  @ApiProperty()
  isOwner!: boolean;
}

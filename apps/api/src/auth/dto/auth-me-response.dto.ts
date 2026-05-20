import { ApiProperty } from '@nestjs/swagger';
import { MeOrganizationDto } from './me-organization.dto';
import { MePermissionDto } from './me-permission.dto';
import { MeRoleDto } from './me-role.dto';
import { MeUserDto } from './me-user.dto';

export class AuthMeResponseDto {
  @ApiProperty()
  user!: MeUserDto;

  @ApiProperty({ type: [MeOrganizationDto] })
  organizations!: MeOrganizationDto[];

  @ApiProperty({ type: [MeRoleDto] })
  roles!: MeRoleDto[];

  @ApiProperty({ type: [MePermissionDto] })
  permissions!: MePermissionDto[];
}

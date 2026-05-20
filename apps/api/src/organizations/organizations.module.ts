import { Module } from '@nestjs/common';
import { OrganizationMembershipService } from './organization-membership.service';
import { OrganizationService } from './organization.service';

@Module({
  providers: [OrganizationService, OrganizationMembershipService],
  exports: [OrganizationService, OrganizationMembershipService],
})
export class OrganizationsModule {}

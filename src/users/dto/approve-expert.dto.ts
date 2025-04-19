import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ApprovalStatus } from 'src/shared/constants/roles.enum';

export class ApproveExpertDto {
  @ApiProperty({ enum: [ApprovalStatus.APPROVED, ApprovalStatus.REJECTED] })
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus.APPROVED | ApprovalStatus.REJECTED;
}
import {
    IsEmail,
    IsOptional,
    IsString,
    IsArray,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  import { ApprovalStatus, UserStatus } from 'src/shared/constants/roles.enum';
  
  export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    password?: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    contactDetails?: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    currentCompany?: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    expertise?: string;
  
    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    skills?: string[];
  
    @ApiProperty({ required: false })
    @IsOptional()
    groupId?: string;
  
    @ApiProperty({ required: false, enum: UserStatus })
    @IsOptional()
    status?: UserStatus;
  
    @ApiProperty({ required: false, enum: ApprovalStatus })
    @IsOptional()
    approvalStatus?: ApprovalStatus;
  }
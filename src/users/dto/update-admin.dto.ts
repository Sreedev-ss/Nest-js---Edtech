import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiPropertyOptional({ description: 'Admin name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Admin email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Contact details of the admin' })
  @IsOptional()
  @IsString()
  contactDetails?: string;

  @ApiPropertyOptional({ description: 'New password for admin (will be hashed)' })
  @IsOptional()
  @IsString()
  password?: string;
}
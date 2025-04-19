import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'The user\'s email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The user\'s password' })
  @IsNotEmpty()
  password: string;
}
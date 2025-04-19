import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsArray,
} from 'class-validator';

export class CreateExpertDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contactDetails: string;

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
}
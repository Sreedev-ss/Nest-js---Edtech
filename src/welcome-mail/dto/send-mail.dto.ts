import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class SendMailDto {
    @ApiProperty({ description: 'Student ID of the student to whom the welcome email should be sent' })
    @IsNumber()
    studentId: number;
  }
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { RolesGuard } from "src/shared/guards/role.guard";
import { WelcomeMailService } from "./welcome-mail.service";
import { Roles } from "src/shared/decorators/roles.decorator";
import { CurrentUser } from "src/shared/decorators/user.decorator";
import { UserRole } from "src/shared/constants/roles.enum";
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { SendMailDto } from "./dto/send-mail.dto";

@ApiTags('Mail')
@UseGuards(JwtAuthGuard)
@Controller('mail')
export class WelcomeMailController {
  constructor(private readonly service: WelcomeMailService) { }

  @ApiOperation({ summary: 'Send welcome email to a student' })
  @ApiBody({ description: 'Student ID of the student to whom the welcome email should be sent', type: Object })
  @ApiResponse({ status: 200, description: 'Welcome email sent successfully.', type: Object })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Only admin or super-admin can send emails' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post('send')
  async sendMail(@Body() body: SendMailDto, @CurrentUser() admin: any) {
    return this.service.sendWelcomeMail(admin.userId, body.studentId);
  }

  @ApiOperation({ summary: 'Get email logs for a student' })
  @ApiParam({ name: 'studentId', type: Number, description: 'ID of the student' })
  @ApiResponse({ status: 200, description: 'List of logs for the student.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Logs not found for the given student ID.' })
  @Get('logs/:studentId')
  async getLogs(@Param('studentId') studentId: number) {
    return this.service.getLogsForStudent(studentId);
  }
}
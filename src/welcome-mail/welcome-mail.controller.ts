import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/role.guard";
import { WelcomeMailService } from "./welcome-mail.service";
import { Roles } from "src/auth/decorators/roles.decorator";
import { CurrentUser } from "src/auth/decorators/user.decorator";

@Controller('mail')
export class WelcomeMailController {
  constructor(private readonly service: WelcomeMailService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('send')
  async sendMail(@Body() body: { studentId: number }, @CurrentUser() admin: any) {
    return this.service.sendWelcomeMail(admin.userId, body.studentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logs/:studentId')
  async getLogs(@Param('studentId') studentId: number) {
    return this.service.getLogsForStudent(studentId);
  }
}
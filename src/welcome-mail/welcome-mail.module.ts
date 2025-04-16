import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WelcomeMail } from "./welcome-mail.entity";
import { User } from "src/users/users.entity";
import { MailService } from "src/mail/mail.service";
import { WelcomeMailService } from "./welcome-mail.service";
import { WelcomeMailController } from "./welcome-mail.controller";

@Module({
    imports: [
      TypeOrmModule.forFeature([WelcomeMail, User]),
    ],
    controllers: [WelcomeMailController],
    providers: [WelcomeMailService, MailService],
  })
  export class WelcomeMailModule {}
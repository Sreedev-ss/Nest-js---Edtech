import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WelcomeMail } from "./welcome-mail.entity";
import { Repository } from "typeorm";
import { User } from "src/users/users.entity";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class WelcomeMailService {
    constructor(
        @InjectRepository(WelcomeMail)
        private mailRepo: Repository<WelcomeMail>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private mailService: MailService,
    ) { }

    async sendWelcomeMail(adminId: any, studentId: any) {
        const [admin, student] = await Promise.all([
            this.userRepo.findOne({ where: { id: adminId } }),
            this.userRepo.findOne({ where: { id: studentId } }),
        ]);

        if (!admin || !student) {
            throw new NotFoundException('Admin or Student not found');
        }

        const alreadySent = await this.mailRepo.findOne({
            where: { student: { id: studentId }, isSent: true },
        });

        if (alreadySent) {
            throw new ConflictException('Welcome email already sent to this student');
        }

        await this.mailService.sendWelcomeEmail(student.email, student.name, admin.name);

        const record = this.mailRepo.create({
            admin,
            student,
            isSent: true,
        });

        return this.mailRepo.save(record);
    }

    async getLogsForStudent(studentId: any) {
        return this.mailRepo.find({
            where: { student: { id: studentId } },
            order: { sentAt: 'DESC' },
        });
    }
}
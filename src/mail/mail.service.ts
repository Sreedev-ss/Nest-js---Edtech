import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendWelcomeEmail(to: string, studentName: string, adminName: string) {
    return this.transporter.sendMail({
      from: `"${adminName} from DevXtra" <${process.env.MAIL_USER}>`,
      to,
      subject: '🚀 Welcome to DevXtra!',
      html: `
        <h2>Hello ${studentName},</h2>
        <p>Welcome aboard! We're thrilled to have you at <b>DevXtra</b>.</p>
        <p>This welcome email was sent by: <b>${adminName}</b></p>
        <p>📅 ${new Date().toLocaleString()}</p>
      `,
    });
  }
}
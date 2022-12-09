import { MailerService } from '@nestjs-modules/mailer/dist';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {

    constructor(private readonly mailerService: MailerService) {

    }

    async sendResetPassword(to: string, name: string, token: string) {
        const url = `http://www.example.com/auth/reset?token=${token}`;
    
        await this.mailerService.sendMail({
            to: to,
            from: '"Support Team" <support@example.com>',
            subject: 'Cambio de Contraseña',
            template: './forget-password', 
            context: { 
                name: name,
                url,
            },
        });
    }
}

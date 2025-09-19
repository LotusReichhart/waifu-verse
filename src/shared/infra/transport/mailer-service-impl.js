import { MailerService } from "../../../modules/auth/services/mailer-service.js";
import { sendMail as sendMailImpl } from "./mailer-service.js";

export class MailerServiceImpl extends MailerService {
    async sendMail({ to, subject, html }) {
        return await sendMailImpl({ to, subject, html });
    }
}
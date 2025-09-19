import {mailTransporter} from "./mailer.js";
import {loggerHelper} from "../../utils/logger-helper.js";

export async function sendMail({form = "WaifuVerse Support <no-reply@waifuverse.com>", to, subject, text, html}) {
    try {
        await mailTransporter.sendMail({
            from: form,
            to: to,
            subject: subject,
            text: text,
            html: html || text,
        });
        return true;
    } catch (err) {
        loggerHelper.error("Mail sending failed", {error: err.message});
        return false;
    }
}

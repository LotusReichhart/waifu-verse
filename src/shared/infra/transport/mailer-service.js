import {mailTransporter} from "./mailer.js";

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
        console.log("Mail sending failed:", err.message);
        return false;
    }
}


import nodemailer from "nodemailer";
import {appConfig} from "../../../config/app-config.js";

export const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: appConfig.email.user,
        pass: appConfig.email.password,
    },
});

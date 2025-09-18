import winston from "winston";
import path from "path";
import { appConfig } from "../../config/app-config.js";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `[${level}] ${timestamp}: ${message}`;
});

const logDir = path.resolve(process.cwd(), "logs");

const transports = [
    new winston.transports.Console({
        format: combine(colorize(), logFormat)
    })
];

if (appConfig.environment === "production") {
    transports.push(
        new winston.transports.File({
            filename: path.join(logDir, "error.log"),
            level: "error"
        }),
        new winston.transports.File({
            filename: path.join(logDir, "combined.log")
        })
    );
}

export const loggerHelper = winston.createLogger({
    level: appConfig.environment === "production" ? "info" : "debug",
    format: combine(
        timestamp({ format: "HH:mm:ss DD-MM-YYYY" }),
        logFormat
    ),
    transports
});

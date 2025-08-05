import chalk from "chalk";
import winston from "winston";

const isProd = process.env.NODE_ENV === "production"

const colors = {
    error: "red",
    warn: "yellow",
    info: "blue",
    http: "magenta",
    debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(

    winston.format.timestamp({ format: "DD MMM, YYYY - HH:mm:ss:ms" }),

    winston.format.colorize({ all: true }),

    winston.format.printf(
        (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
);

export const logger = winston.createLogger({
    level: isProd ? 'info' : 'debug',
    format,
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'logs/combined.log' })
    ]
})
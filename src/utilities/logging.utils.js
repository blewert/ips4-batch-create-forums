const winston = require("winston");
const process = require("process");
const package = require("../../package.json");
const fs = require("fs");

// Create transports; combined logs
const winstonTransports = [
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console({
        format: winston.format.cli()
    })
]

//----------

/**
 * The logger for the application.
 */
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "verbose",
    format: winston.format.cli(),
    transports: winstonTransports
})

/**
 * Prints out the title for the application
 */
const printTitle = () =>
{
    logger.info(`${package.name} [${package.version}] started.`);
    logger.info(`License: ${package.license}`);
    logger.info(`Created by: ${package.author}`);
    logger.info("-".repeat(32));
}

//-----------

module.exports = { logger, printTitle };
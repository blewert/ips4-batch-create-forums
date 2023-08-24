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
    logger.info(" ");
}

/**
 * Prints out the help message
 */
const printHelp = () =>
{
    logger.info(`Usage: ${process.argv[1]} --folder <PATH> | --file <PATH>`);
    logger.info("");
    logger.info("\t--folder <PATH>: Will non-recursively run through each file in the given");
    logger.info("\tfolder, parsing each in turn and creating forums from the data.");
    logger.info("\t");
    logger.info("\t--file <PATH>: Will parse a single .yml file, creating forums and subforums");
    logger.info("\tfrom the structure provided within. More notes are supplied in the README of");
    logger.info("\tthis repository");
    logger.info("\t");
    logger.error("Either --folder or --file must be passed to use this program.");
    logger.error("Exiting");
}


//-----------

module.exports = { logger, printTitle, printHelp };
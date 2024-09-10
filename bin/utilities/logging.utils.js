const winston = require("winston");
const process = require("process");
const package = require("../../package.json");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

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
    logger.info(" ");
    logger.info(`${package.name} [${package.version}] started.`);
    logger.info(`License: ${package.license}`);
    logger.info(`Created by: ${package.author}`);
    logger.info(" ");
}

/**
 * Prints out the help message
 */
const printHelp = () =>
{
    const baseFileName = path.basename(process.argv[1]);

    logger.info("");
    logger.info("+---------------------------------------------+");
    logger.info("| ips4 CLI subforum batch creator tool        |");
    logger.info("| Benjamin Williams <b.williams@staffs.ac.uk> |");
    logger.info("+---------------------------------------------+");
    logger.info("");

    logger.info(chalk.greenBright(`Usage: `) + `${baseFileName} --folder <PATH> | --file <PATH>`);
    logger.info(chalk.grey(`       [--parentForumId <ID>, --apiKey <KEY>, --apiBaseUrl <URL>, -i, --dryRun]`));
    logger.info("");

    logger.info(chalk.greenBright("--folder <PATH>") + ": Will non-recursively run through each file in the given");
    logger.info("\tfolder, parsing each in turn and creating forums from the data.");
    logger.info("\t");

    logger.info(chalk.greenBright("--file <PATH>") + ": Will parse a single .yml file, creating forums and subforums");
    logger.info("\tfrom the structure provided within. More notes are supplied in the README of");
    logger.info("\tthis repository");
    logger.info("\t");
    
    logger.info(chalk.greenBright("--parentForumId <ID>") + ": The parent forum ID to create top-most forums under, if");
    logger.info("\tyou want to create the structure under an existing subforum. Helpful for ");
    logger.info("\ttesting the tool. ");
    logger.info("\t");

    logger.info(chalk.greenBright("--apiKey <KEY>") + ": Specifies an API key override to use rather than in .env");
    logger.info("\t");

    logger.info(chalk.greenBright("--apiBaseUrl <URL>") + ": Specifies a URL override to use rather than in .env");
    logger.info("\t");

    logger.info(chalk.greenBright("--dryRun") + ": Performs a dry run, doesn't actually call any API endpoints. Useful");
    logger.info("\tfor testing before a real run.");
    logger.info("\t");

    logger.info(chalk.greenBright("--permissionsFile <PATH>") + ": Specifies a file to read permission sets from, which");
    logger.info("\tcan be specified via a named tag <like_this> at the end of a forum name. More ");
    logger.info("\tinfo can be found in the README file of this repository. ");
    logger.info("\t");

    logger.info(chalk.greenBright("-i") + ": Starts the tool in interactive mode");
    logger.info("\t");
    
    logger.info("----------------------------");
    logger.error("Either --folder or --file must be passed to use this program.");
    logger.error("Exiting");
}


//-----------

module.exports = { logger, printTitle, printHelp };
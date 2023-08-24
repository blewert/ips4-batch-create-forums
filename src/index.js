const fs = require("fs");
const process = require("process");
const dotenv = require("dotenv");
dotenv.config();

const exitcodes = require("./utilities/exitcodes.utils");
const { logger, printTitle } = require("./utilities/logging.utils");

if(!fs.existsSync(".env"))
{
    logger.error("No .env file found. Please create one; you can copy example.env");
    logger.error("and use this for guidance.");
    logger.error("Exiting");
    process.exit(exitcodes.NO_ENV_FILE);
}

if (!process.env.API_KEY || !process.env.API_BASE_URL)
{
    logger.error("No API key or API base url found, cannot continue. Make sure that:");
    logger.error("-\tYou have created a .env file (you can copy & rename example.env)");
    logger.error("-\tYou have set the API_KEY and API_BASE_URL fields.");
    logger.error("Exiting");
    process.exit(exitcodes.NO_API_IN_ENV);
}

// Everything is good
printTitle();

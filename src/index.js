// Libraries
const fs = require("fs");
const process = require("process");
const dotenv = require("dotenv");
dotenv.config();

// Internals
const exitcodes = require("./utilities/exitcodes.utils");
const cliArgs = require("minimist")(process.argv.slice(2));
const appUtils = require("./utilities/application.utils");
const { logger, printTitle, printHelp, getExecutionMode } = require("./utilities/logging.utils");

// Controllers
const folderModeController = require("./controllers/folderMode.controller");


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


if(process.argv.length <= 2 || (!cliArgs.folder && !cliArgs.file))
{
    //Invalid CLI args were passed, show help and exit
    printHelp();
    process.exit(exitcodes.SHOW_HELP_MESSAGE);    
}

//Everything is good, print the title
printTitle();


//Delegate execution via controllers
const executionMode = appUtils.getExecutionMode(cliArgs);

if(executionMode == "folder")
    folderModeController.execute(cliArgs);



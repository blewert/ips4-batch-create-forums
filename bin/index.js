#! /usr/bin/env node

// Libraries
const fs = require("fs");
const process = require("process");
const dotenv = require("dotenv");
const prompts = require("prompts");
dotenv.config();

// Internals
const exitcodes = require("./utilities/exitcodes.utils");
let cliArgs = require("minimist")(process.argv.slice(2));
const appUtils = require("./utilities/application.utils");
const { logger, printTitle, printHelp, getExecutionMode } = require("./utilities/logging.utils");
const promptData = require("./config/prompts");

// Controllers
const folderModeController = require("./controllers/folderMode.controller");
const fileModeController = require("./controllers/fileMode.controller");
const { exit } = require("process");
const chalk = require("chalk");


async function main()
{
    const helpSpecified = (cliArgs.help || cliArgs.h);

    //Are we in interactive mode?
    const isInInteractiveMode = cliArgs.i || cliArgs.interactiveMode;

    //Prompt if interactive is supplied
    if(isInInteractiveMode && !helpSpecified)
    {
        //Print the title and a message
        printTitle();
        logger.info("Starting in interactive mode")

        //Prompt for data
        const data = await prompts(promptData);

        //Merge the two
        cliArgs = {
            ...cliArgs,
            ...data
        }

    }
    
    if (process.argv.length <= 2 || (!cliArgs.folder && !cliArgs.file) || helpSpecified)
    {
        //Invalid CLI args were passed, show help and exit
        printHelp();
        process.exit(exitcodes.SHOW_HELP_MESSAGE);
    }


    //API key && base URL
    let apiKey = cliArgs.apiKey || process.env.API_KEY;
    let apiBaseURL = cliArgs.apiBaseUrl || process.env.API_BASE_URL;
    let permissionsFile = cliArgs.permissionsFile;
    let permissionsObj = null;

    if(!permissionsFile)
        logger.warn("No permissions file passed; any references to permission sets in parsed YML will be ignored");

    if(permissionsFile && !fs.existsSync(permissionsFile))
    {
        logger.error("Permissions file doesn't exist, couldn't open it for parsing.");
        logger.error("Exiting");
        process.exit(exitcodes.PERMISSIONS_FILE_NOT_FOUND);
    }

    //Parse permissions
    permissionsObj = appUtils.parsePermissionsFile(permissionsFile);

    if(!fs.existsSync(".env"))
        logger.warn("No .env file found. Relying on command-line parameters.");

    if (!apiKey || !apiBaseURL)
    {
        logger.error("No API key or API base url found, cannot continue. Make sure that:");
        logger.error("-\tYou have created a .env file (you can copy & rename example.env)");
        logger.error("-\tYou have set the API_KEY and API_BASE_URL fields.");
        logger.error("... or:");
        logger.error("-\tThe API key and base URL are specified via --apiKey and --apiBaseUrl");
        logger.error("Exiting");
        process.exit(exitcodes.NO_API_IN_ENV);
    }

    if(cliArgs.folder && cliArgs.file)
    {
        logger.error("Both folder and file modes have been specified: operation is ambigious. Please");
        logger.error("try again and specify only either --folder or --file.");
        logger.error("Exiting");
        process.exit(exitcodes.FOLDER_AND_FILE_SPECIFIED);
    }

    //Everything is good, print the title
    if(!isInInteractiveMode)
        printTitle();


    if(!cliArgs?.dryRun)
    {
        const response = await prompts([
            {
                type: "confirm",
                name: "confirm",
                message: "The tool is about to run in live mode, i.e. real data will be affected. Are you sure you want to continue?",
                initial: "n"
            },
        ])

        if(!response.confirm)
        {
            logger.info("No worries, exiting!");
            process.exit(exitcodes.BACKOUT_LIVE_DATA);
        }
    }

    //Delegate execution via controllers
    const executionMode = appUtils.getExecutionMode(cliArgs);

    //-------------

    //Get all data ready to send over
    const executionData = {
        cliArgs,
        apiKey,
        apiBaseURL,
        permissions: permissionsObj
    }

    //-------------

    if(executionMode == "folder")
        await folderModeController.execute(executionData);

    else if(executionMode == "file")
        await fileModeController.execute(executionData);
}

main();
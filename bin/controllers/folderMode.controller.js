const fs = require("fs");
const process = require("process");

const { logger } = require("../utilities/logging.utils");
const exitcodes = require("../utilities/exitcodes.utils");
const folderModeController = {};

const YamlForumParser = require("../common/YamlForumParser");

folderModeController.execute = (cliArgs) =>
{
    //Run in folder mode
    logger.info(`Running in folder mode, destination folder is ${cliArgs.folder}`);

    //Does the folder exist?
    if(!fs.existsSync(cliArgs.folder))
    {
        logger.error(`The specified folder '${cliArgs.folder}' does not exist.`);
        logger.error("Exiting.");
        process.exit(exitcodes.FOLDER_DOESNT_EXIST);
    }

    //Ok, enumerate the files
    const dir = fs.readdirSync(cliArgs.folder, { withFileTypes: true });
    const files = dir.filter(x => x.isFile() && x.name.match(/ya?ml$/i)).map(x => x.name);

    logger.info("");
    logger.info(`Found a total of ${files.length} parseable files.`);

    if(files.length <= 0)
    {
        logger.warn("No parseable files found, exiting early.");
        process.exit(exitcodes.NO_PARSEABLE_FILES_IN_FOLDER);
    }

    //Now run through each file and apply parsing
    for(const file of files)
    {
        const path = cliArgs.folder + "/" + file;
        logger.info(`>> Parsing file ${file}`);

        try
        {
            const parser = new YamlForumParser(process.env.API_BASE_URL, process.env.API_KEY);
            parser.createForumsFromFile(path);
        }
        catch(err)
        {
            logger.error("An error occurred during parsing the file " + file + ", details are below:");
            logger.error(err.message);
            logger.error("Exiting");
            process.exit(exitcodes.FOLDER_GENERAL_PARSING_ERROR);
        }

        logger.info(">> Parsed!");
    }
}

module.exports = folderModeController;
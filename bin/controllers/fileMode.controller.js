const fs = require("fs");
const process = require("process");

const { logger } = require("../utilities/logging.utils");
const exitcodes = require("../utilities/exitcodes.utils");
const fileModeController = {};

const YamlForumParser = require("../common/yamlForumParser");

fileModeController.execute = (cliArgs) =>
{
    //Run in folder mode
    logger.info(`Running in file mode, destination file is ${cliArgs.file}`);

    //Does the file exist?
    if (!fs.existsSync(cliArgs.file))
    {
        logger.error(`The specified file '${cliArgs.file}' does not exist.`);
        logger.error("Exiting.");
        process.exit(exitcodes.FILE_DOESNT_EXIST);
    }

    try
    {
        logger.info(">> Parsing file " + cliArgs.file);

        const path = cliArgs.file;
        const parser = new YamlForumParser(process.env.API_BASE_URL, process.env.API_KEY, cliArgs.parentForumId);
        parser.createForumsFromFile(path);
    }
    catch (err)
    {
        logger.error("An error occurred during parsing the file " + cliArgs.file + ", details are below:");
        logger.error(err.message);
        logger.error("Exiting");
        process.exit(exitcodes.FILE_GENERAL_PARSING_ERROR);
    }
}

module.exports = fileModeController;
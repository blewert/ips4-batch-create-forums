const fs = require("fs");
const process = require("process");

const { logger } = require("../utilities/logging.utils");
const exitcodes = require("../utilities/exitcodes.utils");
const fileModeController = {};

const YamlForumParser = require("../common/YamlForumParser");

fileModeController.execute = async(executionData) =>
{
    //Get alias
    const { cliArgs } = executionData;

    //Run in folder mode
    logger.info(`Running in file mode, destination file is ${cliArgs.file}`);

    //Does the file exist?
    if (!fs.existsSync(cliArgs.file))
    {
        logger.error(`The specified file '${cliArgs.file}' does not exist.`);
        logger.error("Exiting.");
        process.exit(exitcodes.FILE_DOESNT_EXIST);
    };

    try
    {
        logger.info(">> Parsing file " + cliArgs.file);

        const path = cliArgs.file;
        const parser = new YamlForumParser(executionData.apiBaseURL, executionData.apiKey, cliArgs.parentForumId, cliArgs.dryRun || false);
        parser.setPermissionSet(executionData.permissions || {});
        await parser.createForumsFromFile(path);
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
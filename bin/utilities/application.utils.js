const yaml = require("yaml");
const fs = require("fs");

const application = {};

/**
 * Gets the execution mode from command-line arguments
 */
application.getExecutionMode = (cliArgs) =>
    (cliArgs.folder && "folder") || (cliArgs.file && "file") || "unknown";


/**
 * Parses a permission file into standard JS objects
 * 
 * @param {*} file 
 * @returns 
 */
application.parsePermissionsFile = (file) =>
{
    //Not provided? do nothing
    if(!file)
        return null;

    //Otherwise, read it in (file exist should be checked by now)
    const data = fs.readFileSync(file, "utf8");

    //Just return the parsed data
    return yaml.parse(data);
}

module.exports = application;
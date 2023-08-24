
const application = {};

/**
 * Gets the execution mode from command-line arguments
 */
application.getExecutionMode = (cliArgs) =>
    (cliArgs.folder && "folder") || (cliArgs.file && "file") || "unknown";

module.exports = application;
const process = require("process");
const fs = require("fs");

module.exports = [
    {
        type: "confirm",
        name: "dryRun",
        message: "Do you want to run the tool in dry-run mode (no actual changes made)?",
        initial: "y"
    },

    {
        type: "confirm",
        name: "useParentId",
        message: "Do you want to insert the forums under a particular forum?"
    },

    {
        type: prev => (prev && "number") || null,
        name: "forumParentId",
        message: "Enter the ID of the parent forum to insert under",
        validate: x => !isNaN(+x)
    },

    {
        type: "text",
        name: "apiKey",
        message: "Insert the forum API key",
        initial: process.env.API_KEY
    },

    {
        type: "text",
        name: "apiBaseUrl",
        message: "Insert the forum API base url",
        initial: process.env.API_BASE_URL
    },

    {
        type: "confirm",
        name: "prompt-permissions",
        message: "Do you want to use a permissions file to load permission sets?"
    },

    {
        type: prev => (prev && "text") || null,
        name: "permissionsFile",
        message: "Enter the path to the permissions file",
        validate: value => fs.existsSync(value) ? true : "File doesn't exist"
    },

    {
        type: "confirm",
        name: "folder-prompt",
        message: "Do you want to run in folder mode (i.e. parsing all yml files within a folder)?"
    },

    {
        type: prev => (prev && "text") || null,
        name: "folder",
        message: "Enter the folder path to parse yml files from",
        validate: value => fs.existsSync(value) ? true : "Folder doesn't exist"
    },

    {
        type: prev => (!prev && "text") || null,
        name: "file",
        message: "Enter the yml file path to parse and create forums from",
        validate: value => fs.existsSync(value) ? true : "File doesn't exist"
    }
];

module.exports = {

    //0xA: Startup errors
    NO_ENV_FILE:   0xA1,
    NO_API_IN_ENV: 0xA2,
    FOLDER_AND_FILE_SPECIFIED: 0xA3,
    
    //0xB: Warnings / non-fatal
    SHOW_HELP_MESSAGE: 0xB1,
    
    //0xC: Errors relating to folder execution mode
    FOLDER_DOESNT_EXIST: 0xC1,
    NO_PARSEABLE_FILES_IN_FOLDER: 0xC2,
    FOLDER_GENERAL_PARSING_ERROR: 0xC3,

    //0xD: Errors relating to file execution mode
    FILE_DOESNT_EXIST: 0xD1,
    FILE_GENERAL_PARSING_ERROR: 0xD2
}
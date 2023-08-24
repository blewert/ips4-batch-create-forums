const fs = require("fs");
const yaml = require("yaml");
const { logger } = require("../utilities/logging.utils");
const APIForumQuery = require("./invision/APIForumQuery");

class YamlForumParser
{
    constructor(apiBase, apiKey, parentForumId=null, dryrun=true)
    {
        //Set up instance variables
        this.apiBase = apiBase;
        this.apiKey = apiKey;
        this.dryrun = !!dryrun;
        this.parentForumId = parentForumId;
    }

    createForumsFromFile(path, dryrun=true)
    {
        //It should exist at this point, but lets make sure
        if(!fs.existsSync(path))
            throw new Error("Source path " + path + " doesn't exist");

        //Read the content, if any errors occur during this period they will be caught
        //by the controller
        const forumsFile = fs.readFileSync(path, "utf8");
        const yamlObj = yaml.parse(forumsFile);

        //The source has been parsed. Iterate recursively over the object
        this.startIteration(yamlObj);
    }

    startIteration(data)
    {
        logger.debug("Starting iteration; dry run is " + (this.dryrun && "enabled") || "disabled");
        this.iterate(this.parentForumId || null, data);
    }

    createFakeForumID(parent, subForum, options)
    {
        // console.log("Create forum " + parent + ": "+ subForum);
        // console.log(subForum);

        if (options)
        {
            // logger.debug("Creating " + subForum + " with options ");
            // logger.debug(Object.entries(options));
        }

        let query = new APIForumQuery(this.apiBase, this.apiKey);

        query.addParameters({
            title: subForum,
            parent: parent || "null",
            ...options
        });

        const uri = encodeURI(query.getQuery());
        console.log(uri);

        return Math.floor(Math.random() * 8000);
    }

    createForum(parent, subForum, options)
    {
        if(this.dryrun)
            return this.createFakeForumID(parent, subForum, options);
        
        return null;
    }
    
    getSpacer(level) 
    {
        return "   ".repeat(level);
    }

    iterate(parent, data, level = 0)
    {
        const entries = Object.keys(data);


        for (let key of entries)
        {
            const dataItem = data[key];

            if (key == "meta")
            {
                continue;
            }

            const options = data[key]?.meta;

            if (typeof (dataItem) == "string")
            {
                const forumId = this.createForum(parent, dataItem, options);
                logger.debug(this.getSpacer(level) + `--> Created leaf forum ${dataItem} with id ${forumId} (parent: ${parent})`);
                continue;
            }

            if (!isNaN(+key))
                key = data[key];

            const forumId = this.createForum(parent, key, options);
            logger.debug("");
            logger.debug(this.getSpacer(level) + `Created forum ${key} with id ${forumId} (parent: ${parent})`);

            if (typeof (data) != "string")
                this.iterate(forumId, data[key], level + 1, options);
        }
    }
}

module.exports = YamlForumParser;
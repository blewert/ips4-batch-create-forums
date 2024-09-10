const fs = require("fs");
const yaml = require("yaml");
const { logger } = require("../utilities/logging.utils");
const APIForumQuery = require("./invision/APIForumQuery");
const axios = require("axios");
const chalk = require("chalk");

class YamlForumParser
{
    constructor(apiBase, apiKey, parentForumId=null, dryrun=true)
    {
        //Set up instance variables
        this.apiBase = apiBase;
        this.apiKey = apiKey;
        this.dryrun = !!dryrun;
        this.parentForumId = parentForumId;

        //Permission set is nothing by default
        this.permSet = {};
    }

    setPermissionSet(data)
    {
        this.permSet = data;
    }

    async createForumsFromFile(path, dryrun=true)
    {
        //It should exist at this point, but lets make sure
        if(!fs.existsSync(path))
            throw new Error("Source path " + path + " doesn't exist");

        //Read the content, if any errors occur during this period they will be caught
        //by the controller
        const forumsFile = fs.readFileSync(path, "utf8");
        const yamlObj = yaml.parse(forumsFile);

        //The source has been parsed. Iterate recursively over the object
        await this.startIteration(yamlObj);
    }

    async startIteration(data)
    {
        logger.verbose("Starting iteration; dry run is " + (this.dryrun && "enabled") || "disabled");
        await this.iterate(this.parentForumId || null, data);
    }

    async createFakeForumID(parent, subForum, options, targetPermSet, leaf)
    {
        let query = new APIForumQuery(this.apiBase, this.apiKey);

        query.addParameters({
            type: (leaf && "normal") || "category", 
            parent: parent || "null",
            ...options,
            permissions: targetPermSet
        });


        let uri = encodeURI(query.getQuery());
        uri += "&title=" + encodeURIComponent(subForum);

        // if (subForum.includes("+") || subForum.includes("&") || subForum.includes("#"))
        logger.debug(uri);

        const value = Math.floor(Math.random() * 8000);

        await new Promise(res => setTimeout(res, 500));

        return value;
    }

    async createRealForumID(parent, forumName, options, targetPermSet, leaf)
    {
        let query = new APIForumQuery(this.apiBase, this.apiKey);

        if(!options)
            options = { };

        if(!options?.description)
            options.description = " ";

        query.addParameters({
            type: (leaf && "normal") || "category",
            parent: parent || "null",
            ...options,
            permissions: targetPermSet
        });


        let uri = encodeURI(query.getQuery());
        uri += "&title=" + encodeURIComponent(forumName);

        logger.debug(uri);
        
        const resp = await axios.post(uri);
        const id = resp.data.id;

        // console.log(id);

        return id;

    }

    async createForum(parent, subForum, options, targetPermSet, iteration)
    {
        //Remove reserved tokens if needed
        const forumName = subForum.replace(/\s*\<(.+?)\>$/, "");
        let returnValue = -1;

        // console.log(this.dryrun);
        if(this.dryrun)
            returnValue = await this.createFakeForumID(parent, forumName, options, targetPermSet?.data, iteration.isLeaf);

        else
            returnValue = await this.createRealForumID(parent, forumName, options, targetPermSet?.data, iteration.isLeaf);


        const parentString = chalk.greenBright(`${parent}`);
        const idString = chalk.greenBright(`${returnValue}`);
        const targetPermSetName = chalk.yellow(`${targetPermSet?.name}`);

        if(!iteration.isLeaf)
            logger.verbose(this.getSpacer(iteration.level) + `Created forum ${forumName} with id ${idString} (parent: ${parentString}) <${targetPermSetName}>`);
        
        else
            logger.verbose(this.getSpacer(iteration.level) + `--> Created leaf forum ${forumName} with id ${idString} (parent: ${parentString}) <${targetPermSetName}>`);

        return returnValue;
    }
    
    getSpacer(level) 
    {
        return "   ".repeat(level);
    }

    getPermSetFromName(name, isLeaf)
    {
        const match = name.match(/\<(.+?)\>$/);
        const permSetObj = (x, y) => { return { name: x, data: y }};

        if(!match)
        {
            //Use leaves if a leaf & profile is found
            if (Object.keys(this.permSet).includes("leaves") && isLeaf)
                return permSetObj("leaves", this.permSet["leaves"]);

            //Use default if a default profile is found
            if (Object.keys(this.permSet).includes("default"))
                return permSetObj("default", this.permSet["default"]);

            //Use nodes if a node & profile is found
            if (Object.keys(this.permSet).includes("nodes") && !isLeaf)
                return permSetObj("nodes", this.permSet["nodes"]);

            return permSetObj("null", {});
        }

        const permSetName = match[1];

        if (permSetName && !Object.keys(this.permSet).includes(permSetName))
        {
            logger.warn(`Target perm set ${permSetName} not found in permissions data.`);
            return permSetObj("null", {});
        }

        return permSetObj(permSetName, this.permSet[permSetName]);
    }

    async iterate(parent, data, level = 0)
    {
        const entries = Object.keys(data);


        for (let key of entries)
        {
            const dataItem = data[key];

            if (key == "meta" || key == "permSet")
            {
                continue;
            }

            const options = data[key]?.meta;

            if (typeof (dataItem) == "string")
            {
                const targetPermSet = this.getPermSetFromName(dataItem, true);
                const forumId = this.createForum(parent, dataItem, options, targetPermSet, { level, isLeaf: true });
                
                continue;
            }

            if (!isNaN(+key))
                key = data[key];

            const targetPermSet = this.getPermSetFromName(key, false);
            const forumId = await this.createForum(parent, key, options, targetPermSet, { level, isLeaf: false });

            if (typeof (data) != "string")
                this.iterate(forumId, data[key], level + 1, options);
        }
    }
}

module.exports = YamlForumParser;
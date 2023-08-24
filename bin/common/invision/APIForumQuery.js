const APIQuery = require("./APIQuery");

class APIForumQuery extends APIQuery
{
    constructor(apiBase, apiKey)
    {
        super(apiBase, apiKey);
    }

    get method()
    {
        return "/forums/forums"
    }
}

module.exports = APIForumQuery;
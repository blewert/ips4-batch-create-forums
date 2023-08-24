class APIQueryString
{
    constructor(apiBase, apiKey, query)
    {
        this.apiBase = apiBase;
        this.apiKey = apiKey;
        this.query = query;
    }

    toString()
    {
        return this.fullQuery;
    }

    get fullQuery()
    {
        return this.apiBase + this.query + "&key=" + this.apiKey;
    }
}

module.exports = APIQueryString;
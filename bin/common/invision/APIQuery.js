const APIQueryString = require("./APIQueryString");

class APIQuery
{
    constructor(apiBase, apiKey)
    {
        this.apiBase = apiBase;
        this.apiKey = apiKey;

        this.params = {};
    }

    addParameter(key, obj)
    {
        this.params = {
            ...this.params,
            [key]: obj
        }
    }

    addParameters(obj)
    {
        this.params = {
            ...this.params,
            ...obj
        }
    }

    getQuery()
    {
        //It would normally be as easy as just using the querystring
        //library, but it doesn't support the weird php argument formats
        //that IPS4's API relies on.
        //..

        //As a note, the API requires "object" formats to be passed via 
        //URL, which seems a bit weird. The format for this is in outerkey[innerkey] = value
        //..

        //So for example..
        //
        //  permissions: {
        //      view: 4
        //      add: 4
        //      read: 4
        //  }
        //
        //becomes: ?permissions[view]=4&permissions[add]=4&permissions[read]=4.
        //..

        //Get params as an array
        const fmtedParams = Object.entries(this.params).map(param => {
            const paramKey = param[0];
            const paramValue = param[1];

            //If the value is an object, map it shallowly
            if(!Array.isArray(paramValue) && typeof(paramValue) == "object")
                return Object.keys(paramValue).map(paramValueKey => `${paramKey}[${paramValueKey}]=${paramValue[paramValueKey]}`).join("&");

            //If the value is an array, map it with indices
            if(Array.isArray(paramValue))
                return paramValue.map((value, index) => `${paramKey}[${index}]=${value}`).join("&");

            //Otherwise it's just plain ol' data
            return `${paramKey}=${paramValue}`
        });

        //And just join them together
        return new APIQueryString(this.apiBase, this.apiKey, `?${this.method}&` + fmtedParams.join('&')).fullQuery;
    }

    get method()
    {
        return "";
    }

    setAPIKey(key)
    {
        this.apiKey = key;
    }

    setAPIBase(base)
    {
        this.apiBase = base;
    }
}

module.exports = APIQuery;
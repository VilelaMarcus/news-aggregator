import axios from 'axios';

const buildQueryUrl = (baseUrl, apiKeyParam, apiKey, params = {}) => {
    let queryParameters = '';
    for (const [key, value] of Object.entries(params)) {
        if (value) {
            queryParameters += `${key}=${value}&`;
        }
    }
    return `${baseUrl}?${queryParameters}${apiKeyParam}=${apiKey}`;
};

const fetchFromApi = async (baseUrl, apiKeyParam, apiKey, params) => {
    try {
        const url = buildQueryUrl(baseUrl, apiKeyParam, apiKey, params);
        const { data } = await axios.get(url);
        return data.articles || data.response.docs;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const fetchNewsApiOrg = async ({ category = '', keyword = '' } = {}) => {
    const baseUrl = 'https://newsapi.org/v2/everything';
    const apiKeyParam = 'apiKey';
    const apiKey = import.meta.env.VITE_NEWS_API_ORG_KEYS;
    if(category && keyword === ''){
        keyword = category;
    }
    const params = {
        q: keyword || 'us'
    };
    return await fetchFromApi(baseUrl, apiKeyParam, apiKey, params);
};

export const fetchNewYorkTimes = async ({ keyword = '', category = '' } = {}) => {
    const baseUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    const apiKeyParam = 'api-key';
    const apiKey = import.meta.env.VITE_NEW_YORK_TIMES_API_KEY;
    if(category && keyword === ''){
        keyword = category;
    }
    const params = {
        q: keyword || 'us'
    };
    return await fetchFromApi(baseUrl, apiKeyParam, apiKey, params);
};

export const fetchNewsAPI = async ({ 
    locationUri = 'United_States',
    category = '', 
    keyword = ''
} = {}) => {
    const queryConditions = [];

    if (category) {
        queryConditions.push({ "categoryUri": `dmoz/${category}` });
    }

    if (locationUri) {
        queryConditions.push({ "locationUri": `http://en.wikipedia.org/wiki/${locationUri}` });
    }

    if (keyword) {
        queryConditions.push({ "keyword": keyword, "keywordLoc": "title" });
    }

    queryConditions.push({ "lang": "eng" });

    const data = {
        "query": {
            "$query": {
                "$and": queryConditions
            },
            "$filter": {
                "forceMaxDataTimeWindow": "31" // free key only allows 31 days
            }
        },
        "resultType": "articles",
        "articlesSortBy": "date",
        "includeArticleImage": true,
        "apiKey": import.meta.env.VITE_NEWS_API_KEY
    };

    try {
        const response = await axios.post('https://www.newsapi.ai/api/v1/article/getArticles', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data.articles.results;
    } catch (error) {
        console.error('Error fetching news from NewsAPI:', error);
        throw error;
    }
};
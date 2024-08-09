import axios from 'axios';

// Fetch news from the News API ORG
export const fetchNewsApiOrg = async ({ 
    category = '', 
    keyword = 'us'
} = {}) => {

    let queryParameters = '';
    if (keyword) {
        queryParameters += `q=${keyword}&`;
    }
    if (category) {
        queryParameters += `category=${category}&`;
    }

    try {
        const { data } = await axios.get(`https://newsapi.org/v2/everything?${queryParameters}apiKey=${import.meta.env.VITE_NEWS_API_ORG_KEYS}`);
        return data.articles;
    } catch (error) {
        console.error('Error fetching news from NewsAPI.org:', error);
        throw error; // Re-throw the error for handling at the call site
    }
};

// Fetch news from the News API
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
        throw error; // Re-throw the error for handling at the call site
    }
};

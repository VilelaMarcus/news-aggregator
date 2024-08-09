import { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import NewsCard from '../../components/NewsCard';
import { fetchNewsAPI, fetchNewsApiOrg } from '../../api';

const Home = () => {
    const [articles, setArticles] = useState([]);

    fetchNewsAPI({
    keyword: 'Tesla',
    locationUri: 'United_States',
    }).then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(error);
    });

    fetchNewsApiOrg().then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });

    useEffect(() => {
    const fetchNews = async () => {
        try {
        const [apiOrgData, apiData] = await Promise.all([
            fetchNewsApiOrg({}),
            fetchNewsAPI({})
        ]);

        const newsToShow = apiData.map((item) => {
            return {
                title: item.title,
                description: item.body,
                author: item.authors ? item.authors.map(author => author.name).join(", ") : "Unknown", // Joining authors' names
                urlToImage: item.image,
                url: item.url
            };
        });

        console.log({newsToShow});
        console.log({apiData});

        // Combine and set articles
        setArticles([...apiOrgData, ...newsToShow]);
        } catch (error) {
        console.error("Error fetching news:", error);
        }
    };

    fetchNews();
    }, []);

    return (
    <Container>
        <Grid container spacing={2}>
        {articles.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <NewsCard article={article} />
            </Grid>
        ))}
        </Grid>
    </Container>
    );
};

export default Home;
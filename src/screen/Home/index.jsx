import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Grid, FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress, Backdrop, Button } from '@mui/material';
import NewsCard from '../../components/NewsCard';
import { fetchNewsAPI, fetchNewsApiOrg, fetchNewYorkTimes } from '../../api';

const fetchNews = async (query) => {
    const results = await Promise.allSettled([
        fetchNewsApiOrg({ keyword: query }),
        fetchNewsAPI({ keyword: query }),
        fetchNewYorkTimes({ keyword: query })
    ]);

    const apiOrgData = results[0].status === 'fulfilled' ? results[0].value : [];
    const apiData = results[1].status === 'fulfilled' ? results[1].value : [];
    const newYorkTimesData = results[2].status === 'fulfilled' ? results[2].value : [];

    const newsToShow = apiData.map((item) => ({
        title: item.title,
        description: item.body,
        author: item.authors ? item.authors.map(author => author.name).join(", ") : "Unknown",
        urlToImage: item.image,
        url: item.url,
        dateTime: item.dateTime,
        source: item.source.title
    }));

    const apiOrgDataToShow = apiOrgData.map((item) => ({
        title: item.title,
        description: item.description,
        author: item.author,
        urlToImage: item.urlToImage,
        url: item.url,
        dateTime: item.dateTime || item.publishedAt,
        source: item.source.name
    }));

    const newYorkTimesDataToShow = newYorkTimesData.map((item) => ({
        title: item.headline.main,
        description: item.abstract,
        author: item.byline.original,
        urlToImage: item.multimedia.length ? `https://www.nytimes.com/${item.multimedia[0].url}` : "",
        url: item.web_url,
        dateTime: item.pub_date,
        source: item.source
    }));

    return [...apiOrgDataToShow, ...newsToShow, ...newYorkTimesDataToShow]
        .filter((article, index, self) =>
            index === self.findIndex(a => a.title === article.title))
        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
};

const Home = ({ searchQuery }) => {
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 24;

    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['news', searchQuery],
        queryFn: () => fetchNews(searchQuery),
        keepPreviousData: true // Mantém os dados antigos enquanto novos são carregados
    });

    // Filtro e paginação
    const filteredArticles = useMemo(() => {
        const filtered = articles.filter(article => {
            const matchesSource = selectedSource ? (article.source || "").includes(selectedSource) : true;
            const matchesDate = selectedDate ? new Date(article.dateTime).toDateString() === new Date(selectedDate).toDateString() : true;
            return matchesSource && matchesDate;
        });

        return filtered;
    }, [articles, selectedSource, selectedDate]);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    return (
        <Container maxWidth={false}>
            {isLoading && (
                <Backdrop
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <FormControl fullWidth style={{ flex: 1 }}>
                    <InputLabel id="source-label">Source</InputLabel>
                    <Select
                        labelId="source-label"
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="">All Sources</MenuItem>
                        {Array.from(new Set(articles.map(article => article.source)))
                            .map((source, index) => (
                                <MenuItem key={index} value={source}>{source}</MenuItem>
                            ))}
                    </Select>
                </FormControl>

                <TextField
                    type="date"
                    label="Date"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    fullWidth
                    style={{ flex: 1 }}
                />
            </div>

            <Grid container spacing={2}>
                {currentArticles.map((article, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <NewsCard article={article} />
                    </Grid>
                ))}
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setCurrentPage(prev => prev - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setCurrentPage(prev => prev + 1)} 
                    disabled={currentPage === Math.ceil(filteredArticles.length / articlesPerPage)}
                >
                    Next
                </Button>
            </div>
        </Container>
    );
};

export default Home;
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Grid, FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress, Backdrop, Button } from '@mui/material';
import NewsCard from '../../components/NewsCard';
import { fetchNewsAPI, fetchNewsApiOrg, fetchNewYorkTimes } from '../../api';

const CATEGORIES = [
    "Health", "Science", "Arts", "Business", "Sports", "Technology", "World", "Politics",
    "Entertainment", "Opinion", "Travel", "Food", "Computers", "Video Games", "Books"
];

const fetchNews = async (query, category = '') => {
    const results = await Promise.allSettled([
        fetchNewsApiOrg({ keyword: query, category }),
        fetchNewsAPI({ keyword: query, category }),
        fetchNewYorkTimes({ keyword: query, category })
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
        source: 'News API'
    }));

    const apiOrgDataToShow = apiOrgData.map((item) => ({
        title: item.title,
        description: item.description,
        author: item.author,
        urlToImage: item.urlToImage,
        url: item.url,
        dateTime: item.dateTime || item.publishedAt,
        source: 'API Org'
    }));

    const newYorkTimesDataToShow = newYorkTimesData.map((item) => ({
        title: item.headline.main,
        description: item.abstract,
        author: item.byline.original,
        urlToImage: item.multimedia.length ? `https://www.nytimes.com/${item.multimedia[0].url}` : "",
        url: item.web_url,
        dateTime: item.pub_date,
        source: 'New York Times'
    }));

    return [...apiOrgDataToShow, ...newsToShow, ...newYorkTimesDataToShow]
        .filter((article, index, self) =>
            index === self.findIndex(a => a.title === article.title))
        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
};

const Home = ({ searchQuery }) => {
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 24;

    const { data: articles = [], isLoading, refetch } = useQuery({
        queryKey: ['news', searchQuery, selectedCategory],
        queryFn: () => fetchNews(searchQuery, selectedCategory),
        keepPreviousData: true
    });

    // Requisição ao mudar categoria
    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setCurrentPage(1);
        refetch(); // Requisição de nova busca
    };

    // Filtro e paginação
    const filteredArticles = useMemo(() => {
        const filtered = articles.filter(article => {
            const matchesSource = selectedSource ? article.source === selectedSource : true;
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
                    <InputLabel id="source-label" shrink>Source</InputLabel>
                    <Select
                        labelId="source-label"
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="">All Sources</MenuItem>
                        <MenuItem value="API Org">API Org</MenuItem>
                        <MenuItem value="News API">News API</MenuItem>
                        <MenuItem value="New York Times">New York Times</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth style={{ flex: 1 }}>
                    <InputLabel id="category-label" shrink>Category</InputLabel>
                    <Select
                        labelId="category-label"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        displayEmpty
                        label="Category"
                        defaultValue=""
                    >
                        <MenuItem value="">
                            <em>All Categories</em>
                        </MenuItem>
                        {CATEGORIES.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
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
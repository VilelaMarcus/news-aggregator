import { useEffect, useState } from 'react';
import { Container, Grid, FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress, Backdrop, Button } from '@mui/material';
import NewsCard from '../../components/NewsCard';
import { fetchNewsAPI, fetchNewsApiOrg } from '../../api';

const Home = ({ searchQuery }) => {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 20; // Defina o número de artigos por página

    useEffect(() => {
        setLoading(true);
        const fetchNews = async (query) => {
            try {
                const [apiOrgData, apiData] = await Promise.all([
                    fetchNewsApiOrg({ keyword: query }),  // Passa o termo de busca para a API
                    fetchNewsAPI({ keyword: query })     // Passa o termo de busca para a API
                ]);

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

                // Combine the articles and sort by dateTime
                const combinedArticles = [...apiOrgDataToShow, ...newsToShow]
                    .filter((article, index, self) =>
                        index === self.findIndex(a => a.title === article.title))
                    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

                setArticles(combinedArticles);
                setFilteredArticles(combinedArticles);

                // Extract unique sources from the articles
                const uniqueSources = [...new Set(combinedArticles.map(article => article.source))];
                setSources(uniqueSources);
            }
            catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews(searchQuery); 
    }, [searchQuery]);

    useEffect(() => {
        const filtered = articles.filter(article => {
            const matchesSource = selectedSource ? (article.source || "").includes(selectedSource) : true;
            const matchesDate = selectedDate ? new Date(article.dateTime).toDateString() === new Date(selectedDate).toDateString() : true;
            return matchesSource && matchesDate;
        });

        setFilteredArticles(filtered);
        setCurrentPage(1);
    }, [selectedSource, selectedDate, articles]);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    return (
        <Container maxWidth={false}>
            {/* Spinner and backdrop */}
            {loading && (
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
                    open={loading}
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
                        {sources.map((source, index) => (
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
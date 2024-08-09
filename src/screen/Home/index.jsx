import { useEffect, useState } from 'react';
import { Container, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import NewsCard from '../../components/NewsCard';
import { fetchNewsAPI, fetchNewsApiOrg } from '../../api';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const [apiOrgData, apiData] = await Promise.all([
                    fetchNewsApiOrg({}),
                    fetchNewsAPI({})
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
                const combinedArticles = [...apiOrgDataToShow, ...newsToShow].sort(
                    (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
                );

                setArticles(combinedArticles);
                setFilteredArticles(combinedArticles);

                // Extract unique sources from the articles
                const uniqueSources = [...new Set(combinedArticles.map(article => article.source))];
                setSources(uniqueSources);
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };

        fetchNews();
    }, []);

    useEffect(() => {
        const filtered = articles.filter(article => {
            const matchesSource = selectedSource ? (article.source || "").includes(selectedSource) : true;
            const matchesDate = selectedDate ? new Date(article.dateTime).toDateString() === new Date(selectedDate).toDateString() : true;
            return matchesSource && matchesDate;
        });

        setFilteredArticles(filtered);
    }, [selectedSource, selectedDate, articles]);

    return (
        <Container maxWidth={false} style={{ width: '100%' }}>
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
                {filteredArticles.map((article, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <NewsCard article={article} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Home;
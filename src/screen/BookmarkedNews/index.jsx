import { useState, useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import NewsCard from '../../components/NewsCard';

const BookmarkedNews = () => {
    const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

    useEffect(() => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        setBookmarkedArticles(bookmarks);
    }, []);

    console.log({ bookmarkedArticles });

    return (
        <Container maxWidth={false} style={{ width: '100%', paddingTop: '16px' }}>
            <Typography variant="h4" gutterBottom>
                Bookmarked News
            </Typography>
            {bookmarkedArticles.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                    No bookmarked articles found.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {bookmarkedArticles.map((article, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <NewsCard article={article} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default BookmarkedNews;
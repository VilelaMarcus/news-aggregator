import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; // Import the outlined bookmark icon
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { styled } from '@mui/system';

const CardContainer = styled(Card)({
  height: 400,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 8,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
});

const Media = styled(CardMedia)({
  height: '50%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const Content = styled(CardContent)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '16px',
});

const Title = styled(Typography)({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginBottom: '8px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3, 
  WebkitBoxOrient: 'vertical',
});

const Description = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  marginBottom: '16px',
});

const ReadMoreButton = styled(Button)({
  alignSelf: 'flex-start',
});

const BookmarkButton = styled(IconButton)({
  alignSelf: 'flex-end',
});

const NewsCard = ({ article }) => {
  const { url, title, description, urlToImage, author } = article;
  const [isBookmarked, setIsBookmarked] = useState(() => {
    // Check if the article is already bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    return bookmarks.some(bookmark => bookmark.url === url);
  });
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    if (isBookmarked) {
      // Remove the bookmark
      const newBookmarks = bookmarks.filter(bookmark => bookmark.url !== url);
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(false);
    } else {
      // Add the new bookmark
      bookmarks.push(article);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent the default context menu
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  const handleAddToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('preferredAuthors')) || [];
    if (!favorites.some(favorite => favorite === author)) {
      favorites.push(author);
      localStorage.setItem('preferredAuthors', JSON.stringify(favorites));
    }
    handleCloseMenu();
  };

  const defaultImage = '../../public/default.png';

  return (
    <CardContainer>
      <Media
        image={urlToImage || defaultImage}
        title={title}
      />
      <Content>
        <Title variant="h6">
          {title}
        </Title>
        <Description variant="body2" color="textSecondary">
          {description}
        </Description>
        <Typography
          variant="caption"
          color="textSecondary"
          onContextMenu={handleContextMenu} // Add context menu handler
        >
          Author: {author || 'Unknown'}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
          <Tooltip title="Read More">
            <ReadMoreButton href={url} target="_blank" rel="noopener noreferrer" variant="contained" color="primary">
              Read More
            </ReadMoreButton>
          </Tooltip>
          <Tooltip title="Bookmark">
            <BookmarkButton onClick={handleBookmark}>
              {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />} 
            </BookmarkButton>
          </Tooltip>
        </div>
      </Content>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleAddToFavorites}>Add to Favorites</MenuItem>
      </Menu>
    </CardContainer>
  );
};

export default NewsCard;
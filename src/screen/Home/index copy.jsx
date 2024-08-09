import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, IconButton, Tooltip } from '@mui/material';
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
  height: '50%',  // Adjust to take up 1/2 of the card's height
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
});

const Description = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3, // Number of lines before truncation
  WebkitBoxOrient: 'vertical',
  marginBottom: '16px',
});

const ReadMoreButton = styled(Button)({
  alignSelf: 'flex-start',
});

const NewsCard = ({ article }) => {
  const { title, description, urlToImage, author } = article;

  return (
    <CardContainer>
      <Media
        image={urlToImage}
        title={title}
      />
      <Content>
        <Title variant="h6">
          {title}
        </Title>
        <Description variant="body2" color="textSecondary">
          {description}
        </Description>
        <Typography variant="caption" color="textSecondary">
          {author}
        </Typography>
        <Tooltip title="Read More">
        <IconButton href={url} target="_blank" rel="noopener noreferrer">
            <ReadMoreIcon />
        </IconButton>
        </Tooltip>
      </Content>
    </CardContainer>
  );
};

export default NewsCard;

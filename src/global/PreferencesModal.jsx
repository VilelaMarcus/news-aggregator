import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from '@mui/material';

const CATEGORIES = [
    "Health", "Science", "Arts", "Business", "Sports", "Technology", "World", "Politics",
    "Entertainment", "Opinion", "Travel", "Food", "Computers", "Video Games", "Books"
];

const SOURCES = ["API Org", "News API", "New York Times"];

const ModalPreferences = ({ open, handleClose }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSources, setSelectedSources] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);

    const handleCategoryChange = (event) => {
        setSelectedCategories(event.target.value);
    };

    const handleSourceChange = (event) => {
        setSelectedSources(event.target.value);
    };

    const handleAuthorChange = (event) => {
        setSelectedAuthors(event.target.value);
    };

    const handleSave = () => {
        // Salve as preferências no local storage ou onde preferir
        localStorage.setItem('categories', JSON.stringify(selectedCategories));
        localStorage.setItem('sources', JSON.stringify(selectedSources));
        localStorage.setItem('authors', JSON.stringify(selectedAuthors));
        handleClose(); // Fecha o modal após salvar
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%', // Ajuste a largura conforme necessário
                    maxWidth: '800px',
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    boxShadow: 24,
                    p: 4,
                    color: 'white', // Fonte branca
                    backgroundColor: '#333', // Cor de fundo escura
                }}
            >
                <Typography id="modal-title" variant="h6" component="h2">
                    Customize Your Preferences
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            multiple
                            value={selectedCategories}
                            onChange={handleCategoryChange}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {CATEGORIES.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="source-label">Source</InputLabel>
                        <Select
                            labelId="source-label"
                            multiple
                            value={selectedSources}
                            onChange={handleSourceChange}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {SOURCES.map((source) => (
                                <MenuItem key={source} value={source}>
                                    {source}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalPreferences;
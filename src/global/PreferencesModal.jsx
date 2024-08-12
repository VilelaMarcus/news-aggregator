import { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from '@mui/material';
import { CATEGORIES, SOURCES } from './constants';

const ModalPreferences = ({ open, handleClose }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSources, setSelectedSources] = useState([]);

    const handleCategoryChange = (event) => {
        setSelectedCategories(event.target.value);
    };

    const handleSourceChange = (event) => {
        setSelectedSources(event.target.value);
    };

    const handleSave = () => {
        localStorage.setItem('preferredCategories', JSON.stringify(selectedCategories));
        localStorage.setItem('preferredSources', JSON.stringify(selectedSources));
        handleClose();
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
                    width: '80%',
                    maxWidth: '800px',
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    boxShadow: 24,
                    p: 4,
                    color: 'white',
                    backgroundColor: '#333',
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 2 }}>
                        <Typography>
                            <strong>Note:</strong> To set a preferred author, you can right-click on the author's name in the news card.
                        </Typography>
                    </Box>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalPreferences;
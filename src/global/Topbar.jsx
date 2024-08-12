import React, { useState } from 'react';
import { Box, IconButton, useTheme, Tooltip, InputBase } from '@mui/material';
import { ColorModeContext, tokens } from '../theme';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Settings } from '@mui/icons-material';
import ModalPreferences from './PreferencesModal'; // Importe o modal

const Topbar = ({ onSearch }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = React.useContext(ColorModeContext);

    const [searchInput, setSearchInput] = useState('');
    const [openModal, setOpenModal] = useState(false); // Controle do modal

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearch = () => {
        if (searchInput.trim()) {
            onSearch(searchInput);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            <Box
                display="flex"
                backgroundColor={colors.primary[400]}
                borderRadius="3px"
                width="300px"
            >
                <InputBase
                    placeholder="Search..."
                    value={searchInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    sx={{ ml: 1, flex: 1, paddingLeft: 2 }}
                />
                <IconButton type="button" onClick={handleSearch} sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* ICONS */}
            <Box display="flex">
                <Tooltip title="Dark/Light mode" arrow>
                    <IconButton onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === 'dark' ? (
                            <DarkModeOutlinedIcon />
                        ) : (
                            <LightModeOutlinedIcon />
                        )}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Change preferences" arrow>
                    <IconButton onClick={() => setOpenModal(true)}>
                        <Settings />
                    </IconButton>
                </Tooltip>
                <ModalPreferences open={openModal} handleClose={() => setOpenModal(false)} />
            </Box>
        </Box>
    );
};

export default Topbar;
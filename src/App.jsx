import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Topbar from './global/Topbar';
import Sidebar from './global/Sidebar';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import Home from './screen/Home';
import MobileFooter from './global/MobileFooter'; 
import BookmarkedNews from './screen/BookmarkedNews';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Importe o QueryClientProvider

const queryClient = new QueryClient();

function App() {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState(""); // Estado para armazenar a pesquisa

    const isMobile = useMediaQuery('(max-width:600px)');

    const handleSearch = (query) => {
        setSearchQuery(query); // Atualiza o estado com o valor da pesquisa
    };

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <QueryClientProvider client={queryClient}>
                    <div className="app" style={{ display: 'flex' }}>
                        {!isMobile && <Sidebar isSidebar={isSidebar} />}
                        <main className="content" style={{ padding: '16px', overflowY: 'auto', height: '100vh' }}>
                            <Topbar setIsSidebar={setIsSidebar} onSearch={handleSearch} />
                            <Routes>
                                <Route path="/" element={<Home searchQuery={searchQuery} />} /> 
                                <Route path="/bookmarked" element={<BookmarkedNews />} />
                            </Routes>
                        </main>
                        {isMobile && <MobileFooter />}
                    </div>
                </QueryClientProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
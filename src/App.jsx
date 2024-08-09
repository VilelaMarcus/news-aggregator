import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./global/Topbar";
import Sidebar from "./global/Sidebar";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Home from "./screen/Home";
import MobileFooter from "./global/MobileFooter"; 

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para armazenar a pesquisa
  
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleSearch = (query) => {
    setSearchQuery(query); // Atualiza o estado com o valor da pesquisa
  };

  return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app" style={{ display: 'flex' }}>
            {!isMobile && <Sidebar isSidebar={isSidebar} />}
            <main className="content" style={{ padding: '16px', overflowY: 'auto', height: '100vh' }}>
              <Topbar setIsSidebar={setIsSidebar} onSearch={handleSearch} />
              <Routes>
                <Route path="/" element={<Home searchQuery={searchQuery} />} /> {/* Passa a busca como props */}
              </Routes>
            </main>
            {isMobile && <MobileFooter />}
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
  );
}

export default App;
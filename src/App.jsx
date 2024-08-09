import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./global/Topbar";
import Sidebar from "./global/Sidebar";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Home from "./screen/Home";
import MobileFooter from "./global/MobileFooter"; // Import the mobile footer component

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  // Use useMediaQuery to check if the screen width is less than 600px (mobile devices)
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app" style={{ display: 'flex' }}>
            {/* Conditionally render the sidebar */}
            {!isMobile && <Sidebar isSidebar={isSidebar} />}
            <main className="content" style={{ padding: '16px', overflowY: 'auto', height: '100vh' }}>
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </main>
            {/* Render the MobileFooter only on mobile devices */}
            {isMobile && <MobileFooter />}
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
  );
}

export default App;
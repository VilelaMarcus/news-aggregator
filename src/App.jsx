import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./global/Topbar";
import Sidebar from "./global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Home from "./screen/Home";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  // const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // if (!isAuthenticated && !isLoading) {
  // loginWithRedirect();
  // }

  return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app" style={{ display: 'flex' }}>
            <Sidebar isSidebar={isSidebar} />
            <main className="content" style={{ padding: '16px', overflowY: 'auto', height: '100vh' }}>
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
  );
}

export default App;

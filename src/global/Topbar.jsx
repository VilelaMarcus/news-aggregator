import { Box, IconButton, useTheme, Tooltip, InputBase } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../theme";
import { useAuth0 } from "@auth0/auth0-react";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search"; // Ícone de lupa para busca

const Topbar = ({ onSearch }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { logout } = useAuth0();

  const [searchInput, setSearchInput] = useState(""); // Estado local para armazenar o valor da pesquisa

  const handleInputChange = (event) => {
    setSearchInput(event.target.value); // Atualiza o valor do input
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      onSearch(searchInput); // Envia o valor da pesquisa quando o botão for clicado ou "Enter" for pressionado
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Aciona a busca ao pressionar "Enter"
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
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
          onKeyDown={handleKeyDown} // Captura o evento de pressionar tecla
          sx={{ ml: 1, flex: 1 }}
        />
        <IconButton type="button" onClick={handleSearch} sx={{ p: 1 }}>
          <SearchIcon /> {/* Ícone de lupa */}
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">        
        <Tooltip title="Dark/Light mode" arrow>
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Log out" arrow>
          <IconButton onClick={logout}>
            <PersonOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Topbar;
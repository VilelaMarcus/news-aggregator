import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const MobileFooter = () => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    return (
        <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
            setValue(newValue);
            // Navigate to different routes based on selected value
            if (newValue === 0) navigate("/");
            if (newValue === 1) navigate("/search");
            if (newValue === 2) navigate("/profile");
        }}
        style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000, // Ensure it's above other content
        }}
        >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
        <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
        </BottomNavigation>
    );
};

export default MobileFooter;
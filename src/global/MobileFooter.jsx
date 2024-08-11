import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";

import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
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
            if (newValue === 1) navigate("/bookmarked");
        }}
        style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000, // Ensure it's above other content
        }}
        >
        <BottomNavigationAction label="Home" icon={<NewspaperOutlinedIcon />} />

        <BottomNavigationAction label="BookMarked" icon={<BookmarkOutlinedIcon />} />
        </BottomNavigation>
    );
};

export default MobileFooter;
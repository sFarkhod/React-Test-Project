import { Box, IconButton } from "@mui/material";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";


const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const includedPaths = ["/dashboard", "/myself"];
  const showNavbar = includedPaths.includes(location.pathname);

  if (!showNavbar) {
    return null;
  }

  const handleProfileClick = () => {
    navigate("/myself");
  };

  const handleTextClick = () => {
    navigate("/dashboard");
  }

  return (
    <nav className="navbar">
      <Box
        sx={{
          position: "relative",
          height: "60px",
          display: "flex",
          alignItems: "center",
          marginLeft: "50px",
          marginRight: "50px",
          color: "white",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3 className="navbarText" onClick={handleTextClick}>sFarkhod</h3>
        </div>
        <IconButton onClick={handleProfileClick} color="inherit">
          <AccountCircleIcon />
        </IconButton>
      </Box>
    </nav>
  );
};

export default Navbar;
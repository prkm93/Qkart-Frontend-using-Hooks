import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { useHistory } from "react-router-dom";
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
     
    const history = useHistory();
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('username');

    const handleLogout = () => {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      localStorage.removeItem('balance');
      history.push("/");
    }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        {
          hasHiddenAuthButtons ?
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => history.push("/")}
          >
            Back to explore
          </Button> :
          token ? 
          <Stack direction="row" spacing={2}>
            <Avatar src="avatar.png" alt={user}/>
            <div style={{marginTop: "8px"}}>{user && user}</div>
            <Button role="button" className="button" variant="text" onClick={handleLogout}>Logout</Button>
          </Stack> :
          <Stack direction="row" spacing={2}>
            <Button role="button" className="button" variant="text" onClick={() => history.push("/login")}>Login</Button>
            <Button role="button" className="button" variant="contained" onClick={() => history.push("/register")}>Register</Button>
          </Stack>
        }
      </Box>
    );
};

export default Header;

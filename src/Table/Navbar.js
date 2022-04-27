import React from "react";
import {
    AppBar,
    Toolbar,
    CssBaseline,
    Typography,
    makeStyles,
} from "@material-ui/core";
import Button from '@mui/material/Button';
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    navlinks: {
        marginLeft: theme.spacing(10),
        display: "flex",
    },
    logo: {
        flexGrow: "1",
        cursor: "pointer",
    },
    link: {
        textDecoration: "none",
        color: "white",
        fontSize: "20px",
        marginLeft: theme.spacing(20),
        "&:hover": {
            color: "yellow",
            borderBottom: "1px solid white",
        },
    },
}));




function Navbar() {

    const token_from_storage = sessionStorage.getItem("token")

    let navigate = useNavigate();

    const handleLogOut = () => {
        sessionStorage.removeItem("token")
        navigate('/login')
    }

    const handleLogIn = () => {
        navigate('/login')
    }

    const handlePlot=()=>{
        navigate('/getdetails')
    }
    const handleLogo=()=>{
        navigate('/')
    }

    const classes = useStyles();

    return (
        <AppBar position="static">
            <CssBaseline />
            <Toolbar>
                <Typography variant="h4" className={classes.logo} onClick={handleLogo}>
                    USDWheels
                </Typography>
                {
                    (token_from_storage && token_from_storage != "" && token_from_storage != undefined) ?
                    <div>
                        <Button variant="contained" onClick={handlePlot}>Plots</Button>
                        {" "}
                        <Button variant="contained" onClick={handleLogOut}>Logout</Button>
                        
                    </div>
                        :
                        <div></div>
                }
            </Toolbar>
        </AppBar>
    );
}
export default Navbar;

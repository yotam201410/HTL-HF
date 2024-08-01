import React, { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Badge,
    MenuItem,
    Menu,
    Button,
    Grid,
} from "@mui/material";
import {
    Search as SearchIcon,
    AccountCircle,
    ShoppingCart,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { changeLastLink, changeUser } from "../types/actions";
import { AppState } from "../store/rootReducer";

const Navbar: React.FC = () => {
    const [currentQuery, setCurrentQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const user = useSelector((state: AppState) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const cart = useSelector((state: AppState) => state.cart);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate({ pathname: "/products", search: `?search=${currentQuery}` });
    };

    const handleLogout = () => {
        dispatch(changeUser(null));
        navigate("/");
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" style={{ marginBottom: "15px" }}>
            <Toolbar>
                <Grid container alignItems="center">
                    <Grid item xs={3}>
                        <Typography
                            variant="h6"
                            noWrap
                            component={RouterLink}
                            to="/"
                            sx={{ color: "inherit", textDecoration: "none" }}
                        >
                            Home
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <form
                            onSubmit={handleSearch}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                style={{ position: "relative", marginRight: 2 }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search for product"
                                    inputProps={{ "aria-label": "search" }}
                                    value={currentQuery}
                                    onChange={(e) =>
                                        setCurrentQuery(e.target.value)
                                    }
                                    sx={{
                                        paddingLeft: `calc(1em + ${4}px)`,
                                        width: "100%",
                                    }}
                                />
                            </div>
                            <Button type="submit" color="inherit">
                                Search
                            </Button>
                        </form>
                    </Grid>
                    <Grid
                        item
                        xs={3}
                        container
                        justifyContent="flex-end"
                        alignItems="center"
                    >
                        <Button
                            component={RouterLink}
                            to="/cart"
                            sx={{ color: "inherit" }}
                        >
                            <Badge
                                badgeContent={Object.values(cart).reduce(
                                    (acc, { amount }) => acc + amount,
                                    0
                                )}
                                color="secondary"
                            >
                                <ShoppingCart />
                            </Badge>
                        </Button>
                        {user ? (
                            <>
                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem
                                        component={RouterLink}
                                        to="/orders"
                                        onClick={handleClose}
                                    >
                                        Orders
                                    </MenuItem>
                                    <MenuItem
                                        component={RouterLink}
                                        to="/addresses"
                                        onClick={handleClose}
                                    >
                                        Addresses
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleLogout();
                                            handleClose();
                                        }}
                                    >
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    onClick={() => {
                                        dispatch(
                                            changeLastLink(location.pathname)
                                        );
                                    }}
                                    sx={{ color: "inherit" }}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    sx={{ color: "inherit" }}
                                    onClick={() => {
                                        dispatch(
                                            changeLastLink(location.pathname)
                                        );
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

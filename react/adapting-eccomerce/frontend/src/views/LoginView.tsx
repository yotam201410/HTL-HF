import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { postLogin } from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { changeUser } from "../types/actions";
import { SHA512 } from "../utils/hashUtils";
import { useSelector } from "react-redux";
import { AppState } from "../store/rootReducer";

const LoginView = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lastLink = useSelector((state: AppState) => state.lastLink);
    const user = useSelector((state: AppState) => state.user);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);
    const handleLogin = () => {
        const login = async () => {
            const user = await postLogin(username, SHA512(password));
            if (user) {
                dispatch(changeUser(user.data));
                navigate(lastLink);
            }
        };

        login();
    };

    return (
        <Box
            component="form"
            onSubmit={(event) => {
                event.preventDefault();
                handleLogin();
            }}
            noValidate
            sx={{ mt: 1, width: "50%", margin: "auto" }}
        >
            <TextField
                value={username}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
                onChange={(event) => setUsername(event.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Sign In
            </Button>
            <Grid container>
                <Grid item>
                    <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoginView;

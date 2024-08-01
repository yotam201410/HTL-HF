import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../store/rootReducer";
import { postRegister } from "../utils/axiosInstance";
import { changeUser } from "../types/actions";
import { SHA512 } from "../utils/hashUtils";
const RegisterView: React.FC = () => {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lastLink = useSelector((state: AppState) => state.lastLink);
    const user = useSelector((state: AppState) => state.user);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);

    const handleRegister = (event: React.FormEvent) => {
        event.preventDefault();

        const register = async () => {
            const user = await postRegister({
                first_name,
                last_name,
                username,
                password: SHA512(password),
                email,
            });
            if (user) {
                dispatch(changeUser(user));
                navigate(lastLink);
            }
        };

        register();
    };

    return (
        <Box
            component="form"
            onSubmit={handleRegister}
            noValidate
            sx={{ mt: 1, width: "50%", margin: "auto" }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        value={first_name}
                        onChange={(event) => setFirstName(event.target.value)}
                        margin="normal"
                        required
                        fullWidth
                        id="first-name"
                        label="First Name"
                        name="first-name"
                        autoComplete="given-name"
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        value={last_name}
                        onChange={(event) => setLastName(event.target.value)}
                        margin="normal"
                        required
                        fullWidth
                        id="last-name"
                        label="Last Name"
                        name="last-name"
                        autoComplete="family-name"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        margin="normal"
                        required
                        fullWidth
                        type="email"
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Register
            </Button>
        </Box>
    );
};

export default RegisterView;

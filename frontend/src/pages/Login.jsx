import {
  Box,
  Container,
  CssBaseline,
  Paper,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
    Alert,
} from '@mui/material'
import styles from './login.module.css'
import { GoogleLogin } from "@react-oauth/google"
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";




const loginTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#22d3ee' },
    secondary: { main: '#daa0be' },
    background: { default: '#050918', paper: '#0f172a' },
    text: { primary: '#e2e8f0', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Manrope", "Segoe UI", sans-serif',
    fontWeightBold: 700,
  },
  shape: { borderRadius: 16 },
})

function Login() {
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:4000';
    const frontEndURL = import.meta.env.VITE_FRONTEND_URL
    const dashboardPath = frontEndURL ? `${frontEndURL}/dashboard` : '/dashboard'

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const handleGoogleLogin = useCallback(
        async (credentialsResponse) => {
            setError(null);
            setLoading(true);

            try {
                const credentials = credentialsResponse?.credential;
                if (!credentialsResponse) {
                    throw new Error("Missing credentials.");
                }

                const response = await fetch(`${apiBaseUrl}/auth/google`, {
                    method: "POST",
                    body: JSON.stringify({ credentials }),
                    headers: {'Content-Type': 'application/json'},
                })

                const body = await response.json().catch(() => {})

                if (!response.ok) {
                    throw new Error("Failed to authenticate credentials.")
                }

                localStorage.setItem('token', body.credentials)
                localStorage.setItem('user', JSON.stringify(body.userObj))
                localStorage.setItem('name', body.userObj.name)
                localStorage.setItem('email', body.userObj.email)
                localStorage.setItem('picture', body.userObj.picture)
                localStorage.setItem("expiresAt", body.userObj.expiresAt);


                navigate(dashboardPath)
            } catch (error) {
                setError(error.message || "Login Failed Please Try Again.")
                setLoading(false);
            }
        },
        [apiBaseUrl, dashboardPath, navigate]
    )

    const handleError = useCallback(() => {
        setError("Google authentication failed. Please try again.")
    }, [])
    if (loading) {
        return (
            <ThemeProvider theme={loginTheme}>
                <CssBaseline />
                <Box className={styles.screen}>
                    <Loading message="Signing you in..." fullHeight />
                </Box>
            </ThemeProvider>
        )
    }
    return (
        <ThemeProvider theme={loginTheme}>
            <CssBaseline />
            <Box className={styles.screen}>
                <div className={styles.blobOne} aria-hidden />
                <div className={styles.blobTwo} aria-hidden />

                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                    <Paper
                        elevation={12}
                        sx={{
                            p: { xs: 3, sm: 4 },
                            backgroundColor: 'rgba(15, 23, 42, 0.88)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(18px)',
                            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
                        }}
                    >
                        <Stack spacing={3.5}>
                            <Stack spacing={1}>
                                <Typography
                                    variant="overline"
                                    color="secondary.main"
                                    fontWeight={700}
                                    letterSpacing={1.5}
                                >
                                    Welcome to Spend Smart
                                </Typography>
                                <Typography variant="h4" fontWeight={700}>
                                    Sign in to your Google account
                                </Typography>
                            </Stack>
                            <GoogleLogin
                                onSuccess={handleGoogleLogin} onError={handleError}
                            />
                            {error && (
                                <Alert severity="error" variant="filled">
                                    {error}
                                </Alert>
                            )}
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    )
}

export default Login

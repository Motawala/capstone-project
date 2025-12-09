import GoogleIcon from '@mui/icons-material/Google'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import {
  Box,
  Container,
  CssBaseline,
  Paper,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import styles from './login.module.css'
import {GoogleLogin} from "@react-oauth/google"
import { jwtDecode } from "jwt-decode";


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
    const handleSubmit = (event) => {
        event.preventDefault()
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
                                {/*<Typography variant="body1" color="text.secondary">*/}
                                {/*    Use your username or email to access your Spend Smart.*/}
                                {/*</Typography>*/}
                            </Stack>
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    const token = credentialResponse.credential;

                                    // Decode the JWT Token
                                    const decoded = jwtDecode(token);
                                    // Save user info to localStorage
                                    localStorage.setItem("token", token);
                                    localStorage.setItem("user", decoded);
                                    localStorage.setItem("eamil", decoded.email);
                                    localStorage.setItem("name", decoded.name);
                                    localStorage.setItem("picture", decoded.picture);

                                    console.log("Decoded User:", decoded);

                                    // Redirect to dashboard
                                    window.location.href = "/dashboard";
                                }}
                                onError={() => {
                                    console.log("Login Failed");
                                }}
                            />
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    )
}

export default Login

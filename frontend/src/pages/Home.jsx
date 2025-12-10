import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    CssBaseline,
    Divider,
    ThemeProvider,
    Typography,
    createTheme,
    Stack,
} from '@mui/material'
import InsightsIcon from '@mui/icons-material/Insights'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import PieChartIcon from '@mui/icons-material/PieChart'
import styles from './home.module.css'
import { useNavigate } from "react-router-dom";
import mainlogo from "../assets/mainlogo.png";


const homeTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#22d3ee' },
        secondary: { main: '#f472b6' },
        background: { default: '#050918', paper: '#0f172a' },
        text: { primary: '#e2e8f0', secondary: '#94a3b8' },
    },
    typography: {
        fontFamily: '"Space Grotesk", "Manrope", "Segoe UI", sans-serif',
        fontWeightBold: 700,
    },
    shape: { borderRadius: 16 },
})

function Home() {
    const navigate = useNavigate();

    return (
        <ThemeProvider theme={homeTheme}>
            <CssBaseline />
            <Box className={styles.screen}>
                <div className={styles.blobOne} aria-hidden />
                <div className={styles.blobTwo} aria-hidden />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, mt: 6 }}>
                    {/* TWO COLUMN LAYOUT */}
                    <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="stretch">

                        {/* LEFT BOX — WELCOME CONTENT */}
                        <Card
                            elevation={12}
                            sx={{
                                flex: 1,
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(18px)',
                                boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                                <Typography
                                    variant="overline"
                                    color="secondary.main"
                                    fontWeight={700}
                                    letterSpacing={1.5}
                                >
                                    SMART EXPENSE TRACKER
                                </Typography>

                                <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
                                    Welcome to Spend Smart
                                </Typography>

                                <Typography variant="body1" color="text.secondary">
                                    Easily track your expenses, manage budgets, and stay financially organized.
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Record daily expenses, categorize your spending, and view insights to help you stay on top of finances.
                                </Typography>

                                {/* Feature Icons */}
                                <Box sx={{ mt: 4 }}>
                                    <Stack
                                        direction="row"
                                        spacing={3}
                                        justifyContent="center"
                                        flexWrap="wrap"
                                    >
                                        <Box sx={{ textAlign: "center", maxWidth: 160 }}>
                                            <InsightsIcon sx={{ fontSize: 36, color: "#22d3ee" }} />
                                            <Typography variant="subtitle1" fontWeight={600} mt={1}>
                                                Track Expenses
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Log daily purchases easily.
                                            </Typography>
                                        </Box>

                                        <Box sx={{ textAlign: "center", maxWidth: 160 }}>
                                            <AccountBalanceWalletIcon sx={{ fontSize: 36, color: "#22d3ee" }} />
                                            <Typography variant="subtitle1" fontWeight={600} mt={1}>
                                                Smart Budgets
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Stay in control of spending.
                                            </Typography>
                                        </Box>

                                        <Box sx={{ textAlign: "center", maxWidth: 160 }}>
                                            <PieChartIcon sx={{ fontSize: 36, color: "#22d3ee" }} />
                                            <Typography variant="subtitle1" fontWeight={600} mt={1}>
                                                Visual Insights
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Understand habits instantly.
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    onClick={() => navigate("/login")}
                                >
                                    LOGIN
                                </Button>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block", textAlign: "center", mt: 3 }}
                                >
                                    Start managing your finances the smart way.
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* RIGHT BOX — IMAGE CARD */}
                        <Card
                            elevation={12}
                            sx={{
                                flex: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(18px)',
                                boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
                                overflow: "hidden",
                            }}
                        >
                            <img
                                src={ mainlogo }
                                alt="App Preview"
                                style={{
                                  width: "50%",
                                            height: "50%",
                                            objectFit: "cover",
                                            borderRadius: "16px",
                            }}
                            />
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </ThemeProvider>
    )
}

export default Home

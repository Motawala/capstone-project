import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import './App.css'
import ProtectedRoute from "./auth/ProtectedRoute.jsx"

function App() {
    return (
        <Router>
            <Routes>
                {/* Home Page */}
                <Route path="/" element={<Home />} />

                {/* Login Page */}
                <Route path="/login" element={<Login />} />

                {/* Dashboard Page */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                {/* Optional: 404 Page */}
                <Route path="*" element={<h2>404: Page Not Found</h2>} />
            </Routes>
        </Router>
    )
}

export default App

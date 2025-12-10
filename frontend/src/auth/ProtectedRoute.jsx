import { Navigate, useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");
    const navigate = useNavigate();

    const now = Math.floor(Date.now() / 1000);
    // Token expired → logout
    if (now > Number(expiresAt)) {
        localStorage.clear();
        return  <Navigate to="/login" replace />;
    }

    // If no token → redirect to Login Page.
    if (!token || !expiresAt) {
        navigate("/login")
        return <Navigate to="/login" replace />;
    }

    return children;
}

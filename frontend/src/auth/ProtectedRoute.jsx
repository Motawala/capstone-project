import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");


    const now = Math.floor(Date.now() / 1000);

    // Token expired → logout
    if (now > Number(expiresAt)) {
        localStorage.clear();
        return false;
    }

    console.log(expiresAt);
    // If no token → redirect to Login Page.
    if (!token || !expiresAt) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

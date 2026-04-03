import { Navigate } from 'react-router-dom';
import { getUserSession } from '../utils/storage';

export default function ProtectedRoute({ children }) {
    const user = getUserSession();

    if (!user) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // Logged in, allow access to the component
    return children;
}

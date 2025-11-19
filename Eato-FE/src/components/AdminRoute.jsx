import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (!user.isAdmin) return <Navigate to="/" replace />; // or show "Not authorized"

  return children;
}

export default AdminRoute;
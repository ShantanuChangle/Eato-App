import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DeliveryRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isDeliveryPerson) return <Navigate to="/" replace />;

  return children;
}

export default DeliveryRoute;
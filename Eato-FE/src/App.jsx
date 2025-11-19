import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminAddRestaurant from './pages/AdminAddRestaurant';
import AdminAddMenuItem from './pages/AdminAddMenuItem';

function App() {
  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
              path="/admin/restaurants/new"
              element={
                <AdminRoute>
                  <AdminAddRestaurant />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/menu/new"
              element={
                <AdminRoute>
                  <AdminAddMenuItem />
                </AdminRoute>
              }
            />

          
          {/* Protected routes */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
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
import Footer from './components/Footer';
import About from './pages/About';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Investors from './pages/Investors';
import ReportFraud from './pages/ReportFraud';
import Press from './pages/Press';
import Contact from './pages/Contact';
import Blinkit from './pages/Blinkit';
import District from './pages/District';
import Partner from './pages/Partner';
import Apps from './pages/Apps';
import Privacy from './pages/Privacy';
import Security from './pages/Security';
import Terms from './pages/Terms';
import DeliveryOrders from './pages/DeliveryOrders';
import DeliveryRoute from './components/DeliveryRoute';

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
            <Route
              path="/delivery/orders"
              element={
                <DeliveryRoute>
                  <DeliveryOrders />
                </DeliveryRoute>
              }
            />

            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/report-fraud" element={<ReportFraud />} />
            <Route path="/press" element={<Press />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blinkit" element={<Blinkit />} />
            <Route path="/district" element={<District />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/security" element={<Security />} />
            <Route path="/terms" element={<Terms />} />

          
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
      <Footer/>
    </div>
  );
}

export default App;
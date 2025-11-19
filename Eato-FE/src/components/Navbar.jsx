import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1rem',
        borderBottom: '1px solid #111',
        marginBottom: '1rem',
        backgroundColor:'grey',
        position:'sticky',
        top:'1rem',
        borderRadius:'10px'
      }}
    >
      <div>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', padding:'10px', borderRadius:'50%', color:'black', border:'solid', backgroundColor:'orange', borderColor:'white' }}>
          Eato
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ color:'white', textDecoration:'none', fontFamily:'sans-serif' }}>Home</Link>
        {user && <Link to="/orders" style={{ color:'white', textDecoration:'none' }}>My Orders</Link>}
        {user?.isAdmin && <Link to="/admin/restaurants/new" style={{ color:'white', textDecoration:'none' }}>Add Restaurants</Link>}
        {user?.isAdmin && <Link to="/admin/menu/new" style={{ color:'white', textDecoration:'none' }}>Add Menu Items</Link>}
        {!user && <Link to="/login" style={{ color:'white', textDecoration:'none' }}>Login</Link>}
        {!user && <Link to="/register" style={{ color:'white', textDecoration:'none' }}>Register</Link>}
        {user && (
          <>
            <span style={{ fontSize: '0.9rem', color:'white' }}>Hi, {user.name}</span>
            <button style={{borderRadius:'45%', padding:'10px', backgroundColor:'orange', bordercol:'white'}} onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

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
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #ddd',
        marginBottom: '1rem',
        backgroundColor:'black',
        position:'sticky'
      }}
    >
      <div>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', padding:'10px', borderRadius:'50%', color:'black', border:'solid', backgroundColor:'orange', borderColor:'white' }}>
          Eato
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/" style={{ color:'white', textDecoration:'none' }}>Home</Link>
        {user && <Link to="/orders" style={{ color:'white', textDecoration:'none' }}>My Orders</Link>}
        {!user && <Link to="/login" style={{ color:'white', textDecoration:'none' }}>Login</Link>}
        {!user && <Link to="/register" style={{ color:'white', textDecoration:'none' }}>Register</Link>}
        {user && (
          <>
            <span style={{ fontSize: '0.9rem', color:'white' }}>Hi, {user.name}</span>
            <button style={{borderRadius:'45%', padding:'10px', backgroundColor:'white'}} onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

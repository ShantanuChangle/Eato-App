import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { request } = useApi();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await request({
        url: '/api/auth/register',
        method: 'POST',
        data: form,
      });

      // backend returns { _id, name, email, token }
      const userData = { _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin };
      login(userData, data.token);

      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed';
      setError(msg);
    }
  };

  return (
    <div style={{position:'absolute', backgroundColor:'black', left:'33vw', top:'35vh', display:'grid', justifyItems:'center', border:'solid', paddingBottom:'8vh', width:'35vw', height:'23vh', borderRadius:'10px'}}>
      <h2 style={{color:'white'}}>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem',width:'80vw', maxWidth: '300px' }}>
        <input
          style={{padding:'0.5vh'}}
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          style={{padding:'0.5vh'}}
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          style={{padding:'0.5vh'}}
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{backgroundColor:'orange', padding:'0.7vh', fontWeight:'800',cursor:'pointer', borderRadius:'10px'}}>Create Account</button>
      </form>
    </div>
  );
}

export default Register;
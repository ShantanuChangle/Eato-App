import { useState } from 'react';
import { useApi } from '../api/apiClient';

function AdminAddRestaurant() {
  const { request } = useApi();
  const [form, setForm] = useState({ name: '', address: '', cuisine: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const data = await request({
        url: '/api/restaurants',
        method: 'POST',
        data: form,
      });
      setMessage(`Restaurant "${data.name}" created successfully`);
      setForm({ name: '', address: '', cuisine: '' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to create restaurant';
      setError(msg);
    }
  };

  return (
    <div style={{position:'absolute', backgroundColor:'black', left:'33vw', top:'35vh', display:'grid', justifyItems:'center', border:'solid', paddingBottom:'5vh', width:'35vw', height:'31vh', borderRadius:'10px'}}>
      <h2>Add Restaurant (Admin)</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width:'80vw', maxWidth: '300px' }}
        onSubmit={handleSubmit}
      >
        <input
         style={{padding:'0.5vh'}}
          type="text"
          name="name"
          placeholder="Restaurant name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          style={{padding:'0.5vh'}}
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <input
          style={{padding:'0.5vh'}}
          type="text"
          name="cuisine"
          placeholder="Cuisine (e.g. Indian, Italian)"
          value={form.cuisine}
          onChange={handleChange}
        />
        <button type="submit" style={{backgroundColor:'orange', padding:'0.7vh', fontWeight:'800',cursor:'pointer', borderRadius:'10px', fontSize:'15px'}}>Create</button>
      </form>
    </div>
  );
}

export default AdminAddRestaurant;

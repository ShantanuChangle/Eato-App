import { useEffect, useState } from 'react';
import { useApi } from '../api/apiClient';

function AdminAddMenuItem() {
  const { request } = useApi();

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    isVeg: false,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await request({
          url: '/api/restaurants',
          method: 'GET',
        });
        setRestaurants(data);
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to load restaurants';
        setError(msg);
      } finally {
        setLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, [request]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedRestaurant) {
      setError('Please select a restaurant');
      return;
    }

    try {
      const body = {
        restaurant: selectedRestaurant,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        isVeg: form.isVeg,
      };

      const data = await request({
        url: '/api/menu',
        method: 'POST',
        data: body,
      });

      setMessage(`Menu item "${data.name}" added successfully`);
      setForm({ name: '', description: '', price: '', isVeg: false });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to add menu item';
      setError(msg);
    }
  };

  return (
    <div style={{position:'absolute', backgroundColor:'black', left:'33vw', top:'35vh', display:'grid', justifyItems:'center', border:'solid', paddingBottom:'9vh', width:'35vw', height:'31vh', borderRadius:'10px'}} >
      <h2>Add Menu Item (Admin)</h2>

      {loadingRestaurants && <p>Loading restaurants...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {!loadingRestaurants && restaurants.length === 0 && (
        <p>No restaurants found. Create a restaurant first.</p>
      )}

      {restaurants.length > 0 && (
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width:'80vw', maxWidth: '300px' }}
          onSubmit={handleSubmit}
        >
          <select
            style={{padding:'0.5vh'}}
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            required
          >
            <option value="">Select restaurant</option>
            {restaurants.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name} - {r.cuisine}
              </option>
            ))}
          </select>

          <input
            style={{padding:'0.5vh'}}
            type="text"
            name="name"
            placeholder="Menu item name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            style={{padding:'0.5vh'}}
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            style={{padding:'0.5vh'}}
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            required
          />
          <label>
            <input
              type="checkbox"
              name="isVeg"
              checked={form.isVeg}
              onChange={handleChange}
            />
            Veg
          </label>

          <button type="submit" style={{backgroundColor:'orange', padding:'0.7vh', fontWeight:'800',cursor:'pointer', borderRadius:'10px', fontSize:'15px'}}>Add Menu Item</button>
        </form>
      )}
    </div>
  );
}

export default AdminAddMenuItem;
import { useEffect, useState } from 'react';
import { useApi } from '../api/apiClient';
import RestaurantCard from '../components/RestaurantCard';

function Home() {
  const { request } = useApi();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [request]);

  if (loading) return <p>Loading restaurants...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (restaurants.length === 0) {
    return <p>No restaurants yet. Add some via backend / seed script.</p>;
  }

  return (
    <div>
      <h2>Restaurants</h2>
      {restaurants.map((r) => (
        <RestaurantCard key={r._id} restaurant={r} />
      ))}
    </div>
  );
}

export default Home;

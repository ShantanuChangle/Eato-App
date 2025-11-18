import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../api/apiClient';
import MenuItemCard from '../components/MenuItemCard';
import { useAuth } from '../context/AuthContext';

function RestaurantDetails() {
  const { id } = useParams(); // restaurant id
  const { request } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderMessage, setOrderMessage] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await request({
          url: `/api/restaurants/${id}`,
          method: 'GET',
        });
        setRestaurant(data.restaurant);
        setMenu(data.menu);
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to load restaurant';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, request]);

  const handleOrder = async (item) => {
    setOrderMessage('');

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const body = {
        restaurant: restaurant._id,
        items: [
          {
            menuItem: item._id,
            qty: 1,
          },
        ],
      };

      await request({
        url: '/api/orders',
        method: 'POST',
        data: body,
      });

      setOrderMessage('Order placed successfully ✔');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to place order';
      setOrderMessage(msg);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!restaurant) return <p>Restaurant not found</p>;

  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>{restaurant.address}</p>
      <p>Cuisine: {restaurant.cuisine}</p>

      <h3>Menu</h3>
      {menu.length === 0 && <p>No menu items yet.</p>}

      {orderMessage && <p>{orderMessage}</p>}

      {menu.map((item) => (
        <MenuItemCard key={item._id} item={item} onOrder={handleOrder} />
      ))}
    </div>
  );
}

export default RestaurantDetails;
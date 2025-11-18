import { Link } from 'react-router-dom';

function RestaurantCard({ restaurant }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.5rem' }}>
      <h3>{restaurant.name}</h3>
      <p>{restaurant.address}</p>
      <p>Cuisine: {restaurant.cuisine}</p>
      <Link to={`/restaurant/${restaurant._id}`}>View Menu</Link>
    </div>
  );
}

export default RestaurantCard;
import { Link } from 'react-router-dom';

function RestaurantCard({ restaurant }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '1rem', marginBottom: '0.8rem' }}>
      <h3>{restaurant.name}</h3>
      <p>{restaurant.address}</p>
      <p>Cuisine: {restaurant.cuisine}</p>
      <Link to={`/restaurant/${restaurant._id}`} style={{color:'black', textDecoration:'none', border:'1px solid black', backgroundColor:'orange', padding:'0.5rem', borderRadius:'10px', fontSize:'0.8rem'}}>View Menu</Link>
    </div>
  );
}

export default RestaurantCard;
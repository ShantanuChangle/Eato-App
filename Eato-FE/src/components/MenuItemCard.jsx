function MenuItemCard({ item, onOrder }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: '6px', padding: '0.5rem', marginBottom: '0.5rem' }}>
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <p>Price: ₹{item.price}</p>
      <p>{item.isVeg ? 'Veg' : 'Non-veg'}</p>
      <button onClick={() => onOrder(item)}>Order 1</button>
    </div>
  );
}

export default MenuItemCard;
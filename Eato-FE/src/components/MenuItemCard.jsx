function MenuItemCard({ item, onOrder }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: '6px',padding:'1rem', paddingLeft: '1.5rem', marginBottom: '0.5rem', position:'relative' }}>
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <p>Price: ₹{item.price}</p>
      <p>{item.isVeg ? 'Veg' : 'Non-veg'}</p>
      <button onClick={() => onOrder(item)} style={{backgroundColor:'orange', padding:'0.5rem', borderRadius:'10px',position:'absolute', right:'1rem', bottom:'1rem'}}>Order</button>
    </div>
  );
}

export default MenuItemCard;
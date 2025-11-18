import { useEffect, useState } from 'react';
import { useApi } from '../api/apiClient';

function Orders() {
  const { request } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await request({
          url: '/api/orders/myorders',
          method: 'GET',
        });
        setOrders(data);
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to load orders';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [request]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (orders.length === 0) {
    return <p>No orders yet.</p>;
  }

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <p><strong>Restaurant:</strong> {order.restaurant?.name}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.totalPrice}</p>
          <p><strong>Items:</strong></p>
          <ul>
            {order.items.map((it) => (
              <li key={it._id}>
                {it.menuItem?.name} x {it.qty} (₹{it.price})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Orders;
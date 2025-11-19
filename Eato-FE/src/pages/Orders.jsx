import { useEffect, useState } from 'react';
import { useApi } from '../api/apiClient';

function Orders() {
  const { request } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null); // track which order is being deleted

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

  // ✅ new function: delete an order
  const handleDeleteOrder = async (orderId) => {
    setActionMessage('');
    setError('');
    setDeletingId(orderId);

    try {
      await request({
        url: `/api/orders/${orderId}`,
        method: 'DELETE',
      });

      // remove from UI state
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      setActionMessage('Order removed successfully');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to remove order';
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (orders.length === 0) {
    return <p>No orders yet.</p>;
  }

  return (
    <div>
      <h2>My Orders</h2>
      {actionMessage && <p style={{ color: 'green' }}>{actionMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '0.75rem',
            marginBottom: '0.75rem',
            position:'relative'
          }}
        >
          <p>
            <strong>Restaurant:</strong> {order.restaurant?.name}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total:</strong> ₹{order.totalPrice}
          </p>
          <p>
            <strong>Items:</strong>
          </p>
          <ul>
            {order.items.map((it) => (
              <li key={it._id}>
                {it.menuItem?.name} x {it.qty} (₹{it.price})
              </li>
            ))}
          </ul>

          <button
            style={{backgroundColor:'orange', borderRadius:'15px', padding:'0.5rem', position:'absolute', right:'1rem', bottom:'1rem'}}
            onClick={() => handleDeleteOrder(order._id)}
            disabled={deletingId === order._id}
          >
            {deletingId === order._id ? 'Removing...' : 'Remove Order'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Orders;
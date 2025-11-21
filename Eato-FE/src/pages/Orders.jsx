import { useEffect, useState } from 'react';
import { useApi } from '../api/apiClient';

function Orders() {
  const { request } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // OTP confirmation state
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [otpInput, setOtpInput] = useState('');

  // 1) Load user's orders
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

  // 2) Delete an order
  const handleDeleteOrder = async (orderId) => {
    setActionMessage('');
    setError('');
    setConfirmingOrderId(null);
    setOtpInput('');
    setDeletingId(orderId);

    try {
      await request({
        url: `/api/orders/${orderId}`,
        method: 'DELETE',
      });

      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      setActionMessage('Order removed successfully');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to remove order';
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // 3) Start OTP confirmation for a specific order
  const handleStartConfirmDelivery = (orderId) => {
    setError('');
    setActionMessage('');
    setConfirmingOrderId(orderId);
    setOtpInput('');
  };

  // 4) Submit OTP to backend
  const handleSubmitOtp = async (orderId) => {
    if (!otpInput.trim()) {
      setError('Please enter OTP');
      return;
    }

    setError('');
    setActionMessage('');

    try {
      const updatedOrder = await request({
        url: `/api/orders/${orderId}/confirm-delivery`,
        method: 'POST',
        data: { otp: otpInput.trim() },
      });

      // update single order in local state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updatedOrder : o))
      );

      setActionMessage('Delivery confirmed successfully');
      setConfirmingOrderId(null);
      setOtpInput('');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to confirm delivery';
      setError(msg);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error && !orders.length) return <p style={{ color: 'red' }}>{error}</p>;

  if (orders.length === 0) {
    return <p>No orders yet.</p>;
  }

  // 5) Total amount of all orders
  const totalAmount = orders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  // display status helper
  const getDisplayStatus = (order) => {
    if (order.isDeliveredConfirmed || order.status === 'delivered') {
      return 'Delivered';
    }
    return order.status;
  };

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
          }}
        >
          <p>
            <strong>Restaurant:</strong> {order.restaurant?.name}
          </p>
          <p>
            <strong>Status:</strong> {getDisplayStatus(order)}
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

          {/* Remove order button */}
          <button
            style={{backgroundColor:'orange', borderColor:'orange', borderRadius:'20px', cursor:'pointer', fontWeight:'500'}}
            onClick={() => handleDeleteOrder(order._id)}
            disabled={deletingId === order._id}
          >
            {deletingId === order._id ? 'Removing...' : 'Cancel Order'}
          </button>

          {/* OTP confirmation section for undelivered orders */}
          {!order.isDeliveredConfirmed && order.status !== 'delivered' && (
            <div style={{ marginTop: '0.5rem' }}>
              {confirmingOrderId === order._id ? (
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    marginTop: '0.25rem',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Enter OTP from email"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                  />
                  <button style={{backgroundColor:'orange', borderColor:'orange', borderRadius:'20px', cursor:'pointer', fontWeight:'500'}} onClick={() => handleSubmitOtp(order._id)}>
                    Submit OTP
                  </button>
                </div>
              ) : (
                <button style={{backgroundColor:'orange', borderColor:'orange', borderRadius:'20px', cursor:'pointer', fontWeight:'500'}} onClick={() => handleStartConfirmDelivery(order._id)}>
                  Confirm Delivery (Enter OTP)
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Total sum section */}
      <div
        style={{
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <strong>Total price of all orders:</strong> ₹{totalAmount}
        </div>
      </div>
    </div>
  );
}

export default Orders;
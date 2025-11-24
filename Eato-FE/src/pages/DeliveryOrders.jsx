import { useEffect, useState } from 'react';
import { useApi } from '../api/apiClient';

function DeliveryOrders() {
  const { request } = useApi();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const [available, mine] = await Promise.all([
        request({ url: '/api/orders/delivery/available', method: 'GET' }),
        request({ url: '/api/orders/delivery/my', method: 'GET' }),
      ]);
      setAvailableOrders(available);
      setMyOrders(mine);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load delivery orders';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [request]);

  const handleAcceptOrder = async (orderId) => {
    setError('');
    setMessage('');

    try {
      await request({
        url: `/api/orders/${orderId}/accept`,
        method: 'POST',
      });
      setMessage('Order accepted');
      await fetchAll();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to accept order';
      setError(msg);
    }
  };

  const handleStartConfirm = (orderId) => {
    setConfirmingOrderId(orderId);
    setOtpInput('');
  };

  const handleSubmitOtp = async (orderId) => {
    if (!otpInput.trim()) {
      setError('Please enter OTP');
      return;
    }
    setError('');
    setMessage('');

    try {
      await request({
        url: `/api/orders/${orderId}/confirm-delivery`,
        method: 'POST',
        data: { otp: otpInput.trim() },
      });

      setMessage('Delivery confirmed');
      setConfirmingOrderId(null);
      setOtpInput('');
      await fetchAll();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to confirm delivery';
      setError(msg);
    }
  };

  if (loading) return <p>Loading delivery orders...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Delivery Dashboard</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Available Orders</h3>
        {availableOrders.length === 0 && <p>No available orders.</p>}
        {availableOrders.map((order) => (
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
            <p><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</p>
            <p><strong>Total:</strong> ₹{order.totalPrice}</p>
            <button 
            style={{backgroundColor:'orange', borderRadius:'20px', padding:'8px', cursor:'pointer'}}
            onClick={() => handleAcceptOrder(order._id)}>
              Accept Order
            </button>
          </div>
        ))}
      </section>

      <section>
        <h3>My Active / Delivered Orders</h3>
        {myOrders.length === 0 && <p>No assigned orders yet.</p>}
        {myOrders.map((order) => (
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
            <p><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</p>
            <p><strong>Status:</strong> {order.isDeliveredConfirmed || order.status === 'delivered' ? 'Delivered' : order.status}</p>
            <p><strong>Total:</strong> ₹{order.totalPrice}</p>

            {/* OTP confirm only if not delivered */}
            {!order.isDeliveredConfirmed && order.status !== 'delivered' && (
              <div style={{ marginTop: '0.5rem' }}>
                {confirmingOrderId === order._id ? (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                    />
                    <button 
                    style={{backgroundColor:'orange', borderRadius:'20px', padding:'8px', cursor:'pointer'}}
                    onClick={() => handleSubmitOtp(order._id)}>
                      Submit OTP
                    </button>
                  </div>
                ) : (
                  <button 
                  style={{backgroundColor:'orange', borderRadius:'20px', padding:'8px', cursor:'pointer'}}
                  onClick={() => handleStartConfirm(order._id)}>
                    Confirm Delivery (Enter OTP)
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default DeliveryOrders;
import { useEffect, useState } from 'react';
import { useApi } from '../api/apiClient';

function Orders() {
  const { request } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [reviewingOrderId, setReviewingOrderId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // OTP confirmation state
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [otpInput, setOtpInput] = useState('');

  // 1) Load user's orders on mount
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

  // 2) Delete / cancel an order (only allowed for non-delivered)
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

  // start writing review for an order
const handleStartReview = (orderId) => {
  setError('');
  setActionMessage('');
  setReviewingOrderId(orderId);
  setReviewRating(5);
  setReviewComment('');
};

// submit review
const handleSubmitReview = async (order) => {
  if (!reviewRating) {
    setError('Please select a rating');
    return;
  }

  try {
    setError('');
    setActionMessage('');

    await request({
      url: '/api/reviews',
      method: 'POST',
      data: {
        restaurantId: order.restaurant._id,
        orderId: order._id,
        rating: reviewRating,
        comment: reviewComment,
      },
    });

    setActionMessage('Thank you! Your review has been submitted.');
    setReviewingOrderId(null);
    setReviewRating(5);
    setReviewComment('');
  } catch (err) {
    const msg = err?.response?.data?.message || 'Failed to submit review';
    setError(msg);
  }
};


  // 3) Start OTP confirmation UI for a specific order
  const handleStartConfirmDelivery = (orderId) => {
    setError('');
    setActionMessage('');
    setConfirmingOrderId(orderId);
    setOtpInput('');
  };

  // 4) Submit OTP to backend and then refetch fresh orders
  const handleSubmitOtp = async (orderId) => {
    if (!otpInput.trim()) {
      setError('Please enter OTP');
      return;
    }

    setError('');
    setActionMessage('');

    try {
      // Confirm delivery on backend
      await request({
        url: `/api/orders/${orderId}/confirm-delivery`,
        method: 'POST',
        data: { otp: otpInput.trim() },
      });

      // Refetch all orders so we have updated status and populated fields
      const freshOrders = await request({
        url: '/api/orders/myorders',
        method: 'GET',
      });

      setOrders(freshOrders);
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

  // 5) Total amount of ACTIVE (non-delivered) orders
  // const totalAmount = orders
  //   .filter((order) => !order.isDeliveredConfirmed && order.status !== 'delivered')
  //   .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const totalAmount = orders
  .filter((order) => order.status === 'placed')
  .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  // Helper: display status text
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

          {order.isDeliveredConfirmed || order.status === 'delivered' ? (
            <div style={{ marginTop: '0.5rem' }}>
              {reviewingOrderId === order._id ? (
                <div
                  style={{
                    borderTop: '1px solid #ddd',
                    marginTop: '0.5rem',
                    paddingTop: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <label>
                      Rating:{' '}
                      <select
                        style={{backgroundColor:'orange', padding:'2px', borderRadius:'20px'}}
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Good</option>
                        <option value={3}>3 - Average</option>
                        <option value={2}>2 - Poor</option>
                        <option value={1}>1 - Terrible</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <textarea
                      rows={3}
                      placeholder="Write your experience"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      style={{ width: '100%', backgroundColor:'#eee5e51d', color:'white' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                    style={{backgroundColor:'orange', padding:'5px', borderRadius:'20px'}}
                    onClick={() => handleSubmitReview(order)}>
                      Submit Review
                    </button>
                    <button 
                    style={{backgroundColor:'orange', padding:'5px 10px', borderRadius:'20px'}}
                    onClick={() => setReviewingOrderId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                style={{backgroundColor:'orange', padding:'5px 10px', borderRadius:'20px'}}
                onClick={() => handleStartReview(order._id)}>
                  Write Review
                </button>
              )}
            </div>
          ) : null}


          {/* Cancel/Remove only if NOT delivered */}
          {/* {!order.isDeliveredConfirmed && order.status !== 'delivered' && (
            <button
              style={{backgroundColor:'orange', borderColor:'orange', borderRadius:'20px', fontWeight:'400'}}
              onClick={() => handleDeleteOrder(order._id)}
              disabled={deletingId === order._id}
            >
              {deletingId === order._id ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )} */}

          {order.status === 'placed' && !order.isDeliveredConfirmed && (
            <button
              style={{backgroundColor:'orange', borderColor:'orange', borderRadius:'20px', fontWeight:'400'}}
              onClick={() => handleDeleteOrder(order._id)}
              disabled={deletingId === order._id}
            >
              {deletingId === order._id ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      ))}

      {/* Bottom summary: only active orders counted */}
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
          <strong>Total price of active orders:</strong> ₹{totalAmount}
        </div>
      </div>
    </div>
  );
}

export default Orders;
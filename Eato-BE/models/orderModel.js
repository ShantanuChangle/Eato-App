const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        qty: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['placed', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
      default: 'placed',
    },

    deliveryOtp: { type: String },
    deliveryOtpExpiresAt: { type: Date },
    isDeliveredConfirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Order', orderSchema);

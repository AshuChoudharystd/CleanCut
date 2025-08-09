import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orders: {
    type: Object,
    default: {},
    required: true,
  },
});

const orderModel = mongoose.models['order'] || mongoose.model('order', orderSchema);

export default orderModel;

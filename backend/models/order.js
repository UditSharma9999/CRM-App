import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  orderDate: Date,
  amount: Number,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;

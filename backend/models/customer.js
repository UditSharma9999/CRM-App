import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  phone: {
    type: Number,
    require: true,
    trim: true,
  },
  totalSpends: Number,
  maxVisits: Number,
  lastVisit: Date,
}, { timeStamps: true });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
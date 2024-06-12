import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  audience: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sent: {
    type: Number,
    default: 0,
  },
  failed: {
    type: Number,
    default: 0,
  },
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;

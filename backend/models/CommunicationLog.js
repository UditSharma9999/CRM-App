import mongoose from "mongoose";
const communicationLogSchema = new mongoose.Schema({
    audienceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Campaign',
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer',
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['SENT', 'FAILED'],
        default: 'SENT',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const CommunicationLog = mongoose.model('CommunicationLog', communicationLogSchema);
export default CommunicationLog;


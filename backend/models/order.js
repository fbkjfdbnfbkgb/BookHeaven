import mongoose from 'mongoose';

const order = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }],
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    },
}, {
    timestamps: true,
});
const Order = mongoose.models.Order || mongoose.model('Order', order);
export default Order;

import 'dotenv/config';
import mongoose from 'mongoose';

const  conn = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return;
        }
        await mongoose.connect(process.env.MONGO_URI, {
            
            
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}
conn();
export default conn;
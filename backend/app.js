import express from 'express';
import conn from './conn/conn.js';
import user from './routes/user.js';
import books from './routes/book.js';
import favourite from './routes/favourite.js';
import cart from './routes/cart.js';
import orderRouter from "./routes/order.js";
import cors from 'cors';
const app = express();

conn();

const PORT= process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
//routes
app.use("/api/v1",user);
app.use("/api/v1",books);
app.use("/api/v1",favourite);
app.use("/api/v1",cart);
app.use("/api/v1", orderRouter);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

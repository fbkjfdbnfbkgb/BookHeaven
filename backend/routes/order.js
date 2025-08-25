import { Router } from "express";
const router = Router();

import User from "../models/user.js";
import Book from "../models/book.js";
import Order from "../models/order.js";
import AuthenticateToken from "./userAuth.js";

// Create Order
router.post("/create-order", AuthenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { books } = req.body;

    if (!books || !Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: "Order data is missing or empty." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newOrder = new Order({
      user: id,
      books: books.map((book) => book._id),
    });

    const savedOrder = await newOrder.save();

    await User.findByIdAndUpdate(
      id,
      { $addToSet: { orders: savedOrder._id } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      id,
      { $pull: { cart: { $in: books.map((book) => book._id) } } },
      { new: true }
    );

    const updatedUser = await User.findById(id).populate("cart");

    return res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
      cart: updatedUser.cart,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Orders for Logged-in User
router.get("/get-orders", AuthenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "books" },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      status: "success",
      orders: userData.orders.reverse(),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Order History for Logged-in User (alias for /get-orders)
router.get("/get-order-history", AuthenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "books" },
        });
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            status: "success",
            orders: userData.orders.reverse(),
        });
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get All Orders (Admin Only)
router.get("/get-all-orders", AuthenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const orders = await Order.find()
      .populate("books")
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Order Status (Admin Only)
router.put("/update-status/:orderId", AuthenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const adminUser = await User.findById(id);

    if (adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { orderId } = req.params;
    await Order.findByIdAndUpdate(orderId, {
      status: req.body.status,
    });

    return res.json({
      status: "success",
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

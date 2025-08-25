import { Router } from 'express';
const router = Router();
import User from '../models/user.js';
import AuthenticateToken from './userAuth.js';
  

router.put('/add-to-cart', AuthenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const {bookId} = req.body; // <-- Fix: get bookId from body
        const user = await User.findById(id);
        const isBookInCart = user.cart.includes(bookId);
        if (isBookInCart) {
            return res.status(400).json({ message: 'Book already in cart' });
        }
        await User.findByIdAndUpdate(id, { $push: { cart: bookId } }, { new: true });
        res.status(200).json({ message: 'Book added to cart' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

router.put('/remove-from-cart/:bookId', AuthenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const {bookId} = req.params;
        const user = await User.findById(id);
        const isBookInCart = user.cart.includes(bookId);
        if (!isBookInCart) {
            return res.status(400).json({ message: 'Book not in cart' });
        }
        await User.findByIdAndUpdate(id, { $pull: { cart: bookId } }, { new: true });
        res.status(200).json({ message: 'Book removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
});

router.get('/get-cart', AuthenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate('cart');
        if (!userData) {
            return res.status(404).json([]); // Always return an array
        }
        // Defensive: always return an array
        const cartArray = Array.isArray(userData.cart) ? userData.cart.slice().reverse() : [];
        res.status(200).json(cartArray);
    }   
    catch (error) {   
        console.error('Error fetching cart:', error);
        res.status(500).json([]); // Always return an array on error
    }   
});

export default router;
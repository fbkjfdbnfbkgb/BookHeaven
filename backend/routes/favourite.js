import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.js';
import AuthenticateToken from './userAuth.js'; // Assuming this is your middleware

const router = Router();

// Add Book to Favourites
router.put('/add-book-to-favourite', AuthenticateToken, async (req, res) => {
    try {
        const userId = req.headers.id; // must be present
        const { bookId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        if (!bookId) {
            return res.status(400).json({ message: 'Book ID is required' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favourites: bookId } }, // Prevents adding duplicates
            { new: true, runValidators: true } 
        ).populate('favourites');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Book added to favourites',
            favourites: updatedUser.favourites
        });
    } catch (error) {
        console.error('Error adding favourite:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove Book from Favourites
router.put('/remove-favourite', AuthenticateToken, async (req, res) => {
    try {
        const userId = req.headers.id; // <-- fix here
        const { bookId } = req.params;

        if (!bookId) {
            return res.status(400).json({ message: 'Book ID is required' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { favourites: bookId } }, // Removes the book ID from the array
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Book removed from favourites' });
    } catch (error) {
        console.error('Error removing favourite:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get All Favourites
router.get('/get-favourites', AuthenticateToken, async (req, res) => {
    try {
        const userId = req.headers.id; // <-- fix here

        const user = await User.findById(userId).populate('favourites');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ favourites: user.favourites });
    } catch (error) {
        console.error('Error fetching favourites:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
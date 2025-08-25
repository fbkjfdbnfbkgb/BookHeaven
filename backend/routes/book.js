import  Router  from 'express';
const router = Router();
import User from '../models/user.js';
import jwt from 'jsonwebtoken'; // Importing j
import AuthenticateToken from './userAuth.js';
import Book from '../models/book.js';
//add book -admin

router.post('/add-book', AuthenticateToken, async (req, res) => {
    try {
        const {id } = req.headers;
        await User.findById(id).then((user) => {
            if (user.role !== 'admin') {
                return res.status(400).json({ message: 'Access denied. Admins only.' });
        }
        });
        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,



        });
        await book.save();
        res.status(200).json({ message: 'Book added successfully', book });

    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/update-book/:id', AuthenticateToken, async (req, res) => {
    try {
        const {id } = req.headers;
        await User.findById(id).then((user) => {
            if (user.role !== 'admin') {
                return res.status(400).json({ message: 'Access denied. Admins only.' });
        }
        });
        const bookId = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Book.findByIdAndUpdate(bookId, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,

        });
        if (!result) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book updated successfully', book: result });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
});
router.delete('/delete-book/:id', AuthenticateToken, async (req, res) => {
    try {
        const {id } = req.headers;
        await User.findById(id).then((user) => {
            if (user.role !== 'admin') {
                return res.status(400).json({ message: 'Access denied. Admins only.' });
        }
        });
        const bookId = req.params.id;
        const result = await Book.findByIdAndDelete(bookId);
        if (!result) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully', book: result });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
});

router.get('/get-All-books', async (req, res) => {
    try {
        const books = await Book.find({}).sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/get-recent-books', async (req, res) => {
    try {
        const books = await Book.find({}).sort({ createdAt: -1 }).limit(5);
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching recent books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
router.get('/get-book/:id', async (req, res) => {

 try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
                res.status(404).json({ message: 'Book not found' });
        } else {
            res.status(200).json({
                status: 'success',
                data: {
                    book: book
                }
            }); 
        }
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

        


           

export default router;

import { Router } from 'express';
const router = Router();
import bcrypt from 'bcryptjs'; // Updated to ensure correct import
import User from '../models/user.js';
import jwt from 'jsonwebtoken'; // Importing jwt for token generation
import AuthenticateToken from './userAuth.js';

//Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, address } = req.body;
        if(username.length < 4){
            return res.status(400).json({ message: 'Username must be at least 4 characters long' });
        }
        const existingUser = await User.findOne({ username: username });
        if(existingUser){
            return res.status(400).json({ message: 'Username already exists' });
        }
         const existingEmail = await User.findOne({ email: email });
        if(existingEmail){
            return res.status(400).json({ message: 'Email already exists' });
        }
        if(password.length <= 6){
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Store the hashed password
            address,
        });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser});
        
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({username: username });
        if(!existingUser){
            return res.status(400).json({ message: 'Invalid username or password' });
        }
const isMatch = await bcrypt.compare(password, existingUser.password);
if(isMatch){
    const authClaim= {
        name: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
    };
    const token = jwt.sign(authClaim, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    res.status(200).json({
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
        token: token,
        message: 'Login successful'
        
        
    });
} else {
    return res.status(400).json({ message: 'Invalid username or password' });
}
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
 router.get('/get-user-info', AuthenticateToken, async (req, res) => {
    try {
      const {id} =req.headers;
      const data = await User.findById(id).select('-password'); // Exclude password field
      return res.status(200).json(data); // Exclude password field  
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
 })


 router.put('/update-address', AuthenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address }, { new: true });
        res.status(200).json({ message: 'Address updated successfully' });

    } catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    })
        
export default router;

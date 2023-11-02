
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const SECRET_KEY = config.SECRET_KEY;

const userController = {

    fetchUserProfile: async (req, res) => {
        try {
            const list = await fetch("http://localhost:3001/api/users/list");
            console.log(list);
            
        } catch (error) {
            console.error('Error fetching user profile', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    signup: async (req, res) => {
       try {
           const { name, email, password } = req.body;
          
           const existingUser = await User.findOne({ email });
           
           if(existingUser){
            return res.status(409).json({ message: 'User already exists'});
           }

           const hashedPassword = await bcrypt.hash(password, 10);

           const newUser = new User({
                name,
                email,
                password: hashedPassword,
           });

           await newUser.save();
           res.status(201).json({ message: 'User created successfully'});

       } catch(error) {
           console.error('Error signing up user', error);
           res.status(500).json({ message: 'Internal server error' });
       }
    },

    getUserList: async (req, res) => {
        try {
            const userList = await User.find({}, 'name email');
            res.json(userList); 
        } catch(error) {
            console.error('Error getting user list', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    signin: async (req, res) => {
        try {
            const { email , password } = req.body;

            const user = await User.findOne({ email });

            if(!user){
                return res.status(401).json({ message: 'Authentication failed'});
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if(!passwordMatch){
                return res.status(401).json({ message: 'Authentication failed'});
            }

            const token = jwt.sign({ userId: user._id}, SECRET_KEY, { expiresIn: '1hr' });
            res.json({ token });
            
        } catch (error) {
            console.error('Error signing in user', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProfile: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId,'name email');
            res.json(user);
        } catch(error) {
            console.error('Error getting user profile', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    editProfile: async (req, res) => {
        try {
            const userId = req.userId;
            const { name, email } = req.body;

            const user = await User.findByIdAndUpdate(
                userId,
                { name, email, updateAt: Date.now() },
                { new: true }
            );

            res.json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating user profile', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteProfile: async (req, res) => {
        try {
            const userId = req.userId;
            await User.findByIdAndDelete(userId);
            res.json({ message: 'Profile deleted successfully' });
        } catch (error) {
            console.error('Error deleting user profile', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = userController;

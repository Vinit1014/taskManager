
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ fullName, email, password });
    await user.save();

    const token = generateToken(user);
    return res.status(201).json({ 
        error: false,
        user,
        token,
        message: "Registration Successful" 
    });
  } catch (error) {
    console.log("Error is "+error);
    return res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error:true, message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    return res.json({ 
        error: false,
        message: "Login successful",
        email,
        token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

exports.getUserInfo = async (req, res) => {
    const userId = req.user.id; 
    
    try {
      const isUser = await User.findOne({ _id: userId }); 
      if (!isUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ 
        error: false,
        user: {fullName: isUser.fullName, email: isUser.email, id: isUser._id},
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user info', error });
    }
};
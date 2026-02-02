const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateProfile = async (req, res) => {
  try {
      const { name } = req.body;
      let user = await User.findById(req.user.id);
      if(name) user.name = name;
      await user.save();
      res.json(user);
  } catch (err) {
      res.status(500).send('Server Error');
  }
};
exports.updateProfile = async (req, res) => {
    try {
        // 1. Log what the backend received (Check your terminal when you click save)
        console.log("Received Update Data:", req.body);

        const { name, bio, phone, jobTitle } = req.body;
        
        // 2. Find and Update in one step (cleaner and often safer)
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 
                $set: { 
                    name, 
                    bio, 
                    phone, 
                    jobTitle 
                } 
            },
            { new: true, runValidators: true } // "new: true" returns the updated document
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        console.log("Updated User in DB:", updatedUser); // Log the result
        res.json(updatedUser);

    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(500).send('Server Error');
    }
};
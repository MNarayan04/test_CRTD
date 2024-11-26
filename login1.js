const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// MongoDB connection (use your connection string if different)
mongoose.connect('mongodb://localhost:27017/CRTD', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define User model schema with Mongoose
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        // Find user by username
        const user = await User.findOne({ username });
        const app_Id = Math.floor(Math.random()*1000)
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ username: user.username, user_id: user._id }, 'your_secret_key', { expiresIn: '1h' });

        // Respond with the token
        res.status(200).json({
            message: 'Login successful',
            token: token,
            appID:app_Id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while logging in" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
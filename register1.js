const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb://localhost:27017/CRTD', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define a User model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Function to validate email format using a regular expression
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// Create account API endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
    }

    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        // Check if the email is already registered
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        // Hash the password securely using bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10);
        const app_Id= Math.floor(Math.random()*100);
        // Save the new user to the database
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Respond with a success message
        res.status(201).json({ message: "Account created successfully", user_id: newUser._id ,app_Id});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while creating the account" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { z } = require('zod'); // Import Zod for schema validation

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

// Define Zod schema for validation
const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(30, "Username must be at most 30 characters long"),
    email: z.string().email("Invalid email format"), // Use Zod's built-in email validation
    password: z.string().min(6, "Password must be at least 6 characters long")
});

// Create account API endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate the input using Zod
    try {
        // This will throw if validation fails
        userSchema.parse({ username, email, password });
    } catch (error) {
        return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
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

        // Save the new user to the database
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Respond with a success message
        res.status(201).json({ message: "Account created successfully", user_id: newUser._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while creating the account" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

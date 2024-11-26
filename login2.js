const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const User = require('./models/User');  // Assume your User model is in models/User.js

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(passport.initialize());  // Initialize Passport.js

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/CRTD', { useNewUrlParser: true, useUnifiedTopology: true });


// Using Passport.js lib
// Passport Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Login route using Passport.js
app.post('/login', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/failure',
    failureFlash: true
}));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

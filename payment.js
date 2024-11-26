const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const crypto = require('crypto');

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Function to generate a random confirmation ID
function generateConfirmationId() {
    return crypto.randomBytes(6).toString('hex').toUpperCase(); // 12 characters, uppercase alphanumeric
}

// API endpoint to process payment
app.post('/process_payment', (req, res) => {
    const { app_id, amount } = req.body;

    // Validate input data
    if (!app_id || amount <= 0) {
        return res.status(400).json({ error: 'Invalid payment details.' });
    }

    // Simulate payment processing and generate confirmation ID
    const confirmation_id = generateConfirmationId();

    return res.status(200).json({
        message: 'Payment successful!',
        app_id: app_id,
        confirmation_id: confirmation_id,
        amount: amount
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

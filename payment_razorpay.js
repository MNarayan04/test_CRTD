const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(bodyParser.json());

// Initialize Razorpay instance with your API key and secret
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// API endpoint to process payment
app.post('/process_payment', async (req, res) => {
    const { app_id, amount } = req.body;

    // Validate input data
    if (!app_id || amount <= 0) {
        return res.status(400).json({ error: 'Invalid payment details.' });
    }

    try {
        // Create an order in Razorpay
        const order = await razorpay.orders.create({
            amount: amount * 100, // Amount is in paise, so multiply by 100
            currency: 'INR',
            receipt: `receipt_${Math.floor(Math.random() * 10000)}`,
            payment_capture: 1, // Auto capture after payment
        });

        // Send back the order details along with the confirmation ID
        const confirmation_id = generateConfirmationId(); // You can keep the confirmation ID logic if needed
        return res.status(200).json({
            message: 'Payment order created successfully!',
            app_id: app_id,
            order_id: order.id,
            confirmation_id: confirmation_id,
            amount: amount,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Payment processing failed.' });
    }
});

// Function to generate a random confirmation ID (optional)
function generateConfirmationId() {
    return require('crypto').randomBytes(6).toString('hex').toUpperCase(); // 12 characters, uppercase alphanumeric
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

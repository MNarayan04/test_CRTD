const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());



// Simulate a database for storing payment transaction details
let transactionDatabase = [];

// Function to generate a random confirmation ID (optional)
function generateConfirmationId() {
    return require('crypto').randomBytes(6).toString('hex').toUpperCase(); // 12 characters, uppercase alphanumeric
}



// API endpoint to get post-payment transaction details
app.get('/payment_details', (req, res) => {
    const { app_id, confirmation_id } = req.query;

    // Validate if app_id and confirmation_id are provided
    if (!app_id || !confirmation_id) {
        return res.status(400).json({ error: 'App ID and Confirmation ID are required.' });
    }

    // Find the transaction details from the simulated database
    const transaction = transactionDatabase.find(tx => tx.app_id === app_id && tx.confirmation_id === confirmation_id);

    if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found.' });
    }

    // Return the transaction details as the response
    return res.status(200).json({
        app_id: transaction.app_id,
        confirmation_id: transaction.confirmation_id,
        order_id: transaction.order_id,
        amount: transaction.amount,
        status: transaction.status,
        date: transaction.date,
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

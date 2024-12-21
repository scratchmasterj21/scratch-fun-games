const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to check time
app.use((req, res, next) => {
    const currentHour = new Date().getHours();

    // Block access between 6 AM - 6 PM
    if (currentHour >= 6 && currentHour < 18) {
        res.sendFile(path.join(__dirname, 'public/closed.html')); // Serve "closed.html"
    } else {
        next(); // Continue if outside restricted hours
    }
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Default route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

const express = require('express');
const app = express();
const port = 4040; // Define the port

app.get('/api/test', (req, res) => {
    res.json({ body: 'test ok' });
});

app.post('/api/transaction', (req, res) => {
    res.json(req.body);
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




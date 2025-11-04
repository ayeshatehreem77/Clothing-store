const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();    // 1) load .env FIRST


const connectToMongo = require('./db');  // 2) import db after dotenv
connectToMongo();                        // 3) connect once

const app = express();
const port = process.env.PORT || 5000;

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/perfumes', require('./routes/perfumes'));
app.use('/api/brand', require('./routes/brand'));
app.use('/api/variant', require('./routes/variant'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));




// start server
app.listen(port, () => {
  console.log(`perfumes-app backend listening on port ${port}`);
});

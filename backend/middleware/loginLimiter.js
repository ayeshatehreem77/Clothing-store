const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                   // limit each IP to 10 requests per window
    message: { error: 'Too many login attempts, try again later.' }
});


module.exports = loginLimiter ;
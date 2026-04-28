require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./db/connectDB');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const sanitizer = require("perfect-express-sanitizer");
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const cookieParser = require('cookie-parser');
const i18middleware = require('i18next-http-middleware');
const i18next = require('./i18next');

// Import Routes
const authRoute = require('./routes/authRoute');
const commentsRoute = require('./routes/commentsRoute');
const adminRoute = require('./routes/adminRoute');
const questionsRoute = require('./routes/questionsRoute');
const tagsRoute = require('./routes/tagsRoute');
const personalitiesRoute = require('./routes/personalitiesRoute');
const paymentRoute = require('./routes/paymentRoute');

// Import middlewares
const errorHandler = require('./middleware/errorHandler');
const notFoundMiddleware = require('./middleware/notFound');
const { RateLimitError } = require('./errors');

// Import port from environment variables or use 5000 as default
const port = process.env.PORT || 5000;


// Add security middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN.split(','), // Add your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(i18middleware.handle(i18next));

// Add rate slow down middleware
app.use(slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50,           // Allow 50 requests at full speed
  delayMs: (hits) => hits * 100, // Add 100ms delay per request after the 50th
  maxDelayMs: 2000,         // Never exceed a 2-second artificial delay
}));

// Add rate limiting middleware
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    next(new RateLimitError(req.t('rateLimitNormal')));
  }
}));

// Add middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add data sanitization middlewares
app.use(hpp());
app.use(sanitizer.clean({
  xss: false,
  noSql: true,
  sql: true,
}, ['/api/v1/user/upload-image']));

app.use(xss());

// Add routes
app.use('/api/v1/', authRoute);
app.use('/api/v1/', commentsRoute);
app.use('/api/v1/', adminRoute);
app.use('/api/v1/', questionsRoute);
app.use('/api/v1/', tagsRoute);
app.use('/api/v1/', personalitiesRoute);
app.use('/api/v1/', paymentRoute);

// Add not found middleware
app.use(notFoundMiddleware);

// Use the custom error handler
app.use(errorHandler);

/**
 * Start the server and connect to the database
 * @returns {Promise<void>}
 */
const Start = async () => {
  try {
    // Connect to the database  
    await connectDB(process.env.MONGO_URI);
    // Start the server
    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};


Start();
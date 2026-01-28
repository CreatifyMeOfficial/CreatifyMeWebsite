require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./db/connectDB');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
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


// Add routes
app.use('/api/v1/', authRoute);
app.use('/api/v1/', commentsRoute);
app.use('/api/v1/', adminRoute);
app.use('/api/v1/', questionsRoute);
app.use('/api/v1/', tagsRoute);
app.use('/api/v1/', personalitiesRoute);

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
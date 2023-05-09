import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from 'express-rate-limit';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { dbConnection } from './utils/dbConnection.js';
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js"


const app = express();

// body parser middleware to handle request body
app.use(bodyParser.json({ extended:true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
dotenv.config({ path:".env" })

// cors to allow cross origin access
app.use(cors({ credentials: true, origin:process.env.APP_URL }));
app.options("*", cors());

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  });
  app.use('/api', limiter);

  

//database connection
app.use(async (req, res, next) => {
    await dbConnection();
    next();
});

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  });


  app.use('/auth', authRoutes);
  app.use('/product', productRoutes)

  const PORT = process.env.PORT || 3000;

app.listen(PORT,() => {
    console.log(`App running on port ${PORT}`);
})



// process.on('unhandledRejection', err => {
//   console.log('UNHANDLED REJECTION!Shutting down...');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// process.on('SIGTERM', () => {
//   console.log('SIGTERM RECEIVED. Shutting down gracefully');
//   server.close(() => {
//     console.log('Process terminated!');
//   });
// });

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const UrlRoutes = require('./model/routes/urlRoutes.js');
const { connectToMongoDB } = require('./model/routes/db.js');
const URL = require('./model/url.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  "http://localhost:5173",              
  "https://urlshortner-1-pory.onrender.com" 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

//

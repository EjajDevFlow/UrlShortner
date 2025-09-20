const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');   
const UrlRoutes = require('./model/routes/urlRoutes.js');
const { connectToMongoDB } = require('./model/routes/db.js');
const URL = require('./model/url.js');

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());


connectToMongoDB(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/url", UrlRoutes);

app.get('/:shortId', async (req, res) => {
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectUrl);
  } catch (err) {
    console.error("Error handling redirect:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

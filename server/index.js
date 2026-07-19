const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");


app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Server is running", 
    status: "OK",
    timestamp: new Date().toISOString()
  });
});


mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> console.log('MongoDB connected'))
    .catch((err) => {
        console.error("MongDB Connection Error:", err.message);
        process.exit(1);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
      console.log(`\n============================`);
  console.log(`Server is running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`============================\n`);
});
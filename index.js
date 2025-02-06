// const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { CreateChannel } = require("./utils");
const productRoutes = require("./api/products");
const express = require("express");

require("dotenv").config();
const print = console.log;
const app = express();

const port = process.env.PORT || 8003;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(__dirname + "/public"));

// Initialize the app
async function initializeApp() {
  try {
    await mongoose.connect(process.env.DB_URI);
    print("Connected to Product DB");

    const channel = await CreateChannel();

    await productRoutes(app, channel);
    app.listen(port, () => {
      console.log(`Product Service is Listening to Port ${port}`);
    }); // Pass Redis client to routes

    // appEvents(app);
    app.get("/health", (req, res) => {
      res.send("Product Service Running");
    });
  } catch (err) {
    console.log("Failed to start app:", err);
  }
}

initializeApp();

// Export the app for Vercel
// module.exports = app;

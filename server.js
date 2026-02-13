const express = require("express");
const cors = require("cors");
const compression = require('compression');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(compression());

// Test Route
app.get("/", (req,res) => {
    res.send("API Running!!!!!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});


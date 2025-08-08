const express = require("express");
const mongoose = require("mongoose");
const secureMern = require("secure-mern");

require("dotenv").config();

const app = express();

secureMern(app);

app.get('/', (req, res) => {
    res.send(`Server running on port ${process.env.PORT}`);
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
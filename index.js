require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("./config/mongo");
const connection = mongoose.connection;
const port = 3000;
const api = require("./routes/index");

app.use(express.json());

connection.once("open", () => {
  console.log("MongoDB Database connection established successfully");
});

app.use("/api", api);
app.get("", (req, res) => res.send("Server Running Successfully"));
app.listen(port, () => console.log(`Server up and running ${port}`));

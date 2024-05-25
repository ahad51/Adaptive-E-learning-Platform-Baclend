require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const mongoose = require("./config/mongo");
const connection = mongoose.connection;
const api = require("./routes/index");
const port = 3000;

app.use(express.json());
app.use(morgan("tiny"));

connection.once("open", () => {
  console.log("MongoDB Database connection established successfully");
});

app.use("/api", api);
app.get("", (req, res) => res.send("Server Running Successfully"));
app.listen(port, () => console.log(`Server up and running ${port}`));

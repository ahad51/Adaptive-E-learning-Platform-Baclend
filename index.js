require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Importing cors
const mongoose = require("./config/mongo");
const api = require("./routes/index");

const app = express();
const connection = mongoose.connection;
const port = 4000;

app.use(cors());


app.use(express.json());

connection.once("open", () => {
  console.log("MongoDB Database connection established successfully");
});

app.use("/api", api);

app.get("", (req, res) => res.send("Server Running Successfully"));

app.listen(port, () => console.log(`Server up and running on port ${port}`));

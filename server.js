const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const apiRouter = require("./routes/api.js");
const connectDB = require("./config/db.js");
const path = require("path");

dotenv.config();
app.use(cors());
app.use(express.json());
connectDB();

app.use("/api", apiRouter);

app.listen(process.env.PORT, () =>
  console.log("server started on port: ", process.env.PORT)
);

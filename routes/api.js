const express = require("express");
const portRouter = require("./port.js");
const vesselRouter = require("./vessel.js");
const app = express();

app.use("/ports", portRouter);
app.use("/vessels", vesselRouter);

module.exports = app;

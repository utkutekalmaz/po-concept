const mongoose = require("mongoose");

const portSchema = new mongoose.Schema({
  "Country Code": { type: String, required: false },
  "Country Name": { type: String, required: false },
  "Port Name": { type: String, required: false },
  "Facility Name": { type: String, required: false },
  "IMO Port Facility Number": { type: String, required: false },
  Description: { type: String, required: false },
  Longitude: { type: Number, required: false },
  Latitude: { type: Number, required: false },
  "Plan Approved": { type: String, required: false },
  "Initial Approval Date": { type: String, required: false },
  "Review Date": { type: String, required: false },
  "SoC Issue Date": { type: String, required: false },
  "Security Plan Withdrawn": { type: String, required: false },
  "Withdrawn Date": { type: String, required: false },
  "Last Updated": { type: String, required: false },
});

module.exports = mongoose.model("ports", portSchema);

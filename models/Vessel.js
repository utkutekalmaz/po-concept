const mongoose = require("mongoose");

const vesselSchema = new mongoose.Schema({
  MMSI: { type: Number },
  TIME: { type: String },
  LONGITUDE: { type: Number },
  LATITUDE: { type: Number },
  COG: { type: Number },
  SOG: { type: Number },
  HEADING: { type: Number },
  ROT: { type: Number },
  NAVSTAT: { type: Number },
  IMO: { type: Number },
  NAME: { type: String },
  CALLSIGN: { type: String },
  TYPE: { type: Number },
  A: { type: Number },
  B: { type: Number },
  C: { type: Number },
  D: { type: Number },
  DRAUGHT: { type: Number },
  DEST: { type: String },
  ETA: { type: Date },
});

module.exports = mongoose.model("vessels", vesselSchema);

const express = require("express");
const VesselController = require("../controllers/VesselController");

const router = express.Router();

router.get("/available", VesselController.vesselsAvailable);
// unused crud routes
// router.get("/", VesselController.vesselList);
// router.get("/", VesselController.vesselDetail);
// router.post("/", VesselController.vesselStore);
// router.put("/", VesselController.vesselUpdate);
// router.delete("/", VesselController.vesselDelete);

module.exports = router;

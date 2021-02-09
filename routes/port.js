const express = require("express");
const PortController = require("../controllers/PortController");

const router = express.Router();

router.get("/", PortController.portList);
// unused crud routes
// router.get("/", PortsController.portDetail);
// router.post("/", PortsController.portStore);
// router.put("/", PortsController.portUpdate);
// router.delete("/", PortsController.portDelete);

module.exports = router;

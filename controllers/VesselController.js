const { Request, Response } = require("express");
const { getPort, getMatchingPorts, getROI } = require("../services/portService");
const { getVessels, getIdleVessels } = require("../services/vesselService");
const { check, validationResult } = require("express-validator");
/**
 * Returns available vessels within given date range and distance
 * @param {Request} req
 * @param {Response} res
 */
exports.vesselsAvailable = [
  [
    check("port").isString(),
    check("distance").isNumeric(),
    // check("startDate").isDate(), TODO
    // check("endDate").isDate(), TODO
    check("includeIdles").isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let num = 0;
      let availableVessels = [];
      let { port, distance, startDate, endDate, includeIdles } = req.body;

      startDate = new Date(startDate).toISOString();
      endDate = new Date(endDate).toISOString();

      // query for the port
      const selectedPort = await getPort(port);

      // get a rectangle RoI for the selected port
      const portsROI = await getROI(selectedPort, distance);

      // get a rectangle roi for the selected port
      const matchingPorts = await getMatchingPorts(portsROI, selectedPort);

      let [mainVessels, alternativeVessels, vesselSet] = await getVessels(
        selectedPort,
        startDate,
        endDate,
        matchingPorts
      );

      if (includeIdles) {
        const idleSearchArea = await getROI(selectedPort);
        [mainVessels, vesselSet] = await getIdleVessels([mainVessels], vesselSet, idleSearchArea);
        [alternativeVessels, vesselSet] = await getIdleVessels(alternativeVessels, vesselSet, idleSearchArea);
      }

      return res.status(200).send({
        msg: "Vessels found within search criteria",
        data: {
          selectedPort: mainVessels,
          alternativePorts: alternativeVessels,
        },
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },
];

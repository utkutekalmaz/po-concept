const Port = require("../models/Port");
const Vessel = require("../models/Vessel");
const geolib = require("geolib");

/**
 *
 * @param {Port} mainPort main port
 * @param {String} sd start date
 * @param {String} ed end date
 * @param {Port[]} alternativePorts alternative ports for a wider search
 */
exports.getVessels = async function (mainPort, startDate, endDate, alternativePorts = []) {
  const vesselSet = new Set();
  const vesselsHeaded = { main: {}, alternatives: [] };

  const facilityCodeRegExp = new RegExp(`${mainPort["IMO Port Facility Number"]}`, "i");
  const portNameRegExp = new RegExp(`${mainPort["Port Name"]}`, "i");
  const facilityNameRegExp = new RegExp(`${mainPort["Facility Name"]}`, "i");

  try {
    let mainVessels = await Vessel.find({
      ETA: { $gt: startDate, $lt: endDate },
      TYPE: { $gte: 80, $lte: 89 },
      $or: [{ DEST: facilityCodeRegExp }, { DEST: portNameRegExp }, { DEST: facilityNameRegExp }],
    }).exec();

    mainVessels = await mainVessels.map((ves) => {
      if (!vesselSet.has(ves.id)) {
        vesselSet.add(ves.id);
      }
      return { ...ves._doc, id: ves.id };
    });

    vesselsHeaded.main = { port: mainPort, vessels: mainVessels };
  } catch (error) {
    console.log(error);
  }

  try {
    /**
     * We cannot use Promise all and map; because Set check and increase should be sync
     */
    for (const port of alternativePorts) {
      let vessels = await Vessel.find({
        _id: {
          $nin: [...vesselSet],
        },
        ETA: { $gt: startDate, $lt: endDate },
        TYPE: { $gte: 80, $lte: 89 },
        $or: [{ DEST: facilityCodeRegExp }, { DEST: portNameRegExp }, { DEST: facilityNameRegExp }],
      }).exec();

      vessels = await vessels.map((ves) => {
        if (!vesselSet.has(ves.id)) {
          vesselSet.add(ves.id);
        }
        return { ...ves._doc, id: ves.id };
      });

      vesselsHeaded.alternatives.push({ port, vessels });
    }
  } catch (error) {
    console.log(error);
  }

  console.log(vesselsHeaded);

  return [vesselsHeaded.main, vesselsHeaded.alternatives, vesselSet];
};

/**
 * Get idle vessels for the given port-vessels array.
 * @param {Object[]} currents port-vessel objects array
 * @param {String[]} vesselSet array of added vessels
 * @param {Object} roi a region of interest area defined with 4 numbers
 */
exports.getIdleVessels = async function (currents, vesselSet, roi) {
  for (const current of currents) {
    let vessels = await Vessel.find({
      _id: {
        $nin: [...vesselSet],
      },
      LATITUDE: { $gte: roi.min_latitude, $lte: roi.max_latitude },
      LONGITUDE: { $gte: roi.min_longitude, $lte: roi.max_longitude },
      TYPE: { $gte: 80, $lte: 89 },
      DEST: "",
    }).exec();

    vessels = await vessels.map((item) => {
      if (!vesselSet.has(item.id)) {
        vesselSet.add(item.id);
      }
      return item._doc;
    });

    current.idles = vessels;
  }

  return [currents, vesselSet];
};

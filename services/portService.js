const Port = require("../models/Port");
const geolib = require("geolib");
const { IDLE_DISTANCE } = require("../config/globals");

/**
 *
 * @param {String} query Search for a port name by facility id or port name. Returns the first found
 * @returns {Object | null} {latitude, longitude} object or null
 */
exports.getPort = async (search) => {
  const query = new RegExp(`${search}`, "i");

  let selectedPort = await Port.findOne({
    "IMO Port Facility Number": query,
  });

  if (!selectedPort) {
    selectedPort = await Port.findOne({ "Country Code": query });
  }

  if (!selectedPort) {
    selectedPort = await Port.findOne({
      "Facility Name": query,
    });
  }

  // console.log(selectedPort);
  return selectedPort._doc || null;
};

/**
 *
 * @param {Object} portCoord {latitude, longitude}
 * @param {String} distance Distance value. Default is idle vessel search constant
 * @returns {Object} {max_lat, min_lat, max_long, min_long} a roi object with max-min Lat-Long values
 */
exports.getROI = function (port, distance = IDLE_DISTANCE) {
  const portCoord = {
    latitude: port.Latitude,
    longitude: port.Longitude,
  };
  const max_latitude = geolib.computeDestinationPoint(portCoord, distance * 1000, 0).latitude;
  const min_latitude = geolib.computeDestinationPoint(portCoord, distance * 1000, 180).latitude;
  const max_longitude = geolib.computeDestinationPoint(portCoord, distance * 1000, 90).longitude;
  const min_longitude = geolib.computeDestinationPoint(portCoord, distance * 1000, 270).longitude;
  return {
    max_latitude,
    min_latitude,
    max_longitude,
    min_longitude,
  };
};

exports.getMatchingPorts = async function (roi, excludePort) {
  const excluding = excludePort["IMO Port Facility Number"];

  let matching_ports = await Port.find({
    Latitude: { $gte: roi.min_latitude, $lte: roi.max_latitude },
    Longitude: { $gte: roi.min_longitude, $lte: roi.max_longitude },
    "IMO Port Facility Number": { $ne: excluding },
  });

  matching_ports = await matching_ports.map((port) => {
    return port._doc;
  });

  return matching_ports;
};

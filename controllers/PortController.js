const { Request, Response } = require("express");
const { getPorts } = require("../services/portService");

/**
 * Returns filtered ports
 * @param {Request} req
 * @param {Response} res
 */
exports.portList = async (req, res) => {
  try {
    const portList = await getPorts();
    res.status(200).send(portList);
  } catch (error) {
    res.status(500).send("internal server error");
  }
};

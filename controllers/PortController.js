const { Request, Response } = require("express");
const Port = require("../models/Port");

/**
 * Returns filtered ports
 * @param {Request} req
 * @param {Response} res
 */
exports.portList = async (req, res) => {
  try {
    const portList = await Port.find({});
    res.status(200).send(portList);
  } catch (error) {
    res.status(500).send("internal server error");
  }
};

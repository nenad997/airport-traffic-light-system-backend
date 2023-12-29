const validator = require("validator");

const Flight = require("../models/Flight");

module.exports = {
  createFlight: async ({ input }, req) => {
    const {
      airport,
      flightNumber,
      scheduleTime,
      avioCompany,
      terminal,
      status,
      type,
    } = input;

    const errors = [];

    if (validator.isEmpty(airport)) {
      errors.push({ message: "Invalid Input" });
    }
    if (validator.isEmpty(flightNumber)) {
      errors.push({ message: "Invalid Input" });
    }
    if (validator.isEmpty(scheduleTime)) {
      errors.push({ message: "Invalid Input" });
    }
    if (validator.isEmpty(avioCompany)) {
      errors.push({ message: "Invalid Input" });
    }
    if (validator.isEmpty(terminal)) {
      errors.push({ message: "Invalid Input" });
    }
    if (validator.isEmpty(status)) {
      errors.push({ message: "Invalid Input" });
    }
    if (validator.isEmpty(type)) {
      errors.push({ message: "Invalid Input" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const flight = new Flight({
      airport,
      flightNumber,
      scheduleTime,
      avioCompany,
      terminal,
      status,
      type,
    });

    const flightResult = await flight.save();

    return {
      ...flightResult._doc,
      _id: flightResult._id.toString(),
      createdAt: flightResult.createdAt.toISOString(),
      updatedAt: flightResult.updatedAt.toISOString(),
    };
  },
  getFlights: async () => {
    const flights = await Flight.find().sort({ createdAt: -1 });

    if (!flights || flights.length === 0) {
      const error = new Error("Could not fetch flights");
      error.code = 404;
      throw error;
    }

    return flights.map((flight) => {
      return {
        ...flight._doc,
        _id: flight._id.toString(),
        createdAt: flight.createdAt.toISOString(),
        updatedAt: flight.updatedAt.toISOString(),
      };
    });
  },
  deleteFlight: async ({ flightId }, req) => {
    const foundFlight = await Flight.findOne({ _id: flightId });

    if (!foundFlight) {
      const error = new Error(
        "You are trying to delete a flight that does not exist"
      );
      error.code = 204;
      throw error;
    }

    const deletionResult = await Flight.deleteOne({ _id: flightId });
    return deletionResult;
  },
};

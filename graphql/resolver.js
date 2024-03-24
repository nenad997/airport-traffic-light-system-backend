const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Flight = require("../models/Flight");
const User = require("../models/User");

module.exports = {
  createFlight: async ({ input }, req) => {
    if (!req.isAuth) {
      const error = new Error("Not Authorized!");
      error.code = 401;
      throw error;
    }

    const {
      airport,
      flightNumber,
      scheduleTime,
      avioCompany,
      terminal,
      status,
      type,
    } = input;

    const loggedInUser = await User.findOne({ _id: req.userId });

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

    if (!loggedInUser) {
      errors.push({ message: "Not Authorized!" });
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
      userId: loggedInUser._id,
    });

    loggedInUser.flights.push(flight);

    await loggedInUser.save();

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
    if (!req.isAuth) {
      const error = new Error("Not Authorized!");
      error.code = 401;
      throw error;
    }
    const loggedInUser = await User.findOne({ _id: req.userId });
    const foundFlight = await Flight.findOne({ _id: flightId });

    if (!loggedInUser) {
      errors.push({ message: "Not Authorized!" });
    }

    if (!foundFlight) {
      const error = new Error(
        "You are trying to delete a flight that does not exist"
      );
      error.code = 204;
      throw error;
    }
    loggedInUser.flights = loggedInUser.flights.filter(
      (flight) => flight._id.toString() !== flightId.toString()
    );
    await loggedInUser.save();

    const deletionResult = await Flight.deleteOne({ _id: flightId });
    return deletionResult;
  },
  getFlight: async ({ flightId }, req) => {
    const foundFlight = await Flight.findOne({ _id: flightId }).populate(
      "userId"
    );

    if (!foundFlight) {
      const error = new Error("Could not find a flight");
      error.code = 404;
      throw error;
    }

    return {
      ...foundFlight._doc,
      _id: foundFlight._id.toString(),
      createdAt: foundFlight.createdAt.toISOString(),
      updatedAt: foundFlight.updatedAt.toISOString(),
    };
  },
  updateFlight: async ({ flightId, input }, req) => {
    if (!req.isAuth) {
      const error = new Error("Not Authorized!");
      error.code = 401;
      throw error;
    }

    const {
      airport,
      flightNumber,
      scheduleTime,
      avioCompany,
      terminal,
      status,
      type,
    } = input;

    const foundFlight = await Flight.findOne({ _id: flightId });

    if (!foundFlight) {
      const error = new Error("Could not find a flight");
      error.code = 404;
      throw error;
    }

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

    foundFlight.airport = airport;
    foundFlight.flightNumber = flightNumber;
    foundFlight.scheduleTime = scheduleTime;
    foundFlight.avioCompany = avioCompany;
    foundFlight.terminal = terminal;
    foundFlight.status = status;
    foundFlight.type = type;

    const flightResult = await foundFlight.save();

    return {
      ...flightResult._doc,
      _id: flightResult._id.toString(),
      createdAt: flightResult.createdAt.toISOString(),
      updatedAt: flightResult.updatedAt.toISOString(),
    };
  },
  login: async ({ input }, req) => {
    const { email, password } = input;

    const errors = [];

    if (validator.isEmpty(email)) {
      errors.push({ message: "Invalid Email" });
    }

    if (validator.isEmpty(password)) {
      errors.push({ message: "Invalid input" });
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      const error = new Error("User with this email does not exist!");
      error.code = 400;
      throw error;
    }

    const doPasswordsMatch = await bcrypt.compare(password, foundUser.password);

    if (!doPasswordsMatch) {
      errors.push({ message: "Incorrect password", code: 401 });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input");
      error.code = 422;
      error.data = errors;
      throw error;
    }

    const token = jwt.sign(
      {
        email,
        userId: foundUser._id,
      },
      "somesecretkey",
      { expiresIn: "5h" }
    );
    return {
      ...foundUser._doc,
      _id: foundUser._id.toString(),
      token,
    };
  },
  signUp: async ({ input }, req) => {
    const { email, username, password, repeatPassword, employeeId } = input;

    const errors = [];

    if (!validator.isEmail(email)) {
      errors.push({
        message: "Please enter a valid email address",
        pathway: "email",
      });
    }

    if (validator.isEmpty(email)) {
      errors.push({ message: "Invalid input", pathway: "email" });
    }

    if (validator.isEmpty(password)) {
      errors.push({ message: "Invalid input", pathway: "password" });
    }

    if (!validator.isAlphanumeric(password)) {
      errors.push({
        message: "Password must contain both numbers and letters",
        pathway: "password",
      });
    }

    if (!validator.isLength(password, { min: 6, max: 15 })) {
      errors.push({
        message: "Password must be between 6 and 15 characters long",
        pathway: "password",
      });
    }

    if (!validator.equals(password, repeatPassword)) {
      errors.push({ message: "Passwords do not match", pathway: "password" });
    }

    if (!validator.equals(employeeId, "ABC123")) {
      errors.push({
        message: "Entered ID does not exist",
        pathway: "employeeId",
      });
    }

    const foundUser = await User.findOne({ email });

    if (foundUser) {
      errors.push({
        message:
          "User with this email already exists, please pick another email",
        pathway: "email",
      });
    }

    if (errors.length > 0) {
      const error = new Error("Validation Failed!");
      error.code = 400;
      error.data = errors;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      flights: [],
    });

    const userResult = await newUser.save();

    return {
      ...userResult._doc,
      _id: userResult._id.toString(),
      flights: userResult.flights.map((flight) => {
        return flight._id.toString();
      }),
    };
  },
  deleteUser: async ({ userId }, req) => {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      throw new Error("You are trying to delete user that does not exist!");
    }

    await User.deleteOne({ _id: userId });
    await Flight.deleteMany({ userId });
    await foundUser.save();
    await Flight.save();

    return true;
  },
};

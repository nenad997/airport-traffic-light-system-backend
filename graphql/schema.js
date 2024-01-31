const { buildSchema } = require("graphql");

module.exports = buildSchema(`#graphql
  type User {
    _id: String
    email: String
    username: String
    password: String,
    token: String,
    flights: [String]
  }

  input FlightInput {
    airport: String
    flightNumber: String
    scheduleTime: String
    avioCompany: String
    terminal: String
    status: String
    type: String
  }

  type Flight {
    _id: String
    airport: String
    flightNumber: String
    scheduleTime: String
    avioCompany: String
    terminal: String
    status: String
    type: String
    createdAt: String
    updatedAt: String
  }

  input LoginInput {
    email: String
    password: String
  }

  input UserInput {
    email: String
    username: String
    password: String
    repeatPassword: String
    employeeId: String
  }

  type RootQuery {
    getUser(id: ID): User
    getFlights: [Flight]!
    getFlight(flightId: String!): Flight!
    login(input: LoginInput): User
  }

  type RootMutation {
    createFlight(input: FlightInput!): Flight!
    signUp(input: UserInput!): User
    deleteFlight(flightId: String!): Flight!
    updateFlight(flightId: String!, input: FlightInput!): Flight!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

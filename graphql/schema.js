const { buildSchema } = require("graphql");

module.exports = buildSchema(`#graphql
  type User {
    id: ID
    username: String
    email: String
  }

  input UserInput {
    username: String
    email: String
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

  type RootQuery {
    getUser(id: ID): User
    getFlights: [Flight]!
  }

  type RootMutation {
    createUser(input: UserInput): User
    createFlight(input: FlightInput!): Flight!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

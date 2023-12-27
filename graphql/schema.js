const { buildSchema } = require("graphql");

module.exports = buildSchema(`#graphql
  type RootQuery {
    getUser(id: ID): User
  }

  type RootMutation {
    createUser(input: UserInput): User
  }

  type User {
    id: ID
    username: String
    email: String
  }

  input UserInput {
    username: String
    email: String
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

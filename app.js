const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./graphql/schema");
const resolver = require("./graphql/resolver");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true,
  })
);

app.listen(8080);

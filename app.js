const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const { MONGODB_URI } = require("./constants");

const schema = require("./graphql/schema");
const resolver = require("./graphql/resolver");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true,
  })
);

mongoose
  .connect(MONGODB_URI)
  .then((connectionResult) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });

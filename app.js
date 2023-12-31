const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const { MONGODB_URI } = require("./constants");

const { auth } = require("./middlewares/auth");
const schema = require("./graphql/schema");
const resolver = require("./graphql/resolver");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(auth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true,
    customFormatErrorFn: (err) => {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An Error Occured!";
      const statusCode = err.originalError.code || 500;
      return {
        message,
        statusCode,
        data,
      };
    },
  })
);

app.use((error, req, res, next) => {
  if (!error) {
    return next();
  }
  console.log(error);
  const statusCode = error.code || 500;
  res.status(statusCode).json({
    message: error.message,
    data: error.data || null,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((connectionResult) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });

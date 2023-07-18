const express = require("express");

const database = require("./services/database.service");
const contactsRouter = require("./contacts/contacts.api.router");
const authRouter = require("./auth/auth.api.router");

const requestLogger = require("./middlewares/request-logger");
const errorHandler = require("./api-utils/error-handler");
const notFoundHandler = require("./api-utils/not-found-handler");

const config = require("./config");

async function start() {
  console.log("[init]: connecting to database");
  await database.Initialize();

  console.log("[init]: starting server");
  const server = new express();
  server.use(requestLogger);
  server.use(express.json());

  server.use("/contacts", contactsRouter);
  server.use("/auth", authRouter);

  server.use(notFoundHandler);
  server.use(errorHandler);

  server.listen(config.APP_PORT, () => {
    console.log("[init]: contacts-service running on", config.APP_PORT);
  });
}

start().catch((err) => {
  console.log("[fatal]: could not start contacts-service");
  console.log(err);
});

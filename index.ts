require("dotenv").config();
import { Application } from "express";

const express = require("express");
const sequelize = require("./db");

require("dotenv").config();

const PORT: number = Number(process.env.PORT) || 5000;

const app: Application = express();

const start = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
start();

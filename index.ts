require("dotenv").config();
import { Application } from "express";
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const router = require("./router/index");

require("dotenv").config();

const PORT: number = Number(process.env.PORT) || 5000;

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use("/api", router);

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DB_URL as string, {
      dbName: "game-store",
    });
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e: any) {
    console.log(e);
  }
};

start();

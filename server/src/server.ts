import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";
import { connectToDatabase } from "./db";
import { createOrderTable } from "./schema/orderTable.model";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

const PORT = process.env.PORT || 8000;

connectToDatabase()
  .then(() => {
    createOrderTable();
  })
  .catch((err) => {
    console.log("Error while making the user table", err);
  });

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

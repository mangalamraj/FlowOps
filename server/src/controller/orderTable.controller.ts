import { Request, Response } from "express";
import fs from "fs";
import { parse } from "fast-csv";
import {
  getAllOrdersService,
  uploadOrdersService,
} from "../service/order.service";

type OrderCsvRow = {
  order_id: string;
  sku: string;
  warehouse: string;
  status: string;
  created_at: string;
  shipped_at: string;
};
const getStringQuery = (value: unknown): string | undefined => {
  if (typeof value === "string") return value;
  return undefined;
};

export const getAllOrders = async (req: Request, res: Response) => {
  const orderid = getStringQuery(req.query.orderid);
  const sku = getStringQuery(req.query.sku);
  const warehouse = getStringQuery(req.query.warehouse);
  const status = getStringQuery(req.query.status);
  const shippedat = getStringQuery(req.query.shippedat);
  try {
    const data = await getAllOrdersService(
      orderid,
      sku,
      warehouse,
      status,
      shippedat,
    );
    return res.status(200).json(data);
  } catch (err) {
    console.log("Error getting orders", err);
    return res
      .status(500)
      .json({ message: "Error getting data from the database." });
  }
};

export const uploadOrders = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No File Found" });
  }
  const filePath = req.file.path;
  const csvData: OrderCsvRow[] = [];

  fs.createReadStream(filePath)
    .pipe(parse({ headers: true }))
    .on("error", (error) => {
      console.error(error);
      fs.unlinkSync(filePath);
      return res.status(500).json({ message: "Error parsing CSV file." });
    })
    .on("data", (row: OrderCsvRow) => {
      csvData.push(row);
    })
    .on("end", async () => {
      fs.unlinkSync(filePath);

      try {
        const data = await uploadOrdersService(csvData);
        return res.status(200).json({
          message:
            data.rejected != 0
              ? "CSV data inserted with few rejections"
              : "CSV data successfully imported into PostgreSQL.",
          data,
        });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error inserting data into the database." });
      }
    });
};

import { Request, Response } from "express";
import fs from "fs";
import { parse } from "fast-csv";
import {
  addTagsService,
  getAllOrdersService,
  getDimensionService,
  getLablesService,
  uploadOrdersService,
} from "../service/order.service";
import axios from "axios";

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
      const uniqueOrdersMap = new Map<string, OrderCsvRow>();

      for (const row of csvData) {
        uniqueOrdersMap.set(row.order_id, row);
      }

      const dedupedCsvData = Array.from(uniqueOrdersMap.values());

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

export const addTags = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const data = {
      orderid: body.orderid,
      tags: body.tags,
    };
    const rows = await addTagsService(data);
    if (rows == 0) {
      console.log("Now rows got updated");
      return res.status(400).json({ message: "No rows got updated" });
    }
    return res.status(200).json({ message: "Tags got updated" });
  } catch (err) {
    console.log("Error while adding tags", err);
  }
};

export const getRules = async (req: Request, res: Response) => {
  const order_id = getStringQuery(req.query.orderid);
  try {
    const data = await getLablesService(order_id!);
    const labelData = data[0];
    const Existingtags = labelData.tags;
    const { orderid, ...newTags } = Existingtags;
    labelData.tags = newTags;
    labelData.orderid = order_id;
    const rulesData = await axios.post("http://localhost:8001/get-rules", {
      labelData,
    });
    res.status(200).json(rulesData.data);
  } catch (err) {
    console.log("Error getting rules", err);
  }
};

export const getDimensions = async (req: Request, res: Response) => {
  const orderid = getStringQuery(req.query.orderid);
  try {
    let data;
    if (orderid) {
      data = await getDimensionService(orderid);
    }
    res.status(200).json(data?.[0]);
  } catch (err) {
    console.log("Error while getting the dimension", err);
  }
};

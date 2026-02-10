import FormData from "form-data";
import fs from "fs";
import axios from "axios";
import { Request, Response } from "express";
import {
  pctToInches,
  verifyBarcodePositionRules,
} from "../service/labelverification.service";
import {
  changeStatusService,
  getDimensionService,
} from "../service/order.service";

async function uploadLabel(req: Request, res: Response) {
  const file = req.files?.image as any;
  const orderid = req.body.orderid;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const form = new FormData();
  form.append("file", file.data, {
    filename: file.name,
    contentType: file.mimetype,
  });
  try {
    let response = await axios.post(
      "http://localhost:8002/detect-label",
      form,
      { headers: form.getHeaders(), timeout: 5000 },
    );
    const dimensionRules = await getDimensionService(orderid);
    const distIn = pctToInches(response.data);
    const verificationResults = verifyBarcodePositionRules(
      distIn,
      dimensionRules,
    );
    const failed = verificationResults.filter(
      (result) => result.status === "FAIL",
    );
    if (failed.length > 0) {
      await changeStatusService(orderid, "failed");
    } else {
      await changeStatusService(orderid, "verified");
    }
    return res.status(200).json(verificationResults);
  } catch (err) {
    console.log("Error getting the result", err);
  }
}

export default uploadLabel;

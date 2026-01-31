import FormData from "form-data";
import fs from "fs";
import axios from "axios";
import { Request, Response } from "express";

async function uploadLabel(req: Request, res: Response) {
  const file = req.files?.image as any;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const form = new FormData();
  form.append("file", file.data, {
    filename: file.name,
    contentType: file.mimetype,
  });
  try {
    const response = await axios.post(
      "http://localhost:8002/detect-label",
      form,
      { headers: form.getHeaders(), timeout: 5000 },
    );
    return res.status(200).json(response.data);
  } catch (err) {
    console.log("Error uploading the image", err);
  }
}

export default uploadLabel;

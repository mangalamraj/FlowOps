import axios from "axios";
import FormData from "form-data";
import { Request, Response } from "express";

export const llmParser = async (req: Request, res: Response) => {
  try {
    const file = req.files?.file as any;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", file.data, file.name);

    const response = await axios.post(
      "http://localhost:8001/categorize-pdf",
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
      }
    );

    return res.status(200).json(response.data);
  } catch (e) {
    console.error("error while parsing the pdf", e);
    return res.status(500).json({ error: "PDF parsing failed" });
  }
};

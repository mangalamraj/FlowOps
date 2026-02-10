import OpenAI from "openai";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import { getAllOrdersService } from "../service/order.service";
import {
  getGreetingResponse,
  isGreeting,
  summarizeOrders,
} from "../service/chat.service";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function decryptData(encryptedData: string, secret: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secret);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) {
    throw new Error("Decryption failed");
  }

  return decrypted;
}
type ExtractedFilter = {
  type: "orderid" | "sku" | "warehouse" | "status" | "shippedat";
  value: string;
};

const mapExtractedFilters = (items: ExtractedFilter[]) => {
  const filters: {
    orderid?: string;
    sku?: string;
    warehouse?: string;
    status?: string;
    shippedat?: string;
  } = {};

  for (const item of items) {
    switch (item.type) {
      case "orderid":
        filters.orderid = item.value;
        break;
      case "sku":
        filters.sku = item.value;
        break;
      case "warehouse":
        filters.warehouse = item.value;
        break;
      case "status":
        filters.status = item.value;
        break;
      case "shippedat":
        filters.shippedat = item.value;
        break;
    }
  }

  return filters;
};

export const handleOpenAiInput = async (req: any, res: any) => {
  try {
    const { encryptedmessage } = req.body;
    if (!encryptedmessage) {
      return res.status(400).json({ error: "encryptedmessage is required" });
    }

    const secret = process.env.DECRYPTION_SECRET!;
    const userMessage = decryptData(encryptedmessage, secret).trim();
    if (!userMessage) {
      return res.status(400).json({ error: "Empty message after decryption" });
    }

    if (isGreeting(userMessage)) {
      return res.status(200).json({
        type: "greeting",
        summary: getGreetingResponse(),
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
            You are a parser for an order management system.

            Extract structured filters from user text.
            Return ONLY valid JSON.

            Rules:
            - "ORD*" → orderid
            - "SKU*" → sku
            - Warehouse codes (DEL-*, BLR-*, MUM-*, etc) → warehouse
            -  verified (sku rules are verified) | rules pending (rules are yet to be fetched from llm) | sku rules not veried (rules are not added by llm) | Rules Added (Rules are added by llm) | failed (rules verification failed) → status
            - date or date-like → shippedat

            Format:
            [
              { "type": "orderid | sku | warehouse | status | shippedat", "value": "string" }
            ]

            If nothing matches, return [].`.trim(),
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 150,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty OpenAI response");

    console.log(JSON.stringify(completion.choices[0]));
    const extracted = JSON.parse(raw);
    const filters = mapExtractedFilters(extracted);

    const result = await getAllOrdersService(
      filters.orderid,
      filters.sku,
      filters.warehouse,
      filters.status,
      filters.shippedat,
    );
    const summary = await summarizeOrders({
      query: userMessage,
      rows: result.rows,
    });

    return res.status(200).json({
      query: userMessage,
      appliedFilters: filters,
      summary,
      rows: result.rows,
    });
  } catch (error: any) {
    console.error("AI pipeline error:", error.message);
    return res.status(500).json({ error: "Failed to process request" });
  }
};

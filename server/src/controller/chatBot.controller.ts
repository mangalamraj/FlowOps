import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
import CryptoJS from "crypto-js";

function decryptData(encryptedData: string, secret: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export const handleOpenAiInput = async (request: any, response: any) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const secret = process.env.DECRYPTION_SECRET || "secret";
  try {
    const { encryptedmessage } = request.body;
    const decryptedmessage = decryptData(encryptedmessage, secret);
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: `You are chatbot for my chatbot provider website.Give answer to the users questions:${decryptedmessage}.Give answer in 50-100 words in summarised manner`,
        },
      ],
      max_tokens: 200,
    });

    const responseMessage =
      aiResponse.choices[0]?.message?.content ||
      "Sorry, there was an error processing your query.";
    console.log("response:", responseMessage);
    response.status(200).json({ responseMessage });
  } catch (error: unknown) {
    console.log("something went wrong", error);
  }
};

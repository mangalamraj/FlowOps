import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizeOrders = async (input: {
  query: string;
  rows: any[];
}) => {
  const sampleRows = input.rows.slice(0, 10);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `
You are an analytics assistant for an order management system.

Rules:
- NEVER invent numbers
- Be concise and clear (2–4 sentences)
- If no rows exist, clearly say so

Do NOT output JSON.
Return plain text summary only

.
        `.trim(),
      },
      {
        role: "user",
        content: JSON.stringify({
          userQuery: input.query,
          sampleOrders: sampleRows,
        }),
      },
    ],
    max_tokens: 120,
  });

  return completion.choices[0]?.message?.content ?? "";
};
const GREETING_PATTERNS = [
  /^hi$/i,
  /^yo$/i,
  /^hi bro$/i,
  /^hello$/i,
  /^hey$/i,
  /^hi there$/i,
  /^hello there$/i,
  /^good morning$/i,
  /^good afternoon$/i,
  /^good evening$/i,
  /^thanks$/i,
  /^thank you$/i,
];

export const isGreeting = (text: string): boolean => {
  const normalized = text.trim().toLowerCase();
  return GREETING_PATTERNS.some((pattern) => pattern.test(normalized));
};

export const getGreetingResponse = () => {
  const responses = [
    "Hey! 👋 How can I help you with your orders today?",
    "Hello! 😊 You can ask me about orders, shipments, or warehouses.",
    "Hi there! Ask me anything about your order status.",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

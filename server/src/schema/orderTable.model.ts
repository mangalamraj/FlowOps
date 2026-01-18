import { query } from "../db";

export const createOrderTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          orderId VARCHAR(255) UNIQUE NOT NULL,
          sku VARCHAR(255) NOT NULL,
          warehouse VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL,
          tags JSONB,
          createdAT TIMESTAMP NOT NULL,
          shippedAT TIMESTAMP
        )
      `;
  try {
    await query(createTableQuery);
    console.info("Users table ready!");
  } catch (error: any) {
    console.error("Error while creating the user table", error.message);
    throw error;
  }
};

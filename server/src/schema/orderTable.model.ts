import { query } from "../db";

export const createOrderTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          sku VARCHAR(255),
          warehouse VARCHAR(255),
          status VARCHAR(255),
          createdAT TIMESTAMP,
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

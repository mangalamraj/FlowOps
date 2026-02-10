import { query } from "../db";
import { OrderCsvRow, validateOrdersCsv } from "../validation";

export const getAllOrdersService = async (
  orderid?: string,
  sku?: string,
  warehouse?: string,
  status?: string,
  shippedat?: string,
) => {
  const filterValues = [];
  const whereClause = [];

  if (orderid) {
    filterValues.push(orderid);
    whereClause.push(`orderid = $${filterValues.length}`);
  }

  if (sku) {
    filterValues.push(sku);
    whereClause.push(`sku = $${filterValues.length}`);
  }

  if (warehouse) {
    filterValues.push(warehouse);
    whereClause.push(`warehouse = $${filterValues.length}`);
  }

  if (status) {
    filterValues.push(status);
    whereClause.push(`status = $${filterValues.length}`);
  }

  if (shippedat) {
    filterValues.push(shippedat);
    whereClause.push(`shippedat::date = $${filterValues.length}`);
  }

  const whereSQL =
    whereClause.length > 0 ? `WHERE ${whereClause.join(" AND ")}` : "";

  const dataQuery = `SELECT * FROM orders ${whereSQL} ORDER BY createdat DESC`;
  const countQuery = `
    SELECT
      COUNT(*) FILTER (WHERE status = 'verified')  AS verified,
      COUNT(*) FILTER (WHERE status = 'rules pending')  AS  pending,
      COUNT(*) FILTER (WHERE status = 'not verified')  AS notverified,
      COUNT(*) FILTER (WHERE status = 'failed') AS failed
    FROM orders
    ${whereSQL}
  `;

  const [dataResult, countResult] = await Promise.all([
    query(dataQuery, filterValues),
    query(countQuery, filterValues),
  ]);
  return {
    rows: dataResult.rows,
    counts: countResult.rows[0],
  };
};

export const uploadOrdersService = async (csvData: OrderCsvRow[]) => {
  const { validRows, invalidRows } = validateOrdersCsv(csvData);
  if (validRows.length === 0) {
    throw new Error("CSV contains no valid rows!");
  }
  const columns = [
    "orderid",
    "sku",
    "warehouse",
    "status",
    "createdat",
    "shippedat",
  ];

  const values: any[] = [];
  const placeholders: string[] = [];

  validRows.forEach((order, index) => {
    const baseIndex = index * columns.length;
    placeholders.push(
      `(${columns.map((_, i) => `$${baseIndex + i + 1}`).join(", ")})`,
    );
    values.push(
      order.order_id,
      order.sku,
      order.warehouse,
      order.status,
      order.created_at,
      order.shipped_at || null,
    );
  });
  const dbQuery = `INSERT INTO orders (${columns.join(", ")})
    VALUES ${placeholders.join(", ")}
    ON CONFLICT (orderId)
    DO UPDATE SET
      sku = EXCLUDED.sku,
      warehouse = EXCLUDED.warehouse,
      status = EXCLUDED.status,
      createdAT = EXCLUDED.createdat,
      shippedAT = EXCLUDED.shippedat`;

  //Todo process data
  const data = await query(dbQuery, values);
  return {
    inserted: validRows.length,
    rejected: invalidRows.length,
    invalidRows,
    data: data,
  };
};

export const addTagsService = async (data: any) => {
  const { tags, orderid } = data;
  const dbQuery = `UPDATE orders SET tags = $1::jsonb WHERE orderid = $2`;
  const values = [JSON.stringify(tags), orderid];
  const result = await query(dbQuery, values);
  if (result.rowCount === 0) {
    throw new Error(`Order ${orderid} not found`);
  }
  return result.rowCount;
};

export const getLablesService = async (orderid: string) => {
  const dbQuery = `SELECT tags, sku, status FROM orders WHERE orderid = $1`;
  const result = await query(dbQuery, [orderid]);
  if (result.rowCount == 0) {
    throw new Error(`No orders found with orderid ${orderid}`);
  }
  return result.rows;
};

export const getDimensionService = async (orderid: string) => {
  const dbQuery = `SELECT dimensions FROM orders WHERE orderid = $1`;
  const result = await query(dbQuery, [orderid]);
  if (result.rowCount == 0) {
    throw new Error(`No dimension rules found for orderid ${orderid}`);
  }
  return result.rows;
};

export const changeStatusService = async (orderid: string, status: string) => {
  const dbQuery = `UPDATE orders SET status = $1 WHERE orderid = $2`;
  const result = await query(dbQuery, [status, orderid]);
  if (result.rowCount == 0) {
    throw new Error(`Error while updating the verification status.${orderid}`);
  }
  return result.rows;
};

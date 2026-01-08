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
      COUNT(*) FILTER (WHERE status = 'shipped')  AS shipped,
      COUNT(*) FILTER (WHERE status = 'pending')  AS pending,
      COUNT(*) FILTER (WHERE status = 'delayed')  AS delayed,
      COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
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

import Joi from "joi";

export type OrderCsvRow = {
  order_id: string;
  sku: string;
  warehouse: string;
  status: string;
  created_at: string;
  shipped_at?: string;
};

export type ValidationResult<T> = {
  validRows: T[];
  invalidRows: { row: any; error: string }[];
};

/**
 * Joi schema for a single CSV row
 */
const orderCsvSchema = Joi.object<OrderCsvRow>({
  order_id: Joi.string().trim().required(),
  sku: Joi.string().trim().required(),
  warehouse: Joi.string().trim().required(),
  status: Joi.string()
    .trim()
    .lowercase()
    .valid("pending", "shipped", "delayed", "rejected")
    .required(),
  created_at: Joi.date().iso().required(),
  shipped_at: Joi.date().iso().optional().allow(""),
}).unknown(false);

export const validateOrdersCsv = (
  rows: OrderCsvRow[],
): ValidationResult<OrderCsvRow> => {
  const validRows: OrderCsvRow[] = [];
  const invalidRows: { row: any; error: string }[] = [];

  rows.forEach((row, index) => {
    const { error, value } = orderCsvSchema.validate(row, {
      abortEarly: true,
      convert: true,
    });

    if (error) {
      invalidRows.push({
        row,
        error: `Row ${index + 1}: ${error.details[0].message}`,
      });
    } else {
      validRows.push({
        ...value,
        created_at: new Date(value.created_at).toISOString(),
        shipped_at: value.shipped_at
          ? new Date(value.shipped_at).toISOString()
          : "",
      });
    }
  });

  return { validRows, invalidRows };
};

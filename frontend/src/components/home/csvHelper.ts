export const convertToCSV = (rows: any[]) => {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);

  const escapeValue = (value: any) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const csvRows = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((field) => escapeValue(row[field])).join(","),
    ),
  ];

  return csvRows.join("\n");
};

export async function parseCsv(file) {
  if (!file) {
    return [];
  }

  const text = await file.text();
  const rows = text.trim().split(/\r?\n/).map(line => line.split(','));
  const headers = rows.shift() || [];

  return rows.map(cols => {
    const record = Object.fromEntries(cols.map((value, index) => [headers[index]?.trim(), value?.trim()]));
    return {
      id: `import-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      amount: Number(record.Amount || record.amount || 0),
      description: record.Description || record.description || 'Imported transaction',
      category: record.Category || record.category || 'Business',
      date: record.Date || record.date || new Date().toISOString().slice(0, 10)
    };
  });
}

export async function parsePdf(file) {
  return [{
    id: `pdf-${Date.now()}`,
    amount: 0,
    description: 'PDF parsing is enabled in the full product version.',
    category: 'Personal',
    date: new Date().toISOString().slice(0, 10)
  }];
}

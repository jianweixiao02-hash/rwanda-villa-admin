import Airtable from 'airtable';

// ⚠️ Now using Environment Variables (Safe for production)
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: AIRTABLE_API_KEY,
});

export const base = Airtable.base(AIRTABLE_BASE_ID);

// Helper to fetch any table
export const getTableData = async (tableName) => {
  try {
    const records = await base(tableName).select().all();
    return records.map(record => ({ id: record.id, ...record.fields }));
  } catch (error) {
    console.error(`Error fetching ${tableName}:`, error);
    return [];
  }
};

// Helper to create a record
export const createRecord = async (tableName, fields) => {
  try {
    const record = await base(tableName).create(fields);
    return { id: record.id, ...record.fields };
  } catch (error) {
    console.error(`Error creating record in ${tableName}:`, error);
    throw error;
  }
};
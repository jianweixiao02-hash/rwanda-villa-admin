import Airtable from 'airtable';

// Access the environment variables with the correct NEXT_PUBLIC_ prefix
const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

// If keys are missing, throw a clear error to help debugging
if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  throw new Error("Missing Airtable credentials. Please ensure NEXT_PUBLIC_AIRTABLE_API_KEY and NEXT_PUBLIC_AIRTABLE_BASE_ID are set in .env.local");
}

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
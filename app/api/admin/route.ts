import { NextResponse } from 'next/server';
import { base } from '@/app/lib/airtable';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, table, recordId, data } = body;

    // 1. Handle DELETE actions
    if (action === 'delete') {
      await base(table).destroy(recordId);
      return NextResponse.json({ success: true, message: 'Record deleted successfully' });
    }

    // 2. Handle UPDATE actions (Approve, Complete, Edit)
    if (action === 'update') {
      const updatedRecord = await base(table).update(recordId, data);
      return NextResponse.json({ success: true, message: 'Record updated successfully', record: updatedRecord });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Admin API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process admin request' },
      { status: 500 }
    );
  }
}
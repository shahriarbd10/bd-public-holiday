import { NextResponse } from 'next/server';
import { getHolidays } from '@/lib/data';

export async function GET() {
  const { source, data } = await getHolidays();
  
  if (source === 'error') {
    return NextResponse.json({ error: 'Data not available' }, { status: 500 });
  }
  
  return NextResponse.json({ source, data });
}

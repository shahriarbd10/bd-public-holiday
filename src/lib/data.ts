import fs from 'fs/promises';
import path from 'path';
import { MongoClient } from 'mongodb';

export type Holiday = {
  date: string;
  name: string;
  type: string;
};

export async function getHolidays(): Promise<{ source: string, data: Holiday[] }> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://shahriarsgr_db_user:vHanqPl2hMaKtuVF@publicholidaysbd.abhqoij.mongodb.net/?appName=publicHolidaysBD';
  const dbName = 'bd-holidays-db';
  const collectionName = 'holidays_2026';
  
  let holidays: Holiday[] = [];

  // Attempt to fetch from MongoDB first
  try {
    const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 2000 });
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    holidays = await collection.find({}, { projection: { _id: 0 } }).toArray() as unknown as Holiday[];
    await client.close();

    if (holidays.length > 0) {
      return { source: 'mongodb', data: holidays };
    }
  } catch (error) {
    console.log('MongoDB fallback initiated.');
  }

  // Fallback: Read from local CSV
  try {
    const csvPath = path.join(process.cwd(), 'holidays.csv');
    const fileContent = await fs.readFile(csvPath, 'utf-8');
    
    const lines = fileContent.trim().split('\n');
    
    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        if (currentLine.length >= 2) {
            holidays.push({
                date: currentLine[0].trim(),
                name: currentLine[1].trim(),
                type: currentLine.slice(2).join(',').trim() || 'Public Holiday',
            });
        }
    }

    return { source: 'csv', data: holidays };
  } catch (error) {
    console.error('Failed to read CSV fallback:', error);
    return { source: 'error', data: [] };
  }
}

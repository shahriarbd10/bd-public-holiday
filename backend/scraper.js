const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const url = 'https://www.officeholidays.com/countries/bangladesh/2026';
const csvPath = path.join(__dirname, '../holidays.csv');

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://shahriarsgr_db_user:vHanqPl2hMaKtuVF@publicholidaysbd.abhqoij.mongodb.net/?appName=publicHolidaysBD';
const dbName = 'bd-holidays-db';
const collectionName = 'holidays_2026';

async function scrapeHolidays() {
  console.log(`Fetching data from ${url}...`);
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const holidays = [];

    $('.country-table tbody tr').each((index, element) => {
      // OfficeHolidays typical structure: Day, Date, Holiday Name, Type, Comments
      const cols = $(element).find('td');
      if (cols.length >= 3) {
        const dateStr = $(cols[1]).text().trim();
        const dateParsed = new Date(`${dateStr} 2026`); // Hacky parsing for standard dates
        const name = $(cols[2]).text().trim();
        const type = $(cols[3]).text().trim() || 'Public Holiday';
        
        if (name) {
          holidays.push({
            date: dateStr,
            name: name,
            type: type
          });
        }
      }
    });

    console.log(`Scraped ${holidays.length} holidays.`);
    return holidays;
  } catch (error) {
    console.error('Error fetching/parsing webpage:', error);
    return [];
  }
}

async function saveToCSV(data) {
  const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: [
      { id: 'date', title: 'Date' },
      { id: 'name', title: 'Holiday Name' },
      { id: 'type', title: 'Type' }
    ]
  });

  await csvWriter.writeRecords(data);
  console.log(`Saved successfully to ${csvPath}`);
}

async function syncToMongoDB(data) {
  if (data.length === 0) return;
  
  console.log(`Connecting to MongoDB at ${mongoUri}...`);
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('Connected correctly to server');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Clear existing data for 2026 before inserting
    await collection.deleteMany({});
    
    // Insert new crawled data
    const result = await collection.insertMany(data);
    console.log(`Successfully inserted ${result.insertedCount} documents into MongoDB`);
    
  } catch (err) {
    console.error('MongoDB sync failed. Please ensure MongoDB is running locally or MONGODB_URI is provided in .env.', err.message);
  } finally {
    await client.close();
  }
}

async function run() {
  const data = await scrapeHolidays();
  if (data.length > 0) {
    await saveToCSV(data);
    await syncToMongoDB(data);
  } else {
    console.log('No data found, exiting.');
  }
}

run();

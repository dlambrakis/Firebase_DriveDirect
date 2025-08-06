require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });
const fs = require('fs');
const { parse } = require('csv-parse');
const { createClient } = require('@supabase/supabase-js');

const CSV_FILE_PATH = '/home/project/data/Car Database.csv';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in .env file.');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Splits a string by '/' and trims each resulting item.
 * Returns an array of strings. Returns an empty array if input is null or empty.
 * @param {string | null} value - The string to split.
 * @returns {string[]} An array of processed strings.
 */
function splitAndTrim(value) {
  if (!value) {
    return [];
  }
  return value.split('/').map(item => item.trim()).filter(Boolean);
}

async function ingestData() {
  console.log('Starting vehicle data ingestion with new schema...');

  const parser = fs.createReadStream(CSV_FILE_PATH).pipe(
    parse({
      delimiter: ';',
      columns: true,
      skip_empty_lines: true,
    })
  );

  let successfulIngestions = 0;
  let failedIngestions = 0;
  let rowCounter = 0;

  console.log(`Processing rows from ${CSV_FILE_PATH}...`);

  for await (const row of parser) {
    rowCounter++;
    try {
      const params = {
        p_make: row['Make'] || null,
        p_model: row['Model'] || null,
        p_variant: row['Variant'] || null,
        p_start_year: row['Start Year'] ? parseInt(row['Start Year'], 10) : null,
        p_end_year: row['End Year'] ? parseInt(row['End Year'], 10) : null,
        p_doors: splitAndTrim(row['Doors']),
        p_drivetrains: splitAndTrim(row['Drivetrain']),
        p_body_types: splitAndTrim(row['Body Type']),
        p_engine_sizes: splitAndTrim(row['Engine Size']),
        p_aspirations: splitAndTrim(row['Aspiration']),
        p_fuel_types: splitAndTrim(row['Fuel Type']),
        p_transmission_types: splitAndTrim(row['Transmission Type']),
      };

      // Validate essential data
      if (!params.p_make || !params.p_model || !params.p_start_year) {
        throw new Error('Missing essential data: Make, Model, or Start Year.');
      }

      const { data, error } = await supabase.rpc('ingest_vehicle_from_csv_row', params);

      if (error) {
        throw error;
      }
      
      successfulIngestions++;
      console.log(`[Row ${rowCounter}] Ingested: ${row['Start Year']} ${row['Make']} ${row['Model']}`);

    } catch (error) {
      failedIngestions++;
      console.error(`[Row ${rowCounter}] Failed to ingest row. Error: ${error.message}`);
      console.error('Problematic Row Data:', row);
    }
  }

  console.log('\n--- Ingestion Complete ---');
  console.log(`Total rows processed:    ${rowCounter}`);
  console.log(`Successfully ingested:   ${successfulIngestions} vehicles.`);
  console.log(`Failed ingestions:       ${failedIngestions} vehicles.`);
  console.log('--------------------------');
}

ingestData().catch(console.error);

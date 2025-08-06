require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });
const fs = require('fs');
const { parse } = require('csv-parse');
const { createClient } = require('@supabase/supabase-js');

const CSV_FILE_PATH = '/home/project/data/Locations-za.csv';
const COUNTRY_TO_PROCESS = 'South Africa';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Role Key must be provided in .env file.');
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestData() {
  console.log('Starting location data ingestion with aligned Node.js process...');

  // Step 1: Deactivate existing data for the specified country
  console.log(`Step 1: Deactivating all existing location data for '${COUNTRY_TO_PROCESS}'...`);
  const { error: rpcError } = await supabase.rpc('deactivate_location_data_by_country_name', {
    p_country_name: COUNTRY_TO_PROCESS
  });

  if (rpcError) {
    console.error(`Critical error during deactivation for '${COUNTRY_TO_PROCESS}'. Aborting.`, rpcError);
    return;
  }
  console.log("✔ Deactivation complete.");

  // Step 2: Process and ingest new data from CSV
  console.log(`\nStep 2: Processing data from ${CSV_FILE_PATH}...`);
  const parser = fs.createReadStream(CSV_FILE_PATH).pipe(
    parse({
      delimiter: ';',
      from_line: 2, // Skip header row
      relax_column_count: true,
    })
  );

  let successfulIngestions = 0;
  let failedIngestions = 0;
  let skippedRows = 0;
  let rowCounter = 0;
  const uniqueSuburbKeys = new Set();

  for await (const row of parser) {
    rowCounter++;
    try {
      const [countryName, provinceName, cityName, suburbName, boxCode, streetCode] = row;

      // Validate essential data
      if (!countryName || !provinceName || !cityName || !suburbName) {
        console.warn(`[Row ${rowCounter}] Skipping incomplete row:`, row);
        skippedRows++;
        continue;
      }
      
      const uniqueKey = `${suburbName.trim()}:${cityName.trim()}:${provinceName.trim()}`;
      if (uniqueSuburbKeys.has(uniqueKey)) {
        skippedRows++;
        continue; // Skip duplicate within the source file
      }
      uniqueSuburbKeys.add(uniqueKey);

      const params = {
        p_country_name: countryName.trim(),
        p_province_name: provinceName.trim(),
        p_city_name: cityName.trim(),
        p_suburb_name: suburbName.trim(),
        p_box_code: boxCode ? boxCode.trim() : null,
        p_street_code: streetCode ? streetCode.trim() : null,
      };

      const { error } = await supabase.rpc('ingest_location_from_csv_row', params);

      if (error) {
        throw error;
      }
      
      successfulIngestions++;
      if (rowCounter % 100 === 0) {
        process.stdout.write(` -> Processed ${rowCounter} records...\r`);
      }

    } catch (error) {
      failedIngestions++;
      console.error(`\n[Row ${rowCounter}] Failed to ingest row. Error: ${error.message}`);
      console.error('Problematic Row Data:', row);
    }
  }

  console.log('\n\n--- Ingestion Complete ---');
  console.log(`Total rows processed:    ${rowCounter}`);
  console.log(`Successfully ingested:   ${successfulIngestions} locations.`);
  console.log(`Skipped rows (incomplete or duplicate): ${skippedRows}`);
  console.log(`Failed ingestions:       ${failedIngestions} locations.`);
  console.log('--------------------------');
}

ingestData().catch(console.error);

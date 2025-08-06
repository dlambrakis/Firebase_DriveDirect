require('dotenv').config();
    const { createClient } = require('@supabase/supabase-js');

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Error: SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_KEY must be set in .env file.");
      process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const featuresToPopulate = [
      'Air Conditioning',
      'Alloy Wheels',
      'Touch Screen Radio',
      'Built in GPS Navigation',
      'Apple Car Play',
      'Android Auto',
      'Leather Seats',
      'Parking Sensors Rear',
      'Parking Sensors Front',
      '360 View Camera',
      'Sunroof',
			'Tow Bar',
    ];

    async function populateFeatures() {
      console.log('Starting to populate standard vehicle features...');

      const recordsToUpsert = featuresToPopulate.map(name => ({ name }));

      const { data, error } = await supabase
        .from('features')
        .upsert(recordsToUpsert, { onConflict: 'name', ignoreDuplicates: false })
        .select();

      if (error) {
        console.error('Error populating features:', error);
        return;
      }

      console.log(`Successfully upserted ${data.length} features.`);
      console.log('Feature population complete.');
    }

    populateFeatures().catch(console.error);

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// Load your Supabase URL and SERVICE ROLE KEY (not the anon key)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Load mock data
const mockData = JSON.parse(fs.readFileSync("dummyData.json", "utf8"));

async function insertData() {
  const { events } = mockData;

  // Insert data in batches
  const batchSize = 100;
  for (let i = 0; i < events.length; i += batchSize) {
    const batch = events.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from("analytics_events")
      .insert(batch);

    if (error) {
      console.error("Error inserting batch:", error);
    } else {
      console.log(`Inserted batch ${i / batchSize + 1}`);
    }
  }

  console.log("Data insertion complete");
  console.log("Mock API Key:", mockData.mockApiKey);
}

insertData();

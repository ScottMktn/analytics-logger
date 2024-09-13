const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// Load your Supabase URL and SERVICE ROLE KEY (not the anon key)
const supabaseUrl = "https://lfldqjgvjvzvdanqwuxw.supabase.co";
const supabaseServiceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbGRxamd2anZ6dmRhbnF3dXh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTkwNzA4MCwiZXhwIjoyMDQxNDgzMDgwfQ.QZlaNkNEnYEFrpV7kzkwq8WQTlp1lTz9oXBJ2vfO2bU";

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Load mock data
const mockData = JSON.parse(fs.readFileSync("dummyData.json", "utf8"));

async function insertData() {
  const { events } = mockData;

  // dummy api key: mock_b2a74d98a1ff6268e01ae447c4064a60

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

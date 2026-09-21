import * as fs from "fs";

// Helper function to write CSV file with dynamic columns
export async function writeToCSV(
  data: Array<Record<string, string | number>>,
  filename: string = "scraped_data.csv",
) {
  if (data.length === 0) {
    console.warn("No data to write to CSV");
    return;
  }

  // Extract column headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV header row
  let csvContent = headers.map((h) => `"${h}"`).join(",") + "\n";

  // Add data rows
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = (row[header] ?? "N/A").toString().replace(/"/g, '""'); // Escape quotes
      return `"${value}"`;
    });
    csvContent += values.join(",") + "\n";
  });

  // Write to file
  const filepath = `${process.cwd()}/${filename}`;
  fs.writeFileSync(filepath, csvContent, "utf-8");
  // console.log(`✅ CSV file written to: ${filepath}`);
  // console.log(`📊 Total items scraped: ${data.length}`);
  // console.log(`📋 Columns: ${headers.join(", ")}`);
}

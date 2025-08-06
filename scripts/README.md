# Data Ingestion Scripts

This directory contains scripts for managing and populating the database.

## `ingest-vehicle-data.js`

This is a robust, idempotent script designed to synchronize the vehicle data from a source CSV file (`Car Database.csv`) with the PostgreSQL database.

### Features

- **Idempotent:** The script can be run multiple times without creating duplicate entries or causing errors.
- **Transactional:** The entire operation is wrapped in a single database transaction. If any part fails, all changes are rolled back, ensuring data integrity.
- **Soft Deletion:** Records that exist in the database but are no longer in the CSV file are marked as inactive (`is_active = false`) rather than being deleted.
- **Normalization:** The script populates a normalized schema, creating records in various lookup tables (e.g., `vehicle_makes`, `vehicle_models`, `vehicle_body_types`) and linking them correctly in the `vehicle_variants` table.
- **Performance:** Uses bulk operations where possible to efficiently process large datasets.

### Configuration

The script requires the following environment variables to be set in a `.env` file in the project root:

```env
# .env

# Full database connection string for Prisma.
# This should be the connection string that allows migrations.
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-DB-HOST]:5432/postgres"

# Direct connection URL for Prisma, bypassing connection pooling (often required for migrations/long-running scripts).
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-DB-HOST]:6543/postgres"

# (Optional) Path to the vehicle data CSV file.
# Defaults to './Car Database.csv' relative to the project root.
# VEHICLE_DATA_PATH="/path/to/your/Car Database.csv"
```

**Note:** Replace `[YOUR-PASSWORD]` and `[YOUR-DB-HOST]` with your actual Supabase database credentials.

### Execution

To run the script, use the following command from the project root:

```bash
node scripts/ingest-vehicle-data.js
```

The script will log its progress through several steps:
1.  Deactivating all existing data.
2.  Parsing the CSV file.
3.  Upserting data into lookup tables.
4.  Upserting makes and models.
5.  Upserting vehicle variants.

Upon successful completion, it will print a confirmation message. If an error occurs, the transaction will be rolled back, and an error message will be displayed.

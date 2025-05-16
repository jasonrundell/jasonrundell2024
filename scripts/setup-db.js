require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

async function executeQuery(supabase, query) {
  // Split the query into individual statements
  const statements = query
    .split(';')
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);

  // Execute each statement
  for (const statement of statements) {
    if (!statement) continue;
    console.log('Executing:', statement.substring(0, 100) + (statement.length > 100 ? '...' : ''));
    
    try {
      const { error } = await supabase.rpc('pg_temp.execute_sql', { query: statement });
      if (error) throw error;
    } catch (error) {
      // If the function doesn't exist, create it and retry
      if (error.message.includes('function pg_temp.execute_sql(unknown) does not exist')) {
        console.log('Creating temporary execute_sql function...');
        const createFunctionSql = `
          create or replace function pg_temp.execute_sql(query text) 
          returns void as $$
          begin
            execute query;
          end;
          $$ language plpgsql;
        `;
        await supabase.rpc('pg_temp.execute_sql', { query: createFunctionSql });
        
        // Retry the original statement
        const { error: retryError } = await supabase.rpc('pg_temp.execute_sql', { query: statement });
        if (retryError) throw retryError;
      } else {
        throw error;
      }
    }
  }
}

async function setupDatabase() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );

    console.log('Connected to Supabase');

    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'src', 'lib', 'db', 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');

    // Execute the schema
    await executeQuery(supabase, schema);
    
    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

async function runSetup() {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });

    console.log('Connected to Supabase');

    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'src', 'lib', 'db', 'schema.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');

    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 100) + '...');
      const { error } = await supabase.rpc('pg_temp.execute_sql', { query: statement });
      
      if (error) {
        // If the function doesn't exist, create it
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

    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

runSetup();

# Running the Database Migration

Since this project shares the same Supabase project as daggergm, you need to run the database migration to create the LJDND-specific tables.

## Option 1: Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/ogvbbfzfljglfanceest/editor)
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `supabase/migrations/20250106000000_initial_schema.sql`
5. Paste into the SQL Editor
6. Click "Run" or press Cmd/Ctrl + Enter

## Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link to the existing project
supabase link --project-ref ogvbbfzfljglfanceest

# Run migrations
supabase db push
```

## Tables Created

The migration will create the following tables in your shared Supabase database:

- `chat_rooms` - Chat room metadata
- `chat_room_participants` - User participation in rooms
- `messages` - Chat messages
- `dice_rolls` - Dice roll details
- `profiles` - User profiles (if not already exists)

All tables have Row Level Security (RLS) enabled with proper policies to ensure users can only access their own data.

## Verification

After running the migration, verify the tables were created:

1. Go to Supabase Dashboard > Table Editor
2. You should see the new LJDND tables listed
3. Check that RLS is enabled (green shield icon)

## Note on Shared Database

This project shares the Supabase database with daggergm. The tables are separate and won't conflict. Both projects can coexist in the same database without issues.

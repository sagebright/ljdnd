#!/bin/bash

# LJDND Database Migration Script
# This script runs the database migration using the Supabase SQL file

echo "Running LJDND database migration..."
echo "This will create tables with dndchat_ prefix in your Supabase database"
echo ""

# Read the SQL file
SQL_FILE="supabase/migrations/20250106000001_dndchat_schema.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo "Error: Migration file not found at $SQL_FILE"
    exit 1
fi

echo "Migration file found: $SQL_FILE"
echo ""
echo "To run this migration, you have two options:"
echo ""
echo "Option 1: Supabase Dashboard (Recommended)"
echo "1. Go to: https://supabase.com/dashboard/project/ogvbbfzfljglfanceest/sql"
echo "2. Click 'New Query'"
echo "3. Copy the contents of $SQL_FILE"
echo "4. Paste and click 'Run'"
echo ""
echo "Option 2: Supabase CLI"
echo "1. Install Supabase CLI: npm install -g supabase"
echo "2. Link project: supabase link --project-ref ogvbbfzfljglfanceest"
echo "3. Run migrations: supabase db push"
echo ""
echo "The migration will create the following tables:"
echo "  - dndchat_chat_rooms"
echo "  - dndchat_chat_room_participants"
echo "  - dndchat_messages"
echo "  - dndchat_dice_rolls"
echo "  - dndchat_profiles"
echo ""
echo "All tables will have Row Level Security (RLS) enabled with proper policies."

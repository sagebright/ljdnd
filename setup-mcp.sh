#!/bin/bash

echo "LJDND MCP Setup Script"
echo "======================"
echo ""

# Check if .mcp.json exists
if [ ! -f .mcp.json ]; then
    echo "Error: .mcp.json not found!"
    exit 1
fi

echo "This script will help you configure the MCP servers."
echo ""

# Supabase Access Token
echo "1. Supabase Access Token"
echo "   Get it from: https://supabase.com/dashboard/account/tokens"
read -p "   Enter your Supabase access token: " SUPABASE_TOKEN

# GitHub Token
echo ""
echo "2. GitHub Personal Access Token"
echo "   Get it from: https://github.com/settings/tokens"
echo "   Required scopes: repo, workflow"
read -p "   Enter your GitHub token: " GITHUB_TOKEN

# Update .mcp.json
cat > .mcp.json << EOF
{
  "mcpServers": {
    "supabase": {
      "type": "stdio",
      "command": "node",
      "args": ["./node_modules/@supabase/mcp-server-supabase/dist/transports/stdio.js"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "$SUPABASE_TOKEN"
      }
    },
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "$GITHUB_TOKEN",
        "GITHUB_OWNER": "sagebright",
        "GITHUB_REPO": "ljdnd"
      }
    },
    "vercel": {
      "type": "http",
      "url": "https://mcp.vercel.com/"
    }
  }
}
EOF

echo ""
echo "✓ MCP configuration updated successfully!"
echo ""
echo "Note: .mcp.json is gitignored for security."
echo ""

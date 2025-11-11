#!/bin/bash
# Fix Cached MCP Server Configuration in ~/.claude.json for ljdnd
# This fixes the most common MCP connection issue

set -e  # Exit on error

echo "🔧 Fixing Cached MCP Configuration for ljdnd in ~/.claude.json..."
echo ""

# Read tokens from .mcp.json
SUPABASE_TOKEN=$(grep -o '"SUPABASE_ACCESS_TOKEN": "[^"]*"' .mcp.json | cut -d'"' -f4)
GH_TOKEN=$(grep -o '"GITHUB_TOKEN": "[^"]*"' .mcp.json | cut -d'"' -f4)

if [ -z "$SUPABASE_TOKEN" ]; then
    echo "❌ ERROR: SUPABASE_ACCESS_TOKEN not found in .mcp.json"
    exit 1
fi

if [ -z "$GH_TOKEN" ]; then
    echo "❌ ERROR: GITHUB_TOKEN not found in .mcp.json"
    exit 1
fi

echo "✅ Found tokens in .mcp.json"
echo ""

# Backup ~/.claude.json
if [ -f ~/.claude.json ]; then
    echo "📦 Backing up ~/.claude.json to ~/.claude.json.backup.ljdnd"
    cp ~/.claude.json ~/.claude.json.backup.ljdnd
fi

# Run Python script to update cached config
echo "📝 Updating cached MCP configuration..."

python3 << EOF
import json
import os

# Read the cached state file
claude_config_path = os.path.expanduser('~/.claude.json')
with open(claude_config_path, 'r') as f:
    config = json.load(f)

# Ensure projects key exists
if 'projects' not in config:
    config['projects'] = {}

# Ensure ljdnd project exists
project_path = '/Users/jmfk/Repos/ljdnd'
if project_path not in config['projects']:
    config['projects'][project_path] = {}

project = config['projects'][project_path]

# Ensure mcpServers exists
if 'mcpServers' not in project:
    project['mcpServers'] = {}

# Update all three MCP servers
project['mcpServers']['supabase'] = {
    "type": "stdio",
    "command": "node",
    "args": [
        "./node_modules/@supabase/mcp-server-supabase/dist/transports/stdio.js"
    ],
    "env": {
        "SUPABASE_ACCESS_TOKEN": "$SUPABASE_TOKEN"
    }
}

project['mcpServers']['github'] = {
    "type": "stdio",
    "command": "npx",
    "args": [
        "@modelcontextprotocol/server-github"
    ],
    "env": {
        "GITHUB_TOKEN": "$GH_TOKEN",
        "GITHUB_OWNER": "sagebright",
        "GITHUB_REPO": "ljdnd"
    }
}

project['mcpServers']['vercel'] = {
    "type": "http",
    "url": "https://mcp.vercel.com/"
}

# Write back
with open(claude_config_path, 'w') as f:
    json.dump(config, f, indent=2)

print("✅ Updated cached MCP configuration for ljdnd")
EOF

echo ""
echo "🎉 Cached MCP Configuration Fixed!"
echo ""
echo "Next Steps:"
echo "1. Restart Claude Code completely"
echo "2. Run: /mcp"
echo "3. All three servers should now show as connected:"
echo "   ✓ Supabase MCP Server"
echo "   ✓ GitHub MCP Server"
echo "   ✓ Vercel MCP Server"
echo ""
echo "If still failing, check:"
echo "   - Supabase MCP package installed: ls node_modules/@supabase/mcp-server-supabase/"
echo "   - GitHub MCP package: npx @modelcontextprotocol/server-github --version"
echo ""

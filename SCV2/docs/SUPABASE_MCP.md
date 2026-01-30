# Supabase MCP (Cursor)

Supabase is ready. To use the Supabase MCP server in Cursor (query DB, list tables, etc.):

**Add this to Cursor MCP settings** (Cursor → Settings → MCP, or your MCP config):

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=ncwubhefvxmojxseryjo"
    }
  }
}
```

- **Project ref:** `ncwubhefvxmojxseryjo`
- You may need to sign in / authorize the MCP in Cursor when first using it.

For **Medusa backend** you still use the **Postgres connection URI** from Supabase (Settings → Database), not the MCP URL. The MCP is for Cursor talking to Supabase; Medusa uses `DATABASE_URL` (the Postgres URI with your password).

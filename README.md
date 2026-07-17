# DDI Analytics — Ingestion API

Multi-tenant Vercel + Neon Postgres ingestion API for DDI Inform ERP nightly data exports.

Parses pipe-delimited `.txt` files from the client's PICK/Universe server and upserts into Neon PostgreSQL with tenant isolation.

## Architecture

```
PICK/Universe Server                Vercel (this project)             Neon PostgreSQL
      │                                   │                              │
      ├─ Export 22 .txt files ─►   POST /api/ingest ──►   22 tenant-scoped tables
      │      (pipe-delimited)      (parse + batch upsert)          (all TEXT cols)
      │                                   │
      └─ ddi-upload.sh (curl)     GET  /api/query  ──►   Dashboard data queries
                                    GET  /api/health ──►   Monitoring
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `API_KEY` | Yes | Shared secret for x-api-key auth |

## Quick Deploy to Vercel

```bash
cd ddi-api
vercel deploy

# Set environment variables in Vercel dashboard:
vercel env add DATABASE_URL
vercel env add API_KEY
```

## API Endpoints

### POST /api/ingest — Ingest a DDI export file

```bash
curl -X POST https://your-app.vercel.app/api/ingest \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -H "x-tenant-id: yandb" \
  -d '{
    "filename": "NTE_GL_GROUP.txt",
    "content": "GROUP|DESC|REPORTS\nASSETS|Cash and equivalents|Balance Sheet\nLIAB|Accounts Payable|Balance Sheet"
  }'
```

Response:
```json
{ "success": true, "table": "nte_gl_group", "rows_inserted": 2, "duration_ms": 45 }
```

### GET /api/health — Health check

```bash
curl https://your-app.vercel.app/api/health
# { "status": "ok", "timestamp": "2026-07-17T14:30:00.000Z" }
```

### GET /api/query — Dashboard data queries

```bash
# List available endpoints
curl "https://your-app.vercel.app/api/query?x-api-key=key"

# GL summary
curl "https://your-app.vercel.app/api/query?endpoint=gl-summary&tenant_id=yandb" \
  -H "x-api-key: your-api-key"

# AR aging
curl "https://your-app.vercel.app/api/query?endpoint=ar-aging&tenant_id=yandb" \
  -H "x-api-key: your-api-key"

# Sales orders
curl "https://your-app.vercel.app/api/query?endpoint=sales&tenant_id=yandb" \
  -H "x-api-key: your-api-key"
```

Available endpoints: `gl-summary`, `gl-balances`, `inventory`, `inventory-value`, `ar-aging`, `ap-aging`, `sales`, `sales-detail`, `invoices`, `quotes`, `po`, `ar-payments`, `ap-payments`, `transfers`, `converted`, `po-links`, `po-receipts`, `terms`, `finrep`

## Client Upload Script

The companion script `ddi-upload.sh` runs on the client's PICK/Universe server. It:
1. Loops through 22 DDI export files
2. Base64-encodes each file
3. POSTs to this API via curl
4. Logs success/failure per file

See the deployment guide for the full bash script and crontab setup.

## Project Structure

```
ddi-api/
├── package.json          # pg dependency
├── vercel.json           # 60s timeout for ingest
├── lib/
│   ├── db.js             # Neon connection pool (auto-strips channel_binding)
│   └── table-map.js      # 22 filename → table name mappings
├── api/
│   ├── ingest.js         # POST — file ingestion (DELETE+INSERT, batch 500)
│   ├── query.js          # GET  — 19 predefined dashboard queries
│   └── health.js         # GET  — uptime monitoring
└── README.md             # This file
```

## Notes

- **Idempotent:** Re-sending the same file replaces existing rows for that tenant (DELETE + INSERT)
- **Batch size:** 500 rows per INSERT statement
- **Column names:** Normalized from DDI headers (lowercase, `#` → `_num`, `.` → `_`, spaces → `_`)
- **SSL:** Neon requires SSL — the pool uses `rejectUnauthorized: false` for compatibility
- **channel_binding:** The pg driver doesn't support `channel_binding=require` — the db.js pool automatically strips it

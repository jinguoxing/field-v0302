# Semantic Config Backend (go-zero)

This service backs the **Type Dictionary / Role Dictionary / Naming Rules (D1)** tabs.

It provides:
- Config versioning (DRAFT / PUBLISHED)
- CRUD (bulk replace) for type dictionary, role dictionary, naming rules
- Validate
- Simulate (D1 rule match -> type/role TopK + evidence list)

## Tech
- Go + go-zero REST
- MySQL (DDL in `migrations/001_semantic_config.sql`)
- JSON fields for rule deltas

## Quickstart
1) Create database and run migration:
```bash
mysql -uroot -p < migrations/001_semantic_config.sql
```

2) Configure env:
```bash
export SEMCFG_MYSQL_DSN='root:pass@tcp(127.0.0.1:3306)/semantic_config?charset=utf8mb4&parseTime=true&loc=Local'
```

3) Run:
```bash
go mod tidy
go run cmd/api/main.go -f etc/semanticconfig.yaml
```

Server listens on `:8899` by default.

## Notes
- `simulate` currently focuses on **Naming Rules (D1)**. Other dimensions can be plugged into the engine later.

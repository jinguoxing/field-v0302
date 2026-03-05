# Curl examples

## List versions
```bash
curl -s http://localhost:8899/api/semantic/config/versions | jq
```

## Put naming rules
```bash
curl -s -X PUT http://localhost:8899/api/semantic/config/versions/1/naming-rules \
  -H 'Content-Type: application/json' \
  -d '{
    "items":[
      {"rule_id":"nr_0001","enabled":true,"priority":100,"scope":"FIELD","regex":"(?i)_id$","title":"后缀 _id => ID/PK/FK 提升",
       "type_delta":{"ID":0.4,"CODE":0.1,"UNKNOWN":-0.1},
       "role_delta":{"PRIMARY_KEY":0.2,"FOREIGN_KEY":0.2,"IGNORE":-0.2}}
    ]
  }' | jq
```

## Simulate
```bash
curl -s -X POST http://localhost:8899/api/semantic/config/versions/1/simulate \
  -H 'Content-Type: application/json' \
  -d '{"field_name":"user_id","table_name":"t_user","comment":"用户主键"}' | jq
```

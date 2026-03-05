# Semantic Config Editor (Type/Role Dictionary + Naming Rules)

This package contains a runnable React 18 + TSX skeleton for configuring:
- Type Dictionary
- Role Dictionary
- Naming Rules (D1)

It includes:
- Left tabs
- Left entity list (types/roles/rules)
- Center editor (editable forms)
- Right live simulation panel (mocked)

## Integrate
Mount `ConfigEditor` at: `/semantic/config/:versionId/editor`

Replace `mockApi.ts` with real APIs:
- updateSection(domain payload)
- validateVersion
- simulate

Tailwind classes are used for UI styling.

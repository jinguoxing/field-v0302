# Semantic Config Editor (Rule & Score Studio) - TSX Package

This package contains a runnable React 18 + TSX skeleton for the **Config Editor** you described.
It includes editable tabs for:

- Profile (D2)
- Metadata (D3)
- Usage (D4)
- Standards (D5)
- Consistency (D6 + D7)
- Compat Matrix (Type ↔ Role)
- Ignore + LLM

It also keeps working examples for:
- Weights & Thresholds
- Naming Rules (D1)

## How to integrate
1) Copy `ConfigEditor.tsx` and `components/*` into your frontend repo.
2) Ensure Tailwind is available (the UI uses Tailwind utility classes).
3) Add a route like:
   - `/semantic/config/:versionId/editor` -> `<ConfigEditor />`
4) Replace `mockApi.ts` with your real APIs:
   - updateSection, validateVersion, simulate, etc.

## Notes
- This is intentionally dependency-light (no drag&drop libs, no JSON editor libs).
- JSON fields use a text-area editor with parse validation.
- Compat matrix editor uses "add/remove" lists (not drag).

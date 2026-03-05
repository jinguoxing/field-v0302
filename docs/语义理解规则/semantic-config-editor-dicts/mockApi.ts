import { SimulationSampleRef, SimulationResult, ConfidenceLevel } from "./types";

function level(conf: number): ConfidenceLevel {
  if (conf >= 0.85) return "HIGH";
  if (conf >= 0.6) return "MED";
  return "LOW";
}

export async function simulate(versionId: string, draftConfig: any, sample: SimulationSampleRef): Promise<SimulationResult> {
  const rules = draftConfig?.domains?.["rules.naming"]?.patterns || [];
  const enabledCount = rules.filter((r: any) => r.enabled).length;

  const base = Math.min(0.95, 0.55 + enabledCount * 0.03);
  const top1 = Math.min(0.95, base + 0.2);
  const top2 = Math.max(0.05, top1 - 0.12);
  const gap = Math.max(0.02, Math.min(0.3, top1 - top2));

  return {
    typeTop3: [
      { type: "DATETIME", confidence: top1, level: level(top1) },
      { type: "DATE", confidence: top2, level: level(top2) },
      { type: "UNKNOWN", confidence: 0.25, level: "LOW" }
    ],
    roleTop3: [
      { role: "EVENT_TIME", confidence: Math.max(0.05, top1 - 0.05), level: level(Math.max(0.05, top1 - 0.05)) },
      { role: "AUDIT_FIELD", confidence: Math.max(0.05, top2 - 0.05), level: level(Math.max(0.05, top2 - 0.05)) },
      { role: "DIMENSION", confidence: 0.3, level: "LOW" }
    ],
    jointTop3: [
      { semanticType: "DATETIME", role: "EVENT_TIME", confidence: top1, confidenceLevel: level(top1), gap12: gap },
      { semanticType: "DATETIME", role: "AUDIT_FIELD", confidence: top2, confidenceLevel: level(top2), gap12: gap },
      { semanticType: "UNKNOWN", role: "DIMENSION", confidence: 0.18, confidenceLevel: "LOW", gap12: gap }
    ],
    completeness: 0.82,
    gap12: gap,
    ignoreScore: 0.08,
    queue: gap < 0.1 ? "CONFLICT" : top1 >= 0.85 ? "AUTO_PASS" : "NEEDS_CONFIRM",
    evidenceTop3: [
      { evidenceId: "ev_1", dimension: "NAMING", source: "RULE", title: "命名规则命中（mock）", contribution: 0.12, keySignals: { enabledRules: enabledCount } },
      { evidenceId: "ev_2", dimension: "PROFILE", source: "RULE", title: "画像证据（mock）", contribution: 0.1, keySignals: { nonNullRate: 0.99 } },
      { evidenceId: "ev_3", dimension: "USAGE", source: "RULE", title: "血缘证据（mock）", contribution: 0.08, keySignals: { joinCount: 12 } }
    ]
  };
}

export async function updateSection(versionId: string, domain: string, payload: any): Promise<void> {
  return;
}

export async function validateVersion(versionId: string): Promise<{ ok: boolean; errors?: string[]; warnings?: string[] }> {
  return { ok: true };
}

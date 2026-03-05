import { SimulationSampleRef, SimulationResult, ConfidenceLevel } from "./types";

function level(conf: number): ConfidenceLevel {
  if (conf >= 0.85) return "HIGH";
  if (conf >= 0.6) return "MED";
  return "LOW";
}

export async function simulate(versionId: string, draftConfig: any, sample: SimulationSampleRef): Promise<SimulationResult> {
  // This is a deterministic-ish mock based on tau/alpha so you can see changes in UI.
  const tau = draftConfig?.domains?.weights?.softmax?.tau ?? 0.7;
  const alpha = draftConfig?.domains?.weights?.joint?.alpha ?? 0.55;

  const base = Math.max(0.1, Math.min(0.95, 1 - (tau - 0.5) * 0.4));
  const top1 = base * (0.6 + alpha * 0.3);
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
      { semanticType: "DATETIME", role: "EVENT_TIME", confidence: top1, confidenceLevel: level(top1), gap12: gap, evidenceRefs: ["ev_1","ev_2","ev_3"] },
      { semanticType: "DATETIME", role: "AUDIT_FIELD", confidence: top2, confidenceLevel: level(top2), gap12: gap, evidenceRefs: ["ev_2"] },
      { semanticType: "UNKNOWN", role: "DIMENSION", confidence: 0.18, confidenceLevel: "LOW", gap12: gap }
    ],
    completeness: 0.82,
    gap12: gap,
    ignoreScore: 0.08,
    queue: gap < 0.1 ? "CONFLICT" : top1 >= 0.85 ? "AUTO_PASS" : "NEEDS_CONFIRM",
    evidenceTop3: [
      { evidenceId: "ev_1", dimension: "NAMING", source: "RULE", title: "命名命中 created_at", contribution: 0.12, keySignals: { hit: "created_at" } },
      { evidenceId: "ev_2", dimension: "PROFILE", source: "RULE", title: "非空率高", contribution: 0.1, keySignals: { nonNullRate: 0.99 } },
      { evidenceId: "ev_3", dimension: "USAGE", source: "RULE", title: "常用于时间范围过滤", contribution: 0.08, keySignals: { timeRangeFilterCnt: 18 } }
    ],
    breakdownByDimension: [
      { key: "NAMING", contributionTop1: 0.12 },
      { key: "PROFILE", contributionTop1: 0.1 },
      { key: "USAGE", contributionTop1: 0.08 }
    ],
    breakdownByRule: [
      { key: "audit_created_at", contributionTop1: 0.12, notes: "regex hit" },
      { key: "suffix__id", contributionTop1: 0.0, notes: "not hit" }
    ]
  };
}

export async function updateSection(versionId: string, domain: string, payload: any): Promise<void> {
  // mock no-op
  return;
}

export async function validateVersion(versionId: string): Promise<{ ok: boolean; errors?: string[]; warnings?: string[] }> {
  return { ok: true };
}

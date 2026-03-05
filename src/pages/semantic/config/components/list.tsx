import React from "react";
import { cls, Pill } from "./ui";

export type ListItem = {
  id: string;
  title: string;
  subtitle?: string;
  badges?: Array<{ text: string; tone?: "gray" | "green" | "yellow" | "red" | "blue" }>;
};

export function EntityList({
  items,
  selectedId,
  onSelect,
  header,
  onCreate,
}: {
  items: ListItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  header?: { title: string; desc?: string };
  onCreate?: () => void;
}) {
  return (
    <div>
      {header && (
        <div className="mb-3">
          <div className="text-xs font-semibold text-slate-100">{header.title}</div>
          {header.desc && <div className="text-[11px] text-slate-400">{header.desc}</div>}
        </div>
      )}
      <div className="space-y-2">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => onSelect(it.id)}
            className={cls(
              "w-full text-left rounded-xl border px-3 py-2 transition",
              selectedId === it.id ? "border-emerald-600 bg-emerald-900/20" : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold text-slate-100">{it.title}</div>
              <div className="flex flex-wrap gap-2 justify-end">
                {it.badges?.map((b, idx) => (
                  <Pill key={idx} tone={b.tone}>
                    {b.text}
                  </Pill>
                ))}
              </div>
            </div>
            {it.subtitle && <div className="mt-1 text-[11px] text-slate-400 truncate">{it.subtitle}</div>}
          </button>
        ))}
      </div>
      {onCreate && (
        <button
          type="button"
          onClick={onCreate}
          className="w-full mt-3 px-3 py-2 border border-dashed border-slate-700 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition"
        >
          + 添加新项
        </button>
      )}
    </div>
  );
}

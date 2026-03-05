import React, { useMemo, useState } from "react";

export function cls(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

export const Pill: React.FC<{
  children: React.ReactNode;
  tone?: "gray" | "green" | "yellow" | "red" | "blue";
}> = ({ children, tone }) => {
  const bg =
    tone === "green"
      ? "bg-emerald-900/40 text-emerald-200 border-emerald-700/50"
      : tone === "yellow"
      ? "bg-amber-900/40 text-amber-200 border-amber-700/50"
      : tone === "red"
      ? "bg-rose-900/40 text-rose-200 border-rose-700/50"
      : tone === "blue"
      ? "bg-sky-900/40 text-sky-200 border-sky-700/50"
      : "bg-slate-800 text-slate-200 border-slate-700";
  return (
    <span className={cls("inline-flex items-center px-2 py-0.5 rounded-full border text-xs", bg)}>
      {children}
    </span>
  );
};

export function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-2">
      <div className="text-sm font-semibold text-slate-100">{title}</div>
      {desc && <div className="text-xs text-slate-400">{desc}</div>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-xs text-slate-300 mb-1">{label}</div>
      <input
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-2 text-xs text-slate-100 disabled:opacity-50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs text-slate-300 mb-1">{label}</div>
      <textarea
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-2 text-xs text-slate-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
      />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.01,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-1">
      <span className="text-xs text-slate-300">{label}</span>
      <input
        className="w-28 rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-100"
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-1">
      <span className="text-xs text-slate-300">{label}</span>
      <button
        className={cls(
          "w-12 h-6 rounded-full border transition",
          value ? "bg-emerald-700/40 border-emerald-600" : "bg-slate-800 border-slate-700"
        )}
        onClick={() => onChange(!value)}
        type="button"
      >
        <span className={cls("block w-5 h-5 rounded-full bg-slate-200 transition translate-x-0.5", value && "translate-x-6")} />
      </button>
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="block">
      <div className="text-xs text-slate-300 mb-1">{label}</div>
      <select
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-2 text-xs text-slate-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ChipsInput({
  label,
  value,
  onChange,
  placeholder = "输入后回车",
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const normalized = useMemo(() => value ?? [], [value]);

  function addChip(txt: string) {
    const t = txt.trim();
    if (!t) return;
    if (normalized.includes(t)) return;
    onChange([...normalized, t]);
    setDraft("");
  }
  function removeChip(t: string) {
    onChange(normalized.filter((x) => x !== t));
  }

  return (
    <div>
      <div className="text-xs text-slate-300 mb-1">{label}</div>
      <div className="flex flex-wrap gap-2 mb-2">
        {normalized.map((c) => (
          <span key={c} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/40 px-2 py-1 text-xs text-slate-200">
            {c}
            <button className="text-slate-400 hover:text-slate-100" type="button" onClick={() => removeChip(c)}>
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-2 text-xs text-slate-100"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addChip(draft);
          }
        }}
      />
    </div>
  );
}

export function JsonTextArea({
  label,
  value,
  onChange,
  rows = 6,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  rows?: number;
}) {
  const [raw, setRaw] = useState(() => JSON.stringify(value ?? {}, null, 2));
  const [err, setErr] = useState<string | null>(null);

  // sync when external changes
  React.useEffect(() => {
    setRaw(JSON.stringify(value ?? {}, null, 2));
    setErr(null);
  }, [value]);

  function apply() {
    try {
      const parsed = JSON.parse(raw || "{}");
      setErr(null);
      onChange(parsed);
    } catch (e: any) {
      setErr(e?.message || "Invalid JSON");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-300">{label}</div>
        <button
          type="button"
          onClick={apply}
          className="text-xs rounded-md border border-slate-700 bg-slate-900/40 px-2 py-1 text-slate-200 hover:border-slate-600"
        >
          应用JSON
        </button>
      </div>
      <textarea
        className={cls(
          "w-full rounded-md bg-slate-900 border px-2 py-2 text-[11px] text-slate-100 font-mono",
          err ? "border-rose-600" : "border-slate-700"
        )}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={rows}
      />
      {err && <div className="mt-1 text-[11px] text-rose-300">JSON 解析失败：{err}</div>}
    </div>
  );
}

export function DeltaTable({
  label,
  value,
  onChange,
  keys,
  decimals = 2,
}: {
  label: string;
  value: Record<string, number>;
  onChange: (v: Record<string, number>) => void;
  keys: string[];
  decimals?: number;
}) {
  return (
    <div>
      <div className="text-xs text-slate-300 mb-2">{label}</div>
      <div className="space-y-1">
        {keys.map((key) => (
          <label key={key} className="flex items-center justify-between gap-3 py-1">
            <span className="text-xs text-slate-400 font-mono">{key}</span>
            <input
              className="w-24 rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-100"
              type="number"
              step="0.01"
              value={Number(value[key] ?? 0).toFixed(decimals)}
              onChange={(e) => onChange({ ...value, [key]: Number(e.target.value) })}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { SectionTitle, NumberField, Select, TextField, TextArea, DeltaTable, Pill, cls } from "./components";
import { CompatPayload, CompatRelation } from "./types";

const TYPE_OPTIONS = ["ID", "DIM", "MEASURE", "TIME", "STATUS", "CATEGORY", "UNKNOWN", "META"];
const ROLE_OPTIONS = [
  "PRIMARY_KEY",
  "FOREIGN_KEY",
  "BUSINESS_KEY",
  "DIMENSION",
  "MEASURE",
  "EVENT_TIME",
  "AUDIT_FIELD",
  "PARTITION_KEY",
  "STATUS",
  "CODE",
  "PHONE",
  "IGNORE",
  "NONE",
  "TECHNICAL",
];
const RELATION_OPTIONS: Array<{ label: string; value: CompatRelation }> = [
  { label: "允许 (ALLOW)", value: "ALLOW" },
  { label: "弱兼容 (WEAK)", value: "WEAK" },
  { label: "禁止 (DENY)", value: "DENY" },
];

interface CompatMatrixEditorProps {
  config: CompatPayload;
  setConfig: (config: CompatPayload) => void;
}

export const CompatMatrixEditor: React.FC<CompatMatrixEditorProps> = ({ config, setConfig }) => {
  const [selectedType, setSelectedType] = React.useState<string>(
    Object.keys(config.matrix)[0] || "DATETIME"
  );

  const selectedMatrix = config.matrix[selectedType];

  function addRelation(relation: CompatRelation, role: string) {
    setConfig({
      ...config,
      matrix: {
        ...config.matrix,
        [selectedType]: {
          ...selectedMatrix,
          [relation]: [...selectedMatrix[relation], role].filter((v, i, a) => a.indexOf(v) === i),
        },
      },
    });
  }

  function removeRelation(relation: CompatRelation, role: string) {
    setConfig({
      ...config,
      matrix: {
        ...config.matrix,
        [selectedType]: {
          ...selectedMatrix,
          [relation]: selectedMatrix[relation].filter((r) => r !== role),
        },
      },
    });
  }

  function updateReason(role: string, reason: string) {
    setConfig({
      ...config,
      matrix: {
        ...config.matrix,
        [selectedType]: {
          ...selectedMatrix,
          reason: {
            ...selectedMatrix.reason,
            [role]: reason,
          },
        },
      },
    });
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="兼容性矩阵" desc="类型 (Type) 与 角色 (Role) 之间的兼容性配置" />

      {/* Default Penalties */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-100 mb-4">默认惩罚值</h3>
        <div className="grid grid-cols-3 gap-4">
          <NumberField
            label="允许奖励 (allow_bonus)"
            value={config.defaults.allow_bonus}
            onChange={(v) => setConfig({ ...config, defaults: { ...config.defaults, allow_bonus: v } })}
            min={0}
            max={1}
            step={0.05}
          />
          <NumberField
            label="弱兼容惩罚 (weak_penalty)"
            value={config.defaults.weak_penalty}
            onChange={(v) => setConfig({ ...config, defaults: { ...config.defaults, weak_penalty: v } })}
            min={0}
            max={1}
            step={0.05}
          />
          <NumberField
            label="禁止惩罚 (deny_penalty)"
            value={config.defaults.deny_penalty}
            onChange={(v) => setConfig({ ...config, defaults: { ...config.defaults, deny_penalty: v } })}
            min={0}
            max={1}
            step={0.05}
          />
        </div>
      </div>

      {/* Type Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-300">选择类型:</span>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cls(
                "px-3 py-1 rounded-lg text-xs font-medium transition",
                selectedType === type
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Editor */}
      {selectedMatrix && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-semibold text-slate-100">
            {selectedType} 的兼容性配置
          </h3>

          {/* ALLOW */}
          <div>
            <div className="text-xs text-slate-300 mb-2">允许 (ALLOW)</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedMatrix.ALLOW.map((role) => (
                <span key={role} className="relative group">
                  <Pill tone="green">{role}</Pill>
                  <button
                    onClick={() => removeRelation("ALLOW", role)}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full text-[8px] text-white opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <Select
              label="添加允许角色"
              value=""
              onChange={(v) => v && addRelation("ALLOW", v)}
              options={ROLE_OPTIONS.filter((r) => !selectedMatrix.ALLOW.includes(r)).map((r) => ({ label: r, value: r }))}
            />
          </div>

          {/* WEAK */}
          <div>
            <div className="text-xs text-slate-300 mb-2">弱兼容 (WEAK)</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedMatrix.WEAK.map((role) => (
                <span key={role} className="relative group">
                  <Pill tone="yellow">{role}</Pill>
                  <button
                    onClick={() => removeRelation("WEAK", role)}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full text-[8px] text-white opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <Select
              label="添加弱兼容角色"
              value=""
              onChange={(v) => v && addRelation("WEAK", v)}
              options={ROLE_OPTIONS.filter((r) => !selectedMatrix.WEAK.includes(r)).map((r) => ({ label: r, value: r }))}
            />
          </div>

          {/* DENY */}
          <div>
            <div className="text-xs text-slate-300 mb-2">禁止 (DENY)</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedMatrix.DENY.map((role) => (
                <span key={role} className="relative group">
                  <Pill tone="red">{role}</Pill>
                  <button
                    onClick={() => removeRelation("DENY", role)}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full text-[8px] text-white opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <Select
              label="添加禁止角色"
              value=""
              onChange={(v) => v && addRelation("DENY", v)}
              options={ROLE_OPTIONS.filter((r) => !selectedMatrix.DENY.includes(r)).map((r) => ({ label: r, value: r }))}
            />
          </div>

          {/* Reasons */}
          {selectedMatrix.reason && Object.keys(selectedMatrix.reason).length > 0 && (
            <div>
              <div className="text-xs text-slate-300 mb-2">原因说明 (reason)</div>
              <div className="space-y-2">
                {Object.entries(selectedMatrix.reason).map(([role, reason]) => (
                  <div key={role} className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                    <div className="text-xs font-medium text-slate-200 mb-1">{role}</div>
                    <div className="mt-2">
                      <TextArea
                        label="原因"
                        value={String(reason)}
                        onChange={(v) => updateReason(role, v)}
                        rows={1}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

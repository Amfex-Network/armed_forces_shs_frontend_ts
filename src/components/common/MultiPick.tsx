import React from "react";

interface MultiPickProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  emptyText?: string;
  hint?: string;
}

const same = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

const MultiPick = ({
  label,
  options,
  value,
  onChange,
  emptyText = "Nothing to choose from yet.",
  hint,
}: MultiPickProps) => {
  const selected = value || [];
  const isOn = (o: string) => selected.some((v) => same(v, o));
  const toggle = (o: string) =>
    onChange(isOn(o) ? selected.filter((v) => !same(v, o)) : [...selected, o]);
  const stale = selected.filter((v) => !options.some((o) => same(o, v)));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "var(--dark-gray)" }}
        >
          {label}
        </span>
        <span className="text-xs text-gray-400">
          {selected.length} selected
        </span>
      </div>
      {options.length === 0 && stale.length === 0 ? (
        <p className="text-xs text-gray-400">{emptyText}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {[...options, ...stale].map((o) => {
            const on = isOn(o);
            return (
              <button
                key={o}
                type="button"
                onClick={() => toggle(o)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold transition"
                style={{
                  backgroundColor: on ? "var(--royal-blue)" : "white",
                  color: on ? "white" : "var(--dark-gray)",
                  border: "1px solid var(--medium-gray)",
                }}
              >
                {o}
              </button>
            );
          })}
        </div>
      )}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
};

export default MultiPick;

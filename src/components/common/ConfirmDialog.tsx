import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Trash2, AlertTriangle } from "lucide-react";

export interface ConfirmOptions {
  title: string;
  message?: React.ReactNode;
  detail?: string;
  confirmLabel?: string;
  danger?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn>(async () => false);

// Every destructive action asks first:
//   const confirm = useConfirm();
//   if (!(await confirm({ title: "Delete class?" }))) return;
export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((ok: boolean) => void) | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback<ConfirmFn>(
    (opts) =>
      new Promise<boolean>((resolve) => {
        resolver.current?.(false);
        resolver.current = resolve;
        setOptions(opts);
      }),
    [],
  );

  const close = (ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = null;
    setOptions(null);
  };

  useEffect(() => {
    if (!options) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [options]);

  const danger = options?.danger !== false;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          onClick={(e) => e.target === e.currentTarget && close(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: danger ? "#fff1f2" : "#fffbeb" }}
            >
              {danger ? (
                <Trash2 size={24} style={{ color: "var(--accent-red)" }} />
              ) : (
                <AlertTriangle size={24} style={{ color: "var(--warning)" }} />
              )}
            </div>
            <h3
              id="confirm-title"
              className="font-black text-lg mb-1"
              style={{ color: "var(--dark-gray)" }}
            >
              {options.title}
            </h3>
            {options.message && (
              <div className="text-sm text-gray-600 mb-1">
                {options.message}
              </div>
            )}
            <p className="text-xs text-gray-400 mb-6">
              {options.detail ?? "This action cannot be undone."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => close(false)}
                className="px-5 py-2 text-sm font-semibold rounded-xl border"
                style={{
                  borderColor: "var(--medium-gray)",
                  color: "var(--dark-gray)",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className="px-5 py-2 text-sm font-bold text-white rounded-xl"
                style={{
                  backgroundColor: danger
                    ? "var(--accent-red)"
                    : "var(--royal-blue)",
                }}
              >
                {options.confirmLabel || "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { settingsApi, AppSettings, GradeBand } from "../api/settings";
import { useAuth } from "./AuthContext";

export const DEFAULT_GRADING_SCALE: GradeBand[] = [
  { grade: "A1", minScore: 80, label: "Excellent", points: 1 },
  { grade: "B2", minScore: 70, label: "Very Good", points: 2 },
  { grade: "B3", minScore: 65, label: "Good", points: 3 },
  { grade: "C4", minScore: 60, label: "Credit", points: 4 },
  { grade: "C5", minScore: 55, label: "Credit", points: 5 },
  { grade: "C6", minScore: 50, label: "Credit", points: 6 },
  { grade: "D7", minScore: 45, label: "Pass", points: 7 },
  { grade: "E8", minScore: 40, label: "Pass", points: 8 },
  { grade: "F9", minScore: 0, label: "Fail", points: 9 },
];

const DEFAULTS: AppSettings = {
  schoolName: "Armed Forces Senior High Technical School",
  shortName: "AFSHTS",
  motto: "",
  schoolType: "",
  waecCode: "",
  region: "",
  district: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  currentAcademicYear: "2024/2025",
  currentTerm: "Term 1",
  academicYears: ["2024/2025"],
  terms: ["Term 1", "Term 2", "Term 3"],
  gradingScale: DEFAULT_GRADING_SCALE,
  positionBasis: "total",
  portalAccess: { teacher: true, student: true, parent: true },
  selfUpdate: { student: true, parent: true },
};

interface SettingsContextValue {
  settings: AppSettings;
  loading: boolean;
  refresh: () => Promise<void>;
  save: (payload: Partial<AppSettings>) => Promise<AppSettings>;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULTS,
  loading: true,
  refresh: async () => {},
  save: async () => DEFAULTS,
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const s = await settingsApi.get();
      setSettings({ ...DEFAULTS, ...s });
    } catch {
      /* keep defaults (unauthenticated or offline) */
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (payload: Partial<AppSettings>) => {
    const s = await settingsApi.update(payload);
    const merged = { ...DEFAULTS, ...s };
    setSettings(merged);
    return merged;
  }, []);

  const { user } = useAuth();
  const userId = user?.id;

  // Settings need a signed-in user; load them on sign-in, keep the defaults
  // until then (no request while signed out).
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    refresh();
  }, [refresh, userId]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh, save }}>
      {children}
    </SettingsContext.Provider>
  );
};

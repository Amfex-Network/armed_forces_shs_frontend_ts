import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_DAY_PERIODS,
  periodsApi,
  toPeriodRows,
  type DayPeriod,
} from "../api/timetable";

// The school day (lessons, break and lunch) as set by the admin or HOD.
export const useDayPeriods = () => {
  const [periods, setPeriods] = useState<DayPeriod[]>(DEFAULT_DAY_PERIODS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    periodsApi
      .get()
      .then((p) => alive && p.length && setPeriods(p))
      .catch(() => {})
      .finally(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  const rows = useMemo(() => toPeriodRows(periods), [periods]);
  return { periods, setPeriods, rows, loaded };
};

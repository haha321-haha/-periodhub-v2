import { useState, useEffect } from "react";
import { CycleData, CurrentCycleInfo } from "../types/cycle";
import {
  calculateCurrentCycle,
  validateCycleData,
} from "../utils/cycleCalculator";
import { useLocalStorage } from "./useLocalStorage";
import { trackEvent } from "../utils/analytics";

const STORAGE_KEY = "periodhub_cycle_data";
const DEFAULT_CYCLE_LENGTH = 28;

// Default empty state if no data
const DEFAULT_INFO: CurrentCycleInfo = {
  currentDay: 1,
  currentPhase: { name: "Menstrual", startDay: 1, endDay: 5, color: "#ec4899" },
  nextPeriodDate: new Date().toISOString().split("T")[0],
  daysUntilNextPeriod: 28,
  cycleProgress: 0,
};

export function useCycleTracker() {
  const [cycleData, setCycleData] = useLocalStorage<CycleData | null>(
    STORAGE_KEY,
    null,
  );
  const [currentInfo, setCurrentInfo] = useState<CurrentCycleInfo | null>(null);
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    if (cycleData) {
      const info = calculateCurrentCycle(cycleData);
      setCurrentInfo(info);
      setIsSetup(true);
    } else {
      setIsSetup(false);
      setCurrentInfo(null);
    }
  }, [cycleData]);

  const setupCycle = (data: Partial<CycleData>) => {
    const errors = validateCycleData(data);
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    const newData: CycleData = {
      lastPeriodDate: data.lastPeriodDate!,
      averageCycleLength: data.averageCycleLength || DEFAULT_CYCLE_LENGTH,
      createdAt: cycleData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCycleData(newData);
    trackEvent("cycle_setup_complete", {
      cycleLength: newData.averageCycleLength,
    });
  };

  const updateLastPeriod = (date: string) => {
    // Keep existing cycle length or default
    const length = cycleData?.averageCycleLength || DEFAULT_CYCLE_LENGTH;

    const errors = validateCycleData({
      lastPeriodDate: date,
      averageCycleLength: length,
    });
    if (errors.length > 0) {
      throw new Error(errors[0]);
    }

    setCycleData({
      lastPeriodDate: date,
      averageCycleLength: length,
      createdAt: cycleData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    trackEvent("cycle_period_updated", { date });
  };

  return {
    cycleData,
    currentInfo: currentInfo || DEFAULT_INFO, // Return default if null to prevent crash
    isSetup,
    setupCycle,
    updateLastPeriod,
  };
}

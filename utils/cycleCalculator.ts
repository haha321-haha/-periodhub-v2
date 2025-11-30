import { CycleData, CyclePhase, CurrentCycleInfo } from "../types/cycle";

const PHASES: CyclePhase[] = [
  { name: "Menstrual", startDay: 1, endDay: 5, color: "#ec4899" },
  { name: "Follicular", startDay: 6, endDay: 13, color: "#a855f7" },
  { name: "Ovulation", startDay: 14, endDay: 16, color: "#06b6d4" },
  { name: "Luteal", startDay: 17, endDay: 28, color: "#10b981" },
];

export function calculateCurrentCycle(cycleData: CycleData): CurrentCycleInfo {
  const lastPeriod = new Date(cycleData.lastPeriodDate);
  const today = new Date();
  // Set hours to 0 to compare just dates
  today.setHours(0, 0, 0, 0);
  lastPeriod.setHours(0, 0, 0, 0);

  // Calculate difference in days
  const timeDiff = today.getTime() - lastPeriod.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // If the date is in the future (daysDiff < 0), treat as day 1 or handle error.
  // Here we just treat as Day 1 for simplicity.
  const normalizedDaysDiff = Math.max(0, daysDiff);

  // Calculate current day in cycle (1-based index)
  const cycleLength = cycleData.averageCycleLength;
  const currentDay = (normalizedDaysDiff % cycleLength) + 1;

  // Determine current phase
  // Note: PHASES define ranges for a standard 28 day cycle.
  // Scaling logic could be added here for irregular cycles, but for MVP we use standard ranges mapping to day.
  // If cycle is longer than 28, the 'Luteal' phase essentially extends.
  const currentPhase = PHASES.find(
    (phase) => currentDay >= phase.startDay && currentDay <= phase.endDay,
  ) || { name: "Luteal", startDay: 17, endDay: cycleLength, color: "#10b981" }; // Fallback to Luteal if beyond standard range

  // Calculate next period date
  const daysUntilNext = cycleLength - (normalizedDaysDiff % cycleLength);
  const nextPeriodDate = new Date(today);
  nextPeriodDate.setDate(today.getDate() + daysUntilNext);

  // Calculate cycle progress percentage
  const cycleProgress = (currentDay / cycleLength) * 100;

  return {
    currentDay,
    currentPhase,
    nextPeriodDate: nextPeriodDate.toISOString().split("T")[0],
    daysUntilNextPeriod: daysUntilNext,
    cycleProgress: Math.min(Math.max(cycleProgress, 0), 100),
  };
}

export function validateCycleData(data: Partial<CycleData>): string[] {
  const errors: string[] = [];

  if (!data.lastPeriodDate) {
    errors.push("Please select your last period date.");
  } else {
    const date = new Date(data.lastPeriodDate);
    const today = new Date();
    if (date > today) {
      errors.push("Last period date cannot be in the future.");
    }
  }

  if (data.averageCycleLength !== undefined) {
    if (data.averageCycleLength < 21 || data.averageCycleLength > 35) {
      errors.push("Cycle length should be between 21 and 35 days.");
    }
  }

  return errors;
}

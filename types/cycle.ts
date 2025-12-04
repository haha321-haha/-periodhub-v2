export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: "PRO" | "NEW" | "HOT" | "BETA";
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
  href: string;
  type: "zone" | "card";
}

export interface NavItem {
  label: string;
  href: string;
  children?: Tool[]; // For dropdowns
}

// --- Cycle Tracker Types ---

export interface CycleData {
  lastPeriodDate: string; // ISO 8601: "2025-11-15"
  averageCycleLength: number; // Default 28, range 21-35
  createdAt: string;
  updatedAt: string;
}

export interface CyclePhase {
  name: "Menstrual" | "Follicular" | "Ovulation" | "Luteal";
  startDay: number;
  endDay: number;
  color: string;
}

export interface CurrentCycleInfo {
  currentDay: number;
  currentPhase: CyclePhase;
  nextPeriodDate: string;
  daysUntilNextPeriod: number;
  cycleProgress: number; // 0-100
}

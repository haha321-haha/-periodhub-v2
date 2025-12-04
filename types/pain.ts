// Phase 1.2: Pain Tracker Data Types

export interface PainEntry {
  id: string; // UUID for unique identification
  date: string; // ISO 8601 format: "2025-11-19"
  painLevel: number; // Scale 1-10
  symptoms: string[]; // Array of selected tags
  mood: string; // Emoji or text identifier
  notes?: string; // Optional user notes
  createdAt: string; // ISO timestamp
}

export interface PainHistory {
  entries: PainEntry[];
  createdAt: string;
  updatedAt: string;
}

// Constants for UI selection
export const SYMPTOM_TAGS = [
  "Cramps",
  "Headache",
  "Fatigue",
  "Bloating",
  "Nausea",
  "Back Pain",
  "Mood Swings",
  "Breast Tenderness",
  "Acne",
  "Insomnia",
] as const;

export const MOOD_OPTIONS = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "😢", label: "Sad", value: "sad" },
  { emoji: "😡", label: "Irritated", value: "irritated" },
  { emoji: "😴", label: "Tired", value: "tired" },
  { emoji: "😌", label: "Calm", value: "calm" },
] as const;

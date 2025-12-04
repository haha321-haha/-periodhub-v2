import { useLocalStorage } from "./useLocalStorage";
import { PainEntry, PainHistory } from "../types/pain";
import { trackEvent } from "../utils/analytics";

const STORAGE_KEY = "periodhub_pain_history";

export function usePainTracker() {
  const [history, setHistory] = useLocalStorage<PainHistory>(STORAGE_KEY, {
    entries: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Add a new pain entry
  const addEntry = (entry: Omit<PainEntry, "id" | "createdAt">) => {
    const newEntry: PainEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setHistory((prev) => ({
      ...prev,
      entries: [...prev.entries, newEntry].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ), // Sort by date descending (newest first)
      updatedAt: new Date().toISOString(),
    }));

    trackEvent("pain_entry_added", {
      painLevel: entry.painLevel,
      symptomsCount: entry.symptoms.length,
    });
  };

  // Update an existing entry
  const updateEntry = (entry: PainEntry) => {
    setHistory((prev) => ({
      ...prev,
      entries: prev.entries.map((e) => (e.id === entry.id ? entry : e)),
      updatedAt: new Date().toISOString(),
    }));

    trackEvent("pain_entry_updated", { id: entry.id });
  };

  // Delete an entry
  const deleteEntry = (id: string) => {
    setHistory((prev) => ({
      ...prev,
      entries: prev.entries.filter((e) => e.id !== id),
      updatedAt: new Date().toISOString(),
    }));

    trackEvent("pain_entry_deleted", { id });
  };

  // Get entries for a specific date range
  const getEntriesByDateRange = (startDate: Date, endDate: Date) => {
    return history.entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  // Get entry for a specific date string (YYYY-MM-DD)
  const getEntryByDate = (dateStr: string) => {
    return history.entries.find((e) => e.date === dateStr);
  };

  return {
    entries: history.entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByDateRange,
    getEntryByDate,
  };
}

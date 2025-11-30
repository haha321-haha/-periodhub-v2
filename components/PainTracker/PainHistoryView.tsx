import React from "react";
import { PainEntry, MOOD_OPTIONS } from "../../types/pain";
import { Trash2, Edit2, Calendar } from "lucide-react";

interface PainHistoryViewProps {
  entries: PainEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: PainEntry) => void;
}

export const PainHistoryView: React.FC<PainHistoryViewProps> = ({
  entries,
  onDelete,
  onEdit,
}) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">📝</div>
        <h3 className="text-lg font-medium text-gray-900">No logs yet</h3>
        <p className="text-gray-500 text-sm mt-1">
          Start tracking to see your history here.
        </p>
      </div>
    );
  }

  const getMoodEmoji = (value: string) => {
    return MOOD_OPTIONS.find((m) => m.value === value)?.emoji || "😐";
  };

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-purple-50 text-purple-700 px-2 py-1 rounded-md flex items-center gap-1">
                <Calendar size={12} />
                {entry.date}
              </span>
              <span className="text-lg" title="Mood">
                {getMoodEmoji(entry.mood)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(entry)}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="Edit entry"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this entry?",
                    )
                  ) {
                    onDelete(entry.id);
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Delete entry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                Pain Level
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    entry.painLevel <= 3
                      ? "bg-green-500"
                      : entry.painLevel <= 6
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${(entry.painLevel / 10) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-700 w-8 text-right">
              {entry.painLevel}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {entry.symptoms.map((symptom) => (
              <span
                key={symptom}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {symptom}
              </span>
            ))}
          </div>

          {entry.notes && (
            <p className="text-xs text-gray-500 italic mt-2 border-t border-gray-50 pt-2">
              &quot;{entry.notes}&quot;
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

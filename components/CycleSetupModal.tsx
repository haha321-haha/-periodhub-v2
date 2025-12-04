import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, AlertCircle } from "lucide-react";

interface CycleSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    lastPeriodDate: string;
    averageCycleLength: number;
  }) => void;
  initialDate?: string;
}

const CycleSetupModal: React.FC<CycleSetupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
}) => {
  const [date, setDate] = useState(initialDate || "");
  const [length, setLength] = useState(28);
  const [error, setError] = useState("");

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setDate(initialDate || new Date().toISOString().split("T")[0]);
      setLength(28);
      setError("");
    }
  }, [isOpen, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError("Please select a date");
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    if (selectedDate > today) {
      setError("Date cannot be in the future");
      return;
    }

    onSave({ lastPeriodDate: date, averageCycleLength: length });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-opacity">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-float"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white flex justify-between items-start">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold">
              Setup Cycle Tracker
            </h2>
            <p className="text-purple-100 text-sm mt-1">
              Let&apos;s personalize your predictions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Input */}
          <div className="space-y-2">
            <label
              htmlFor="period-date"
              className="block text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <Calendar size={16} className="text-purple-500" />
              When did your last period start?
            </label>
            <input
              id="period-date"
              type="date"
              required
              max={new Date().toISOString().split("T")[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-gray-700"
            />
          </div>

          {/* Length Input */}
          <div className="space-y-2">
            <label
              htmlFor="cycle-length"
              className="block text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <Clock size={16} className="text-pink-500" />
              Average Cycle Length (Days)
            </label>
            <div className="flex items-center gap-4">
              <input
                id="cycle-length"
                type="range"
                min="21"
                max="35"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <span className="text-xl font-bold text-purple-600 min-w-[3ch] text-center">
                {length}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Usually between 21 and 35 days. Default is 28.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              Start Tracking
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              Your data is stored locally on this device.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CycleSetupModal;

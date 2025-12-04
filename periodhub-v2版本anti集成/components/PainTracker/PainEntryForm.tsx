
import React, { useState, useEffect } from 'react';
import { PainEntry, SYMPTOM_TAGS, MOOD_OPTIONS } from '../../types/pain';
import { Save, X } from 'lucide-react';

interface PainEntryFormProps {
  entry?: PainEntry | null; // For editing
  onSave: (data: Omit<PainEntry, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const PainEntryForm: React.FC<PainEntryFormProps> = ({ entry, onSave, onCancel }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [painLevel, setPainLevel] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string>(MOOD_OPTIONS[1].value); // Default neutral
  const [notes, setNotes] = useState('');

  // Load data if editing
  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setPainLevel(entry.painLevel);
      setSelectedSymptoms(entry.symptoms);
      setMood(entry.mood);
      setNotes(entry.notes || '');
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      painLevel,
      symptoms: selectedSymptoms,
      mood,
      notes
    });
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          required
          max={new Date().toISOString().split('T')[0]}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* Pain Level Slider */}
      <div>
        <div className="flex justify-between items-end mb-2">
          <label className="block text-sm font-medium text-gray-700">Pain Level</label>
          <span className={`text-2xl font-bold ${
            painLevel <= 3 ? 'text-green-500' : 
            painLevel <= 6 ? 'text-yellow-500' : 
            'text-red-500'
          }`}>
            {painLevel}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={painLevel}
          onChange={(e) => setPainLevel(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          style={{
            background: `linear-gradient(to right, #a855f7 ${((painLevel-1)/9)*100}%, #e5e7eb ${((painLevel-1)/9)*100}%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Mild</span>
          <span>Moderate</span>
          <span>Severe</span>
        </div>
      </div>

      {/* Symptoms Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleSymptom(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                selectedSymptoms.includes(tag)
                  ? 'bg-purple-100 border-purple-500 text-purple-700 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Mood Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
        <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
          {MOOD_OPTIONS.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMood(option.value)}
              className={`text-2xl p-2 rounded-lg transition-transform hover:scale-110 ${
                mood === option.value ? 'bg-white shadow-md scale-110' : 'opacity-60 hover:opacity-100'
              }`}
              title={option.label}
            >
              {option.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Did you take any medication? Did exercise help?"
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Save Entry
        </button>
      </div>
    </form>
  );
};

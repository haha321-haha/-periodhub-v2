
import React, { useState } from 'react';
import { X, Plus, List } from 'lucide-react';
import { PainEntryForm } from './PainTracker/PainEntryForm';
import { PainHistoryView } from './PainTracker/PainHistoryView';
import { usePainTracker } from '../hooks/usePainTracker';
import { PainEntry } from '../types/pain';

interface PainTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PainTrackerModal: React.FC<PainTrackerModalProps> = ({ isOpen, onClose }) => {
  const { entries, addEntry, updateEntry, deleteEntry } = usePainTracker();
  const [view, setView] = useState<'form' | 'history'>('form');
  const [editingEntry, setEditingEntry] = useState<PainEntry | null>(null);

  if (!isOpen) return null;

  const handleSave = (data: Omit<PainEntry, 'id' | 'createdAt'>) => {
    if (editingEntry) {
      updateEntry({ ...editingEntry, ...data });
      setEditingEntry(null);
    } else {
      addEntry(data);
    }
    // Switch to history view after saving to show confirmation essentially
    setView('history');
  };

  const handleEdit = (entry: PainEntry) => {
    setEditingEntry(entry);
    setView('form');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-opacity">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-float flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">Pain Tracker</h2>
              <p className="text-purple-100 text-sm mt-1">Log symptoms to identify patterns.</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Toggle */}
          <div className="flex bg-black/20 rounded-lg p-1">
            <button
              onClick={() => { setView('form'); setEditingEntry(null); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                view === 'form' ? 'bg-white text-purple-600 shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              <Plus size={16} /> Log Entry
            </button>
            <button
              onClick={() => setView('history')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                view === 'history' ? 'bg-white text-purple-600 shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              <List size={16} /> History ({entries.length})
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {view === 'form' ? (
            <PainEntryForm 
              onSave={handleSave} 
              onCancel={() => setView('history')}
              entry={editingEntry}
            />
          ) : (
            <PainHistoryView 
              entries={entries} 
              onDelete={deleteEntry}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PainTrackerModal;

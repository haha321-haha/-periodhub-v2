"use client";

import { useState, useEffect } from "react";
import { Download, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { LocalStorageManager } from "@/lib/localStorage";

interface DataManagementProps {
  className?: string;
}

export function DataManagement({ className = "" }: DataManagementProps) {
  const [assessments, setAssessments] = useState([]);
  const [storageInfo, setStorageInfo] = useState({
    count: 0,
    lastAssessment: null as number | null,
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const data = LocalStorageManager.getAssessments();
      setAssessments(data);
      const info = LocalStorageManager.getStorageInfo();
      setStorageInfo(info);
    } catch (_error) {
      setMessage("Failed to load data");
    }
  };

  // Export data
  const handleExport = () => {
    try {
      const data = LocalStorageManager.exportData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stress-assessment-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage("Data exported successfully!");
    } catch (_error) {
      setMessage("Export failed, please try again");
    }
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    setShowConfirmDelete(true);
  };

  // Execute delete
  const handleDelete = () => {
    try {
      LocalStorageManager.clearAllData();
      setAssessments([]);
      setStorageInfo({ count: 0, lastAssessment: null });
      setShowConfirmDelete(false);
      setMessage("All data deleted");
    } catch (_error) {
      setMessage("Delete failed, please try again");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        Data Management
      </h3>

      {/* Data statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {storageInfo.count}
          </div>
          <div className="text-sm text-blue-800">Assessment Records</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {storageInfo.lastAssessment
              ? new Date(storageInfo.lastAssessment).toLocaleDateString()
              : "N/A"}
          </div>
          <div className="text-sm text-green-800">Last Assessment</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={assessments.length === 0}
        >
          <Download className="w-4 h-4" />
          Export Data ({assessments.length} records)
        </button>

        <button
          onClick={handleConfirmDelete}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          disabled={assessments.length === 0}
        >
          <Trash2 className="w-4 h-4" />
          Clear All Data
        </button>
      </div>

      {/* Confirm delete dialog */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">
                Confirm Delete
              </h3>
            </div>
            <p className="text-gray-700 mb-6">
              This action will permanently delete all assessment data,
              including:
            </p>
            <ul className="text-sm text-gray-600 mb-6 space-y-1">
              <li>• {assessments.length} assessment records</li>
              <li>• All answers and scores</li>
              <li>• Personal preferences</li>
            </ul>
            <p className="text-sm text-red-600 mb-6 font-medium">
              This action cannot be undone!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message display */}
      {message && (
        <div className="mt-4 p-3 rounded-lg flex items-center gap-2 bg-green-50 text-green-800">
          <CheckCircle className="w-4 h-4" />
          {message}
        </div>
      )}

      {/* Info text */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>• Data is stored locally on your device only</p>
        <p>
          • Exported file is in JSON format, can be imported on other devices
        </p>
        <p>• Data cannot be recovered after deletion</p>
      </div>
    </div>
  );
}

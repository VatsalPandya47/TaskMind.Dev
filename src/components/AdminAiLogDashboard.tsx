
import React, { useState } from "react";

// Placeholder demo logs, in prod load from storage or logging endpoint
const DEMO_LOGS = [
  {
    timestamp: "2025-06-15T12:31:00Z",
    meetingId: "m01",
    transcript_sample: "Let's circle back on the budget review...",
    ai_output: [
      { task: "Email Bob budget update", responsible_person: "Sarah", deadline: "2025-06-18", follow_up: true }
    ],
    correction: null,
    notes: "",
    status: "success",
    prompt_version: "extractor-v1.txt",
    type: "dry_run",
  },
  {
    timestamp: "2025-06-15T13:40:00Z",
    meetingId: "m02",
    transcript_sample: "We need to finalize slides...",
    ai_output: [],
    correction: [],
    notes: "AI missed key action",
    status: "fail",
    prompt_version: "extractor-v1.txt",
    type: "gpt_extract_fail",
  }
];

const AdminAiLogDashboard = () => {
  const [logs] = useState(DEMO_LOGS);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">AI Extraction Logs (Internal)</h1>
      
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Meeting</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">AI Output</th>
              <th className="px-3 py-2">Correction</th>
              <th className="px-3 py-2">Notes</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx} className={log.status === "fail" ? "bg-red-50" : ""}>
                <td className="border px-3 py-1">{log.timestamp}</td>
                <td className="border px-3 py-1">{log.meetingId}</td>
                <td className="border px-3 py-1">{log.type}</td>
                <td className="border px-3 py-1">
                  <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(log.ai_output, null, 2)}</pre>
                </td>
                <td className="border px-3 py-1">
                  <pre className="whitespace-pre-wrap text-xs">{log.correction ? JSON.stringify(log.correction, null, 2) : ""}</pre>
                </td>
                <td className="border px-3 py-1 text-xs">{log.notes}</td>
                <td className="border px-3 py-1">{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 px-3 pt-1">
          This dashboard will show real extraction logs as you connect storage/backends.
        </p>
      </div>
    </div>
  );
};

export default AdminAiLogDashboard;

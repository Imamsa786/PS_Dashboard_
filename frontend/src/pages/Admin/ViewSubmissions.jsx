import React, { useState, useEffect } from 'react';
import { Download, Users, Trash2 } from 'lucide-react';
import api from '../../api';

const ViewSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data } = await api.get('/submissions');
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/submissions/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'submissions.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert('Error exporting datat');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all submissions?')) {
      try {
        await api.delete('/submissions');
        fetchSubmissions();
      } catch (error) {
        alert('Error clearing submissions');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Team Submissions</h1>
        <p className="text-gray-400">View all problem statement selections and export data.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="glass-panel px-6 py-4 rounded-xl flex items-center space-x-4">
          <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Total Submissions</p>
            <p className="text-2xl font-bold text-white">{submissions.length}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleClearAll}
            disabled={submissions.length === 0}
            className="flex items-center space-x-2 bg-[#1a2333] border border-[#1e293b] hover:border-red-500/50 hover:text-red-400 text-gray-300 font-medium px-4 py-2.5 rounded-lg transition-all disabled:opacity-50"
          >
            <Trash2 size={18} />
            <span>Clear Data</span>
          </button>
          <button
            onClick={handleExport}
            disabled={submissions.length === 0}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-green-500/25 disabled:opacity-50"
          >
            <Download size={18} />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-xl border border-[#1e293b]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#131b2c] border-b border-[#1e293b] text-sm font-medium text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Team No</th>
                <th className="px-6 py-4">Team Name</th>
                <th className="px-6 py-4">PS No</th>
                <th className="px-6 py-4 hidden sm:table-cell">Problem Statement Title</th>
                <th className="px-6 py-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Loading submissions...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No submissions recorded yet.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-[#1a2333]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                      {sub.teamNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {sub.teamName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-1 rounded border border-blue-500/20">
                        {sub.psNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 hidden sm:table-cell">
                      {sub.psTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewSubmissions;

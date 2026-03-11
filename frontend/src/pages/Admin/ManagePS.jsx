import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, Edit2, X } from 'lucide-react';
import api from '../../api';

const ManagePS = () => {
  const [problemStatements, setProblemStatements] = useState([]);
  const [psNumber, setPsNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchPS = async () => {
      try {
        const { data } = await api.get('/problem-statements');
        setProblemStatements(data);
      } catch (error) {
        console.error('Error fetching problem statements', error);
      }
    };
    fetchPS();
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/problem-statements/${editingId}`, { psNumber, title, description });
      } else {
        await api.post('/problem-statements', { psNumber, title, description });
      }
      resetForm();
      setRefresh((prev) => !prev);
    } catch (error) {
      alert(error.response?.data?.message || `Error ${editingId ? 'updating' : 'adding'} PS`);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (ps) => {
    setEditingId(ps._id);
    setPsNumber(ps.psNumber);
    setTitle(ps.title);
    setDescription(ps.description);
  };

  const resetForm = () => {
    setEditingId(null);
    setPsNumber('');
    setTitle('');
    setDescription('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem statement?')) {
      try {
        await api.delete(`/problem-statements/${id}`);
        setRefresh((prev) => !prev);
      } catch (error) {
        alert('Error deleting PS');
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('WARNING: Are you sure you want to delete ALL problem statements? This cannot be undone.')) {
      try {
        await api.delete('/problem-statements');
        setRefresh((prev) => !prev);
      } catch (error) {
        alert('Error clearing PS');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Manage Problem Statements</h1>
        <p className="text-gray-400">Add, view, and remove problem statements available for teams.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center justify-between text-white">
              <span className="flex items-center">
                {editingId ? <Edit2 className="mr-2 text-blue-400" size={24} /> : <Plus className="mr-2 text-blue-400" size={24} />}
                {editingId ? 'Edit PS' : 'Add New PS'}
              </span>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white transition-colors" title="Cancel Edit">
                  <X size={20} />
                </button>
              )}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">PS Number</label>
                <input
                  type="text"
                  value={psNumber}
                  onChange={(e) => setPsNumber(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. PS-01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Problem Statement Title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 min-h-[100px]"
                  placeholder="Brief description of the problem statement"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (editingId ? 'Updating...' : 'Adding...') : editingId ? 'Update Problem Statement' : 'Add Problem Statement'}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Existing Statements</h2>
              {problemStatements.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                >
                  <AlertTriangle size={16} className="mr-1.5" />
                  Clear All
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto">
              <div className="space-y-3">
                {problemStatements.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No problem statements found. Add some to get started.
                  </div>
                ) : (
                  problemStatements.map((ps) => (
                    <div key={ps._id} className="bg-[#0b0f19]/50 border border-[#1e293b] rounded-lg p-4 flex justify-between items-start group hover:border-blue-500/30 transition-colors">
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2.5 py-1 rounded">
                            {ps.psNumber}
                          </span>
                          <h3 className="font-semibold text-white">{ps.title}</h3>
                        </div>
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2 whitespace-pre-wrap">{ps.description}</p>
                      </div>
                      <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
                        <button
                          onClick={() => startEdit(ps)}
                          className="text-gray-500 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-400/10 transition"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(ps._id)}
                          className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePS;

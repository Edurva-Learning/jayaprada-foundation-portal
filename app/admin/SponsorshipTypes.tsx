
'use client';
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import Skeleton from '@mui/material/Skeleton';

const API_BASE = 'https://api.jpf-portal-api.com/sponsorships';

interface Sponsorship {
  id: number;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  status: string;
}

const SponsorshipTypes: React.FC = () => {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });

  // ✅ Fetch all sponsorships
  const fetchSponsorships = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      const data = await res.json();
      setSponsorships(data);
    } catch (err) {
      console.error('Error fetching sponsorships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorships();
  }, []);

  // ✅ Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Open modal (for Add or Edit)
  const handleOpenModal = (s?: Sponsorship) => {
    if (s) {
      // Edit mode
      setEditingId(s.id);
      setFormData({
        name: s.name,
        description: s.description,
        status: s.status,
      });
    } else {
      // Add mode
      setEditingId(null);
      setFormData({ name: '', description: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  // ✅ Close modal
  const handleClose = () => {
    setIsModalOpen(false);
    setFormData({ name: '', description: '', status: 'active' });
    setEditingId(null);
  };

  // ✅ Create or Update sponsorship
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          status: formData.status,
          created_by: 'Administrator',
        }),
      });

      if (!res.ok) throw new Error('Failed to save sponsorship');

      await fetchSponsorships();
      handleClose();
    } catch (err) {
      console.error('Error saving sponsorship:', err);
      alert('Failed to save sponsorship');
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete sponsorship
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this sponsorship?')) return;

    try {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      await fetchSponsorships();
    } catch (err) {
      console.error('Error deleting sponsorship:', err);
    }
  };

  return (
 <div className="min-h-screen bg-gray-50 p-6">
      {/* Simple Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sponsorship Management</h1>
      </div>

      {/* Add Button */}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 shadow-sm"
        >
          <Plus size={18} /> Add Sponsorship
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Sponsorship' : 'Add Sponsorship'}
              </h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y"
                  required
                />
              </div>
              {editingId && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                      Saving...
                    </>
                  ) : editingId ? (
                    'Update'
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sponsorship Table / Skeleton */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} variant="rectangular" height={40} />
            ))}
          </div>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3 border-b">ID</th>
                <th className="px-4 py-3 border-b">Name</th>
                <th className="px-4 py-3 border-b">Description</th>
                <th className="px-4 py-3 border-b">Created By</th>
                <th className="px-4 py-3 border-b">Created At</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sponsorships.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{s.id}</td>
                  <td className="px-4 py-3 border-b font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 border-b text-gray-700">{s.description}</td>
                  <td className="px-4 py-3 border-b">{s.created_by}</td>
                  <td className="px-4 py-3 border-b">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700">
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b flex justify-center gap-3">
                    <button
                      onClick={() => handleOpenModal(s)}
                      className="text-gray-600 hover:text-blue-500"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-gray-600 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {sponsorships.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No sponsorships found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SponsorshipTypes;

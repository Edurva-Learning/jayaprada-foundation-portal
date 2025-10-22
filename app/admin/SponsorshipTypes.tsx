'use client';
import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

const initialSponsorshipTypes = [
  {
    id: 1,
    name: 'Education Fee Scholarship',
    description: 'Full tuition fee support for underprivileged students',
    createdBy: 'Admin User',
    createdAt: '2024-01-10',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Book & Supplies Grant',
    description: 'Support for educational materials and supplies',
    createdBy: 'Admin User',
    createdAt: '2024-01-15',
    status: 'Active',
  },
];

const SponsorshipTypes: React.FC = () => {
  const [sponsorshipTypes, setSponsorshipTypes] = useState(initialSponsorshipTypes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newType = {
      id: sponsorshipTypes.length + 1,
      name: formData.name,
      description: formData.description,
      createdBy: 'Admin User',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    setSponsorshipTypes((prev) => [...prev, newType]);
    setFormData({ name: '', description: '' });
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setFormData({ name: '', description: '' });
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 shadow-sm"
        >
          <Plus size={18} /> Add Type
        </button>
      </div>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold">Add Sponsorship Type</h2>
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
                <div className="mb-6">
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
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Save Sponsorship
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
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
            {sponsorshipTypes.map((type) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b">{type.id}</td>
                <td className="px-4 py-3 border-b font-medium text-gray-800">{type.name}</td>
                <td className="px-4 py-3 border-b text-gray-700">{type.description}</td>
                <td className="px-4 py-3 border-b">{type.createdBy}</td>
                <td className="px-4 py-3 border-b">{type.createdAt}</td>
                <td className="px-4 py-3 border-b">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700">
                    {type.status}
                  </span>
                </td>
                <td className="px-4 py-3 border-b flex justify-center gap-3">
                  <button className="text-gray-600 hover:text-blue-500">
                    <Pencil size={16} />
                  </button>
                  <button className="text-gray-600 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SponsorshipTypes;
'use client';
import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X, Calendar } from 'lucide-react';

const initialCamps = [
  {
    id: 1,
    name: 'Free Health Checkup Camp',
    date: '2024-03-15',
    location: 'Community Center, Delhi',
    services: 'General Checkup, Blood Pressure, Diabetes Screening',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Eye Care Camp',
    date: '2024-04-20',
    location: 'Rural Healthcare Center',
    services: 'Vision Testing, Free Glasses Distribution',
    status: 'Completed',
  },
];

const CampManagement: React.FC = () => {
  const [camps, setCamps] = useState(initialCamps);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    services: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp = {
      id: camps.length + 1,
      name: formData.name,
      date: formData.date,
      location: formData.location,
      services: formData.services,
      status: 'Active',
    };
    setCamps((prev) => [...prev, newCamp]);
    setFormData({ name: '', date: '', location: '', services: '' });
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setFormData({ name: '', date: '', location: '', services: '' });
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 shadow-sm"
        >
          <Plus size={18} /> Add Camp
        </button>
      </div>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold">Add New Camp</h2>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Camp Name</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
                  <textarea
                    name="services"
                    value={formData.services}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                    Save Camp
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
              <th className="px-4 py-3 border-b">Date</th>
              <th className="px-4 py-3 border-b">Location</th>
              <th className="px-4 py-3 border-b">Services</th>
              <th className="px-4 py-3 border-b">Status</th>
              <th className="px-4 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {camps.map((camp) => (
              <tr key={camp.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b">{camp.id}</td>
                <td className="px-4 py-3 border-b text-blue-700 hover:underline cursor-pointer">
                  {camp.name}
                </td>
                <td className="px-4 py-3 border-b">{camp.date}</td>
                <td className="px-4 py-3 border-b">{camp.location}</td>
                <td className="px-4 py-3 border-b">{camp.services}</td>
                <td className="px-4 py-3 border-b">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      camp.status === 'Active'
                        ? 'bg-cyan-100 text-cyan-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {camp.status}
                  </span>
                </td>
                <td className="px-4 py-3 border-b flex items-center gap-3">
                  <button className="text-gray-600 hover:text-blue-500">
                    <Pencil size={18} />
                  </button>
                  <button className="text-gray-600 hover:text-red-500">
                    <Trash2 size={18} />
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

export default CampManagement;
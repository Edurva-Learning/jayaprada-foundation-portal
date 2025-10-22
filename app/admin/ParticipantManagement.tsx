'use client';
import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X , Eye} from 'lucide-react';

const initialParticipants = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 43210',
    aadhar: '1234-5678-9012',
    address: '',
    registrationSource: 'Health Camp',
    createdAt: '2024-03-15',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    age: 28,
    gender: 'Female',
    phone: '+91 87654 32109',
    aadhar: '2345-6789-0123',
    address: '',
    registrationSource: 'Education Program',
    createdAt: '2024-03-18',
  },
];

const ParticipantManagement: React.FC = () => {
  const [participants, setParticipants] = useState(initialParticipants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    aadhar: '',
    age: '',
    gender: 'Male',
    phone: '',
    address: '',
    registrationSource: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParticipant = {
      id: participants.length + 1,
      name: formData.name,
      age: parseInt(formData.age) || 0,
      gender: formData.gender,
      phone: formData.phone,
      aadhar: formData.aadhar,
      address: formData.address,
      registrationSource: formData.registrationSource,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setParticipants((prev) => [...prev, newParticipant]);
    setFormData({
      name: '',
      aadhar: '',
      age: '',
      gender: 'Male',
      phone: '',
      address: '',
      registrationSource: '',
    });
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      aadhar: '',
      age: '',
      gender: 'Male',
      phone: '',
      address: '',
      registrationSource: '',
    });
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 shadow-sm"
        >
          <Plus size={18} /> Add Participant
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by Name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="text"
          placeholder="Search by Aadhar"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="text"
          placeholder="Search by Phone"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold">Add New Participant</h2>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                  <input
                    type="text"
                    name="aadhar"
                    value={formData.aadhar}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                        <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Source <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="registrationSource"
                    value={formData.registrationSource}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="">Select Registration Source</option>
                     <option value="Health Camp">Women Empowerment</option>
                    <option value="Health Camp">Health Camp</option>
                    <option value="Health Camp">Girl Child Support </option>
                    <option value="Education Program">Education Sponsorship</option>
                    <option value="Online Registration">Bereavement Support</option>
                  
                  </select>
                </div>
                <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
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
                    Save Participant
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
              <th className="px-4 py-3 border-b">Age</th>
              <th className="px-4 py-3 border-b">Gender</th>
              <th className="px-4 py-3 border-b">Phone</th>
              <th className="px-4 py-3 border-b">Aadhar</th>
              <th className="px-4 py-3 border-b">Registration Source</th>
              <th className="px-4 py-3 border-b">Created At</th>
              <th className="px-4 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b">{p.id}</td>
                <td className="px-4 py-3 border-b font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-3 border-b">{p.age}</td>
                <td className="px-4 py-3 border-b">{p.gender}</td>
                <td className="px-4 py-3 border-b">{p.phone}</td>
                <td className="px-4 py-3 border-b">{p.aadhar}</td>
                <td className="px-4 py-3 border-b text-gray-700">{p.registrationSource}</td>
                <td className="px-4 py-3 border-b">{p.createdAt}</td>
                <td className="px-4 py-3 border-b flex items-center gap-3">
                  <button className="text-gray-600 hover:text-blue-500">
                    <Eye size={18} />
                  </button>

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

export default ParticipantManagement;
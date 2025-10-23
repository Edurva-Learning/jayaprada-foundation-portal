// components/SponsorshipsList.tsx
'use client';

import { useState } from 'react';
import { Edit, Filter, Search, X } from 'lucide-react';

interface Sponsorship {
  id: number;
  sponsorName: string;
  type: string;
  amount: string;
  startDate: string;
  status: 'Active' | 'Completed';
  createdAt: string;
}

const sponsorships: Sponsorship[] = [
  {
    id: 1,
    sponsorName: 'Ramesh Patel',
    type: 'Education Fee Scholarship',
    amount: '₹25,000',
    startDate: '2024-01-15',
    status: 'Active',
    createdAt: '2024-01-10',
  },
  {
    id: 2,
    sponsorName: 'Sunita Sharma',
    type: 'Book & Supplies Grant',
    amount: '₹5,000',
    startDate: '2024-02-01',
    status: 'Active',
    createdAt: '2024-01-25',
  },
  {
    id: 3,
    sponsorName: 'Vikram Singh',
    type: 'Uniform Allowance',
    amount: '₹3,000',
    startDate: '2023-11-15',
    status: 'Completed',
    createdAt: '2023-11-10',
  },
];

const SponsorshipsList: React.FC = () => {
  const [sponsorshipType, setSponsorshipType] = useState('');
  const [status, setStatus] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={openModal}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center shadow-sm transition-colors"
        >
          + Add Sponsorship
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            Filters
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Sponsorship Type</label>
            <select
              value={sponsorshipType}
              onChange={(e) => setSponsorshipType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="education-fee">Education Fee Scholarship</option>
              <option value="book-grant">Book & Supplies Grant</option>
              <option value="uniform">Uniform Allowance</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex flex-col md:col-span-3 lg:col-span-1">
            <label className="text-sm font-medium text-gray-700 mb-1">Search by Sponsor Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search sponsors..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-2 md:justify-end">
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors flex items-center">
              Apply Filters
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 shadow-sm transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sponsor Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sponsorships.map((sponsorship) => (
              <tr key={sponsorship.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {sponsorship.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sponsorship.sponsorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sponsorship.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sponsorship.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sponsorship.startDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusColor(
                      sponsorship.status
                    )}`}
                  >
                    {sponsorship.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sponsorship.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Sponsorship Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto text-gray-500">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Sponsorship</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Personal Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name of Sponsorship To <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Father Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter father name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhar Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter Aadhar number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Father Aadhar Number</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter father Aadhar number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Father Mobile Number</label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter mobile number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                      placeholder="Enter address"
                    />
                  </div>
                </div>

                {/* Right Column: Sponsorship Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Other Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sponsorship Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option>Select Type</option>
                        <option>Education Fee Scholarship</option>
                        <option>Book & Supplies Grant</option>
                        <option>Uniform Allowance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-10"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-10"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        defaultValue="Active"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option>Active</option>
                        <option>Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors">
                Save Sponsorship
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SponsorshipsList;
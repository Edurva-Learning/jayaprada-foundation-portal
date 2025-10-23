'use client';

import { useState } from 'react';
import { Filter, Search, Calendar, Plus } from 'lucide-react';

interface ExpenseType {
  name: string;
  amount: string;
}

interface ExpenseRecord {
  id: string;
  type: string;
  camp: string;
  description: string;
  amount: string;
  date: string;
  receipt: string;
  createdAt: string;
  actions: string;
}

const FinancePage: React.FC = () => {
  const [filters, setFilters] = useState({
    expenseType: '',
    description: '',
    campName: '',
    dateFrom: '',
  });

  const expenseTypes: ExpenseType[] = [
    { name: 'Health Camp', amount: '₹16,000.00' },
    { name: 'Education Sponsorship', amount: '₹25,000.00' },
    { name: 'Women Empowerment', amount: '₹0.00' },
    { name: 'Community Outreach', amount: '₹30,000.00' },
    { name: 'Book Publication', amount: '₹0.00' },
    { name: 'Awareness Program', amount: '₹0.00' },
    { name: 'Purchase', amount: '₹0.00' },
    { name: 'Salaries', amount: '₹0.00' },
    { name: 'Maintenance', amount: '₹0.00' },
    { name: 'Rent', amount: '₹0.00' },
    { name: 'Logistics', amount: '₹0.00' },
    { name: 'Travel', amount: '₹0.00' },
    { name: 'Fuel', amount: '₹0.00' },
    { name: 'Others', amount: '₹0.00' },
  ];

  const expenseRecords: ExpenseRecord[] = [
    {
      id: '2',
      type: 'Health Camp',
      camp: 'Cancer Screening - 2025-09-22 - Guntur',
      description: 'Travel...',
      amount: '₹1,000.00',
      date: 'Sep 19, 2025',
      receipt: 'Jan 1, 1970',
      createdAt: '✅',
      actions: '✅',
    },
    {
      id: '1',
      type: 'Health Camp',
      camp: '',
      description: 'Travel Bramp; Logistics...',
      amount: '₹15,000.00',
      date: 'Sep 18, 2025',
      receipt: 'Jan 1, 1970',
      createdAt: '✅',
      actions: '✅',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Finance & Audit</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Financial management and audit tracking</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Total Expenses</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">₹16,000.00</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Community Outreach</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">₹30,000.00</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Sponsorship Provided</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">₹25,000.00</p>
            </div>
          </div>

          {/* Expense Type Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Expense Type Breakdown</h2>
                <div className="text-sm text-gray-500">1 Expense Type</div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
                {expenseTypes.map((type, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-blue-50 rounded-lg p-3 mb-2">
                      <p className="text-sm sm:text-lg font-semibold text-blue-600">{type.amount}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-tight">{type.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Expenses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expense Type</label>
                <select 
                  className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  value={filters.expenseType}
                  onChange={(e) => setFilters({ ...filters, expenseType: e.target.value })}
                >
                  <option value="">All Expense Types</option>
                  <option value="health-camp">Health Camp</option>
                  <option value="education">Education Sponsorship</option>
                  <option value="community">Community Outreach</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Search description"
                    value={filters.description}
                    onChange={(e) => setFilters({ ...filters, description: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Camp Name</label>
                <select 
                  className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  value={filters.campName}
                  onChange={(e) => setFilters({ ...filters, campName: e.target.value })}
                >
                  <option value="">All Camps</option>
                  <option value="cancer-screening">Cancer Screening</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </button>
              <button 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setFilters({ expenseType: '', description: '', campName: '', dateFrom: '' })}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Expense Records */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Expense Records</h2>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </button>
            </div>
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camp</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenseRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.type}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 max-w-[150px] truncate" title={record.camp}>
                          {record.camp}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 max-w-[120px] truncate" title={record.description}>
                          {record.description}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{record.amount}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{record.date}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{record.receipt}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">{record.createdAt}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">{record.actions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
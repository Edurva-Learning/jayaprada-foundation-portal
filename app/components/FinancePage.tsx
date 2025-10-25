'use client';

import { useState, useEffect } from 'react';
import { Filter, Search, Calendar, Plus, Edit, Trash2, X, Save, Loader } from 'lucide-react';

interface ExpenseRecord {
  id: string;
  expense_type: string;
  expense_description: string;
  expense_amount: string;
  expense_date: string;
  details: string;
  receipt_image?: string;
  created_at: string;
  updated_at: string;
}

interface ExpenseFormData {
  expense_type: string;
  expense_description: string;
  expense_amount: string;
  expense_date: string;
  details: string;
  receipt?: File | null;
}

const FinancePage: React.FC = () => {
  const [filters, setFilters] = useState({
    expenseType: '',
    description: '',
    dateFrom: '',
  });

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState<ExpenseFormData>({
    expense_type: '',
    expense_description: '',
    expense_amount: '',
    expense_date: '',
    details: '',
    receipt: null,
  });

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.jpf-portal-api.com/expenses');
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenseRecords(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      alert('Error fetching expenses. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Calculate totals dynamically
  const totalExpenses = expenseRecords.reduce((sum, record) => {
    return sum + parseFloat(record.expense_amount || '0');
  }, 0);

  const expenseTypeTotals = expenseRecords.reduce((acc, record) => {
    const type = record.expense_type;
    const amount = parseFloat(record.expense_amount || '0');
    acc[type] = (acc[type] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseTypeOptions = [
    'Health Camp',
    'Education Sponsorship',
    'Women Empowerment',
    'Community Outreach',
    'Book Publication',
    'Awareness Program',
    'Purchase',
    'Salaries',
    'Maintenance',
    'Rent',
    'Logistics',
    'Travel',
    'Fuel',
    'Others'
  ];

  const resetForm = () => {
    setFormData({
      expense_type: '',
      expense_description: '',
      expense_amount: '',
      expense_date: '',
      details: '',
      receipt: null,
    });
    setEditingExpense(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const submitData = {
        expense_type: formData.expense_type,
        expense_description: formData.expense_description,
        expense_amount: formData.expense_amount,
        expense_date: formData.expense_date,
        details: formData.details,
      };

      let response;
      if (editingExpense) {
        // Update existing expense
        response = await fetch(`https://api.jpf-portal-api.com/expenses/${editingExpense.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      } else {
        // Create new expense
        response = await fetch('https://api.jpf-portal-api.com/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save expense');
      }

      await fetchExpenses();
      setShowExpenseForm(false);
      resetForm();
      alert(`Expense ${editingExpense ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (expense: ExpenseRecord) => {
    setEditingExpense(expense);
    setFormData({
      expense_type: expense.expense_type,
      expense_description: expense.expense_description,
      expense_amount: expense.expense_amount,
      expense_date: expense.expense_date,
      details: expense.details,
      receipt: null,
    });
    setShowExpenseForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const response = await fetch(`https://api.jpf-portal-api.com/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      await fetchExpenses();
      alert('Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error deleting expense. Please try again.');
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter expenses based on filter criteria
  const filteredExpenses = expenseRecords.filter(expense => {
    const matchesType = !filters.expenseType || expense.expense_type === filters.expenseType;
    const matchesDescription = !filters.description || 
      expense.expense_description.toLowerCase().includes(filters.description.toLowerCase());
    const matchesDate = !filters.dateFrom || expense.expense_date >= filters.dateFrom;
    
    return matchesType && matchesDescription && matchesDate;
  });

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
            <div className="p-4 border border-[#90e0ef] rounded-lg bg-[#caf0f8] text-center shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Total Expenses</h3>
              <p className="text-xl sm:text-2xl font-bold text-[#00b4d8]">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="p-4 border border-[#90e0ef] rounded-lg bg-[#caf0f8] text-center shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Community Outreach</h3>
              <p className="text-xl sm:text-2xl font-bold text-[#00b4d8]">
                {formatCurrency(expenseTypeTotals['Community Outreach'] || 0)}
              </p>
            </div>
            <div className="p-4 border border-[#90e0ef] rounded-lg bg-[#caf0f8] text-center shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Education Sponsorship</h3>
              <p className="text-xl sm:text-2xl font-bold text-[#00b4d8]">
                {formatCurrency(expenseTypeTotals['Education Sponsorship'] || 0)}
              </p>
            </div>
          </div>

          {/* Expense Type Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Expense Type Breakdown</h2>
                <div className="text-sm text-gray-500">
                  {Object.keys(expenseTypeTotals).length} Expense Types
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
                {expenseTypeOptions.map((type, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-blue-50 rounded-lg p-3 mb-2">
                      <p className="text-sm sm:text-lg font-semibold text-blue-600">
                        {formatCurrency(expenseTypeTotals[type] || 0)}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-tight">{type}</p>
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
                  {expenseTypeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
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
              <button 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#00b4d8] hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => fetchExpenses()}
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </button>
              <button 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setFilters({ expenseType: '', description: '', dateFrom: '' })}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Expense Records */}
          <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Expense Records</h2>
              <button 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#00b4d8] hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                onClick={() => {
                  resetForm();
                  setShowExpenseForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
                      <tr>
                        <th className="p-3 font-semibold">ID</th>
                        <th className="p-3 font-semibold">Type</th>
                        <th className="p-3 font-semibold">Description</th>
                        <th className="p-3 font-semibold">Amount</th>
                        <th className="p-3 font-semibold">Date</th>
                        <th className="p-3 font-semibold">Details</th>
                        <th className="p-3 font-semibold">Created</th>
                        <th className="p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredExpenses.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.expense_type}</td>
                          <td className="px-4 py-4 text-sm text-gray-600 max-w-[150px] truncate" title={record.expense_description}>
                            {record.expense_description}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                            {formatCurrency(record.expense_amount)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(record.expense_date)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 max-w-[120px] truncate" title={record.details}>
                            {record.details}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(record.created_at)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(record)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(record.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredExpenses.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No expenses found. {expenseRecords.length === 0 ? 'Add your first expense!' : 'Try changing your filters.'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                </h2>
                <button
                  onClick={() => {
                    setShowExpenseForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Expense Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Type *
                </label>
                <select
                  required
                  className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  value={formData.expense_type}
                  onChange={(e) => setFormData({ ...formData, expense_type: e.target.value })}
                >
                  <option value="">Select Expense Type</option>
                  {expenseTypeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Expense Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Description *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  placeholder="Enter expense description"
                  value={formData.expense_description}
                  onChange={(e) => setFormData({ ...formData, expense_description: e.target.value })}
                />
              </div>

              {/* Expense Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Amount *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  placeholder="Enter amount"
                  value={formData.expense_amount}
                  onChange={(e) => setFormData({ ...formData, expense_amount: e.target.value })}
                />
              </div>

              {/* Expense Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Date *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  value={formData.expense_date}
                  onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                />
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Details
                </label>
                <textarea
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  placeholder="Enter additional details"
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                />
              </div>

              {/* Receipt Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt Image (Max 200KB, JPG/PNG)
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => setFormData({ ...formData, receipt: e.target.files?.[0] || null })}
                />
                <p className="text-xs text-gray-500 mt-1">Note: For Health Camp expenses, select the camp from the dropdown above.</p>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowExpenseForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {editingExpense ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePage;
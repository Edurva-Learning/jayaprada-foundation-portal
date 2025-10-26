'use client';

import { useState, useEffect } from 'react';
import { Edit, Filter, Search, X, Loader2, Plus, Trash2, Save } from 'lucide-react';

interface Sponsorship {
  id: number;
  name_of_sponsorship: string;
  father_name: string;
  aadhar_number: string;
  father_aadhar_number: string;
  father_mobile_number: string;
  address: string;
  other_information: string;
  sponsorship_type: string;
  amount: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

interface SponsorshipType {
  id: number;
  name: string;
  description: string;
  status: string;
}

const SponsorshipsList: React.FC = () => {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [filteredSponsorships, setFilteredSponsorships] = useState<Sponsorship[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState('');
  const [sponsorshipTypes, setSponsorshipTypes] = useState<SponsorshipType[]>([]);

  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });

  const [formData, setFormData] = useState({
    name_of_sponsorship: '',
    father_name: '',
    aadhar_number: '',
    father_aadhar_number: '',
    father_mobile_number: '',
    address: '',
    other_information: '',
    sponsorship_type: '',
    amount: '',
    start_date: '',
    end_date: '',
    status: 'Active',
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // ✅ Fetch Sponsorships
  const fetchSponsorships = async () => {
    try {
      const res = await fetch('https://api.jpf-portal-api.com/edu-sponsorships');
      const data = await res.json();
      setSponsorships(data);
      setFilteredSponsorships(data);
    } catch (err) {
      console.error('Error fetching sponsorships:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Sponsorship Types
  const fetchSponsorshipTypes = async () => {
    try {
      setTypesLoading(true);
      const res = await fetch('https://api.jpf-portal-api.com/sponsorshiptypes');
      if (!res.ok) throw new Error('Failed to fetch types');
      const data = await res.json();
      setSponsorshipTypes(data);
    } catch (err) {
      console.error('Error fetching types:', err);
      setTypesError('Failed to load sponsorship types');
    } finally {
      setTypesLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorships();
    fetchSponsorshipTypes();
  }, []);

  // ✅ Filter Logic
  useEffect(() => {
    let filtered = [...sponsorships];

    if (filters.type) filtered = filtered.filter(s => s.sponsorship_type === filters.type);
    if (filters.status) filtered = filtered.filter(s => s.status === filters.status);
    if (filters.search) {
      filtered = filtered.filter(s =>
        s.name_of_sponsorship.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.father_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredSponsorships(filtered);
  }, [sponsorships, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => setFilters({ type: '', status: '', search: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name_of_sponsorship: '',
      father_name: '',
      aadhar_number: '',
      father_aadhar_number: '',
      father_mobile_number: '',
      address: '',
      other_information: '',
      sponsorship_type: '',
      amount: '',
      start_date: '',
      end_date: '',
      status: 'Active',
    });
    setEditingId(null);
  };

  // ✅ Submit New/Update Sponsorship
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId 
        ? `https://api.jpf-portal-api.com/edu-sponsorships/${editingId}`
        : 'https://api.jpf-portal-api.com/edu-sponsorships';
      
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const savedSponsorship = await res.json();
        if (editingId) {
          setSponsorships(prev => prev.map(s => s.id === editingId ? savedSponsorship : s));
        } else {
          setSponsorships(prev => [savedSponsorship, ...prev]);
        }
        resetForm();
        setIsModalOpen(false);
        alert(`✅ Sponsorship ${editingId ? 'updated' : 'added'} successfully!`);
      } else {
        alert('❌ Failed to save sponsorship.');
      }
    } catch (err) {
      console.error('Error saving sponsorship:', err);
      alert('⚠️ Error saving sponsorship.');
    } finally {
      setSaving(false);
    }
  };

  // ✅ Edit Sponsorship
  const handleEdit = (sponsorship: Sponsorship) => {
    setFormData({
      name_of_sponsorship: sponsorship.name_of_sponsorship,
      father_name: sponsorship.father_name,
      aadhar_number: sponsorship.aadhar_number,
      father_aadhar_number: sponsorship.father_aadhar_number,
      father_mobile_number: sponsorship.father_mobile_number,
      address: sponsorship.address,
      other_information: sponsorship.other_information,
      sponsorship_type: sponsorship.sponsorship_type,
      amount: sponsorship.amount,
      start_date: sponsorship.start_date,
      end_date: sponsorship.end_date,
      status: sponsorship.status,
    });
    setEditingId(sponsorship.id);
    setIsModalOpen(true);
  };

  // ✅ Delete Sponsorship
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sponsorship?')) {
      return;
    }

    try {
      const res = await fetch(`https://api.jpf-portal-api.com/edu-sponsorships/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSponsorships(prev => prev.filter(s => s.id !== id));
        alert('✅ Sponsorship deleted successfully!');
      } else {
        alert('❌ Failed to delete sponsorship.');
      }
    } catch (err) {
      console.error('Error deleting sponsorship:', err);
      alert('⚠️ Error deleting sponsorship.');
    }
  };

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

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <>
      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-[#00b4d8] hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sponsorship
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-4">
          <Filter className="w-4 h-4 mr-2 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">All Types</option>
              {sponsorshipTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by sponsor name"
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm mb-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Start Date</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Created At</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSponsorships.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{s.id}</td>
                  <td className="px-6 py-4 text-sm">{s.name_of_sponsorship}</td>
                  <td className="px-6 py-4 text-sm">{s.sponsorship_type}</td>
                  <td className="px-6 py-4 text-sm">₹{s.amount}</td>
                  <td className="px-6 py-4 text-sm">{formatDate(s.start_date)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusColor(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(s.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? 'Edit Sponsorship' : 'Add New Sponsorship'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Name of Sponsorship */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name of Sponsorship To *
                </label>
                <input
                  name="name_of_sponsorship"
                  value={formData.name_of_sponsorship}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>

              {/* Personal Information Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father Name
                    </label>
                    <input
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhar Information
                    </label>
                    <input
                      name="aadhar_number"
                      value={formData.aadhar_number}
                      onChange={handleChange}
                      placeholder="Aadhar Number"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    <input
                      name="father_aadhar_number"
                      value={formData.father_aadhar_number}
                      onChange={handleChange}
                      placeholder="Father Aadhar Number"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father Mobile Number
                    </label>
                    <input
                      name="father_mobile_number"
                      value={formData.father_mobile_number}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Other Information
                    </label>
                    <textarea
                      name="other_information"
                      value={formData.other_information}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sponsorship Details Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sponsorship Type *
                    </label>
                    <select
                      name="sponsorship_type"
                      value={formData.sponsorship_type}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      required
                      disabled={typesLoading}
                    >
                      <option value="">
                        {typesLoading ? 'Loading types...' : 'Select Type'}
                      </option>
                      {typesError ? (
                        <option disabled>{typesError}</option>
                      ) : (
                        sponsorshipTypes.map((type) => (
                          <option key={type.id} value={type.name}>
                            {type.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (₹) *
                    </label>
                    <input
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Address Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {editingId ? 'Update Sponsorship' : 'Save Sponsorship'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default SponsorshipsList;
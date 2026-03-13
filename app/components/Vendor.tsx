'use client';

import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000';

interface Vendor {
  id: number;
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gstNumber: string;
  status: 'Active' | 'Inactive';
}

// Helper to convert snake_case DB object to camelCase Vendor
const toCamelCase = (dbObj: any): Vendor => ({
  id: dbObj.id,
  vendorName: dbObj.vendor_name,
  contactPerson: dbObj.contact_person,
  phone: dbObj.phone,
  email: dbObj.email,
  address: dbObj.address,
  gstNumber: dbObj.gst_number,
  status: dbObj.status,
});

const VendorPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newVendor, setNewVendor] = useState({
    vendorName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: ''
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/vendors`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      // Convert each vendor from snake_case to camelCase
      setVendors(data.map(toCamelCase));
    } catch (error) {
      console.error('Error fetching vendors:', error);
      alert('Failed to load vendors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewVendor(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.vendorName.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor)
      });

      if (!response.ok) throw new Error('Failed to add vendor');

      const result = await response.json();
      // Convert the returned vendor and add to list
      setVendors(prev => [toCamelCase(result.data), ...prev]);

      setNewVendor({
        vendorName: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        gstNumber: ''
      });
    } catch (error) {
      console.error('Error adding vendor:', error);
      alert('Failed to add vendor. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      const result = await response.json();
      // Convert the updated vendor and replace in list
      setVendors(prev =>
        prev.map(v => (v.id === id ? toCamelCase(result.data) : v))
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Vendor Management</h1>
          <p className="text-gray-600 mt-2">Manage medicine vendors and suppliers</p>
        </div>

        <div>
          {/* Add New Vendor Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Vendor</h2>

            <form onSubmit={handleAddVendor} className="space-y-4">
              {/* Form fields remain exactly as you had them */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vendorName"
                  value={newVendor.vendorName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="Enter vendor name"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={newVendor.contactPerson}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="Enter contact person name"
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={newVendor.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="Enter phone number"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newVendor.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="Enter email address"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={newVendor.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="Enter full address"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={newVendor.gstNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="Enter GST number"
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#00b4d8] hover:bg-[#0099c3] text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <span className="mr-2">+</span>
                    Add Vendor
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Vendors List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Vendors List</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-[#00b4d8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vendor Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Contact Person</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Phone</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">GST No</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((vendor) => (
                      <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-800">{vendor.vendorName}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{vendor.contactPerson}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{vendor.phone}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{vendor.email || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{vendor.gstNumber || '-'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              vendor.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {vendor.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleStatus(vendor.id, vendor.status)}
                              className="text-[#00b4d8] hover:text-[#0099c3] text-sm font-medium"
                            >
                              Toggle Status
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && vendors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No vendors found. Add your first vendor above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPage;
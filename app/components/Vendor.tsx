// VendorPage.jsx
import React, { useState } from 'react';

const VendorPage = () => {
  const [vendors, setVendors] = useState([
    {
      id: 1,
      vendorName: 'Vendor',
      contactPerson: 'Person',
      phone: '102938476',
      email: '',
      address: '',
      gstNumber: '',
      status: 'Active'
    }
  ]);

  const [newVendor, setNewVendor] = useState({
    vendorName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: ''
  });

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setNewVendor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVendor = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (newVendor.vendorName.trim()) {
      const vendor = {
        id: vendors.length + 1,
        ...newVendor,
        status: 'Active'
      };
      setVendors(prev => [...prev, vendor]);
      setNewVendor({
        vendorName: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        gstNumber: ''
      });
    }
  };

  const toggleStatus = (id: number) => {
    setVendors(prev => prev.map(vendor => 
      vendor.id === id 
        ? { ...vendor, status: vendor.status === 'Active' ? 'Inactive' : 'Active' }
        : vendor
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Vendor Management</h1>
          <p className="text-gray-600 mt-2">Manage medicine vendors and suppliers</p>
        </div>

        <div>
          {/* Add New Vendor Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Vendor</h2>
            
            <form onSubmit={handleAddVendor} className="space-y-4">
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
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00b4d8] hover:bg-[#0099c3] text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
              >
                <span className="mr-2">+</span>
                Add Vendor
              </button>
            </form>
          </div>

          {/* Vendors List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Vendors List</h2>
            
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
                            onClick={() => toggleStatus(vendor.id)}
                            className="text-[#00b4d8] hover:text-[#0099c3] text-sm font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {vendors.length === 0 && (
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
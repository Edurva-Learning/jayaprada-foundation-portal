// ItemMasterPage.jsx
import React, { useState } from 'react';

const ItemMasterPage = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      itemCode: '123',
      itemName: 'Dolo 650',
      genericName: 'Paracetamol',
      category: 'Medicine Issue',
      formType: '15Md',
      packingType: 'Tablets',
      packSize: '15 Tablets',
      minStockLevel: 0,
      maxStockLevel: 0,
      stockLevel: 'Min: 0\nMax: 0',
      status: 'Active'
    },
    {
      id: 2,
      itemCode: '131',
      itemName: 'DRYDEX SYRUP',
      genericName: 'COUGH SYRUP',
      category: 'General Medicine',
      formType: '5yrp',
      packingType: 'Bottle',
      packSize: '100ML',
      minStockLevel: 10,
      maxStockLevel: 100,
      stockLevel: 'Min: 10\nMax: 100',
      status: 'Active'
    },
    {
      id: 3,
      itemCode: '456',
      itemName: 'Eye Drops',
      genericName: 'Eye Drops',
      category: 'Medicine Issue',
      formType: '6yrp',
      packingType: 'Bottle',
      packSize: '1',
      minStockLevel: 0,
      maxStockLevel: 50,
      stockLevel: 'Min: 0\nMax: 50',
      status: 'Active'
    }
  ]);

  const [newItem, setNewItem] = useState({
    itemCode: '',
    itemName: '',
    genericName: '',
    category: '',
    description: '',
    formType: '',
    unitOfMeasure: '',
    packingType: '',
    packSize: '',
    minStockLevel: 0,
    maxStockLevel: 0
  });

  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Medicine Issue', 'General Medicine', 'Surgical', 'Others'];
  const formTypes = ['Tablets', 'Syrup', 'Injection', 'Capsule', 'Drops'];
  const packingTypes = ['Strip', 'Bottle', 'Tube', 'Vial', 'Packet'];

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (newItem.itemCode.trim() && newItem.itemName.trim()) {
      const item = {
        id: items.length + 1,
        ...newItem,
        stockLevel: `Min: ${newItem.minStockLevel}\nMax: ${newItem.maxStockLevel}`,
        status: 'Active'
      };
      setItems(prev => [...prev, item]);
      setNewItem({
        itemCode: '',
        itemName: '',
        genericName: '',
        category: '',
        description: '',
        formType: '',
        unitOfMeasure: '',
        packingType: '',
        packSize: '',
        minStockLevel: 0,
        maxStockLevel: 0
      });
    }
  };

  const toggleStatus = (id: number) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' }
        : item
    ));
  };

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Item Master Management</h1>
          <p className="text-gray-600 mt-2">Manage medicine items and inventory</p>
        </div>

        {/* Add New Item Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Item</h2>
          
          <form onSubmit={handleAddItem} className="space-y-6">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="itemCode"
                  value={newItem.itemCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="Enter item code"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={newItem.itemName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="Enter item name"
                  required
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Generic Name
                </label>
                <input
                  type="text"
                  name="genericName"
                  value={newItem.genericName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="Enter generic name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={newItem.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={newItem.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Category
                </label>
                <select
                  name="category"
                  value={newItem.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Form Type Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Form Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Form Type
                  </label>
                  <select
                    name="formType"
                    value={newItem.formType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  >
                    <option value="">Select Form Type</option>
                    {formTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit of Measure
                  </label>
                  <input
                    type="text"
                    name="unitOfMeasure"
                    value={newItem.unitOfMeasure}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="e.g., Tablets, Bottles, Strips"
                  />
                </div>
              </div>
            </div>

            {/* Packing and Stock Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Packing Type
                  </label>
                  <input
                    type="text"
                    name="packingType"
                    value={newItem.packingType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="e.g., Strip, Bottle, Tube"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Stock Level
                  </label>
                  <input
                    type="number"
                    name="minStockLevel"
                    value={newItem.minStockLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pack Size
                  </label>
                  <input
                    type="text"
                    name="packSize"
                    value={newItem.packSize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="e.g., 10 tablets, 100ml"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Stock Level
                  </label>
                  <input
                    type="number"
                    name="maxStockLevel"
                    value={newItem.maxStockLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00b4d8] hover:bg-[#0099c3] text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
            >
              <span className="mr-2">+</span>
              Add Item
            </button>
          </form>
        </div>

        {/* Items List Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Items List</h2>
            
            {/* Search Box */}
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type here to search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Item Code</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Item Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Generic Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Form Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Pack Size</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Stock Level</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-800">{item.itemCode}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{item.itemName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.genericName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.formType}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.packSize}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-pre-line">
                      Min: {item.minStockLevel}\nMax: {item.maxStockLevel}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleStatus(item.id)}
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

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No items found. {searchTerm ? 'Try a different search term.' : 'Add your first item above.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemMasterPage;
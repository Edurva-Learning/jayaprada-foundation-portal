// StockInwardPage.jsx
import React, { useState } from 'react';

const StockInwardPage = () => {
  const [stockRecords, setStockRecords] = useState([
    {
      id: 1,
      vendor: 'MediCare Suppliers',
      item: 'Dolo 650',
      batchNumber: 'BATCH001',
      expiryDate: '15-12-2024',
      quantity: 100,
      costPrice: 5.50,
      mrp: 8.00,
      invoiceNumber: 'INV-001',
      invoiceDate: '01-01-2024',
      remarks: 'Initial stock',
      dateAdded: '2024-01-01'
    },
    {
      id: 2,
      vendor: 'Pharma Distributors',
      item: 'DRYDEX SYRUP',
      batchNumber: 'BATCH002',
      expiryDate: '30-06-2024',
      quantity: 50,
      costPrice: 45.00,
      mrp: 65.00,
      invoiceNumber: 'INV-002',
      invoiceDate: '02-01-2024',
      remarks: 'Winter stock',
      dateAdded: '2024-01-02'
    }
  ]);

  const [newStock, setNewStock] = useState({
    vendor: '',
    item: '',
    batchNumber: '',
    expiryDate: '',
    quantity: '',
    costPrice: '',
    mrp: '',
    invoiceNumber: '',
    invoiceDate: '',
    remarks: ''
  });

  const vendors = [
    'MediCare Suppliers',
    'Pharma Distributors',
    'HealthCare Pharma',
    'MediPlus Distributors',
    'Global Medical'
  ];

  const items = [
    'Dolo 650',
    'DRYDEX SYRUP',
    'Eye Drops',
    'Vitamin C Tablets',
    'Pain Relief Gel',
    'Antiseptic Cream'
  ];

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setNewStock(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecordStock = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (newStock.vendor && newStock.item && newStock.batchNumber && newStock.expiryDate && newStock.quantity && newStock.costPrice) {
      const record = {
        id: stockRecords.length + 1,
        ...newStock,
        quantity: parseInt(newStock.quantity),
        costPrice: parseFloat(newStock.costPrice),
        mrp: parseFloat(newStock.mrp) || 0,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      setStockRecords(prev => [...prev, record]);
      setNewStock({
        vendor: '',
        item: '',
        batchNumber: '',
        expiryDate: '',
        quantity: '',
        costPrice: '',
        mrp: '',
        invoiceNumber: '',
        invoiceDate: '',
        remarks: ''
      });
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Stock Inward Management</h1>
          <p className="text-gray-600 mt-2">Record stock purchases and receipts</p>
        </div>

        <div>
          {/* Record Stock Inward Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Record Stock Inward</h2>
            
            <form onSubmit={handleRecordStock} className="space-y-6">
              {/* Vendor and Item */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vendor"
                    value={newStock.vendor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    required
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((vendor, index) => (
                      <option key={index} value={vendor}>{vendor}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="item"
                    value={newStock.item}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    required
                  >
                    <option value="">Select Item</option>
                    {items.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Batch Number and Expiry Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="batchNumber"
                    value={newStock.batchNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="Enter batch number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={newStock.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    required
                  />
                  <span className="text-xs text-gray-500 mt-1">dd-mm-yyyy</span>
                </div>
              </div>

              {/* Quantity and Prices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={newStock.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="Enter quantity"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost Price (per unit) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="costPrice"
                      value={newStock.costPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MRP (per unit)
                    </label>
                    <input
                      type="number"
                      name="mrp"
                      value={newStock.mrp}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={newStock.invoiceNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="Enter invoice number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={newStock.invoiceDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500 mt-1">dd-mm-yyyy</span>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={newStock.remarks}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="Enter any remarks"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00b4d8] hover:bg-[#0099c3] text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center text-lg"
              >
                <span className="mr-2 text-xl">+</span>
                Record Stock Inward
              </button>
            </form>
          </div>

          {/* Stock Inward History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Stock Inward History</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vendor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Item</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Batch No.</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Expiry Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Qty</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Cost Price</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">MRP</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Invoice No.</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stockRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800">{record.vendor}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">{record.item}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.batchNumber}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.expiryDate}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.quantity}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">₹{record.costPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">₹{record.mrp.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.invoiceNumber}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(record.dateAdded)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {stockRecords.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No stock inward records found. Record your first stock above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInwardPage;
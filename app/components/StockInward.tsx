'use client';

import React, { useState, useEffect } from 'react';

type StockRecord = {
  id?: number;
  vendor?: string;
  item?: string;
  batch_number?: string | null;
  expiry_date?: string | null;
  quantity?: number | null;
  cost_price?: number | string | null;
  mrp?: number | string | null;
  invoice_number?: string | null;
  date_added?: string | null;
  remarks?: string | null;
};

type NewStock = {
  vendor: string;
  item: string;
  batchNumber: string;
  expiryDate: string;
  quantity: string;
  costPrice: string;
  mrp: string;
  invoiceNumber: string;
  invoiceDate: string;
  remarks: string;
};

const StockInwardPage: React.FC = () => {
  const [stockRecords, setStockRecords] = useState<StockRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<NewStock>({
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

  // Fetch all stock records on component mount
  useEffect(() => {
    fetchStockRecords();
  }, []);

  const fetchStockRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/stock-inward');
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      setStockRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setNewStock(prev => ({
      ...prev,
      [name]: value
    } as unknown as NewStock));
  };

  const handleRecordStock = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !newStock.vendor ||
      !newStock.item ||
      !newStock.batchNumber ||
      !newStock.expiryDate ||
      !newStock.quantity ||
      !newStock.costPrice
    ) {
      alert('Please fill all required fields');
      return;
    }

    // Prepare payload (ensure numbers are parsed)
    const payload = {
      vendor: newStock.vendor,
      item: newStock.item,
      batch_number: newStock.batchNumber || null,
      expiry_date: newStock.expiryDate || null,
      quantity: Number.parseInt(newStock.quantity || '0', 10),
      cost_price: Number.parseFloat(newStock.costPrice || '0'),
      mrp: newStock.mrp ? Number.parseFloat(newStock.mrp) : 0,
      invoice_number: newStock.invoiceNumber || null,
      invoice_date: newStock.invoiceDate || null,
      remarks: newStock.remarks || null
    } as Partial<StockRecord>;

    try {
      const response = await fetch('http://localhost:5000/stock-inward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to add record');

      const newRecord: StockRecord = await response.json();
      // Add the newly created record to the table
      setStockRecords(prev => [newRecord, ...prev]);

      // Reset form
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
    } catch (err) {
      alert('Error adding record: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">Loading stock records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

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
                    <tr key={record.id ?? Math.random()} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800">{record.vendor ?? ''}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">{record.item ?? ''}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.batch_number ?? ''}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(record.expiry_date ?? '')}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.quantity ?? ''}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">₹{(Number.parseFloat(String(record.cost_price ?? 0))).toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">₹{(Number.parseFloat(String(record.mrp ?? 0))).toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.invoice_number ?? ''}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(record.date_added ?? '')}</td>
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
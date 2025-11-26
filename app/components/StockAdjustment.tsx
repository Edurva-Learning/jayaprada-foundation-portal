import React, { useState } from 'react';

const StockAdjustment = () => {
  const [adjustments, setAdjustments] = useState([
    {
      id: 1,
      item: 'Dolo 650',
      batch: 'BATCH001',
      quantity: -5,
      reason: 'Damaged Goods',
      adjustmentType: 'Decrease',
      date: '25-11-2025',
      remarks: '5 tablets found damaged during inspection',
      adjustedBy: 'Admin User'
    },
    {
      id: 2,
      item: 'Eye Drops',
      batch: 'BATCH002',
      quantity: 10,
      reason: 'Stock Correction',
      adjustmentType: 'Increase',
      date: '24-11-2025',
      remarks: 'Found additional stock in storage',
      adjustedBy: 'Admin User'
    }
  ]);

  const [adjustmentForm, setAdjustmentForm] = useState({
    item: '',
    batch: '',
    quantity: '',
    reason: '',
    adjustmentType: '',
    date: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  const items = [
    { name: 'Dolo 650', batches: ['BATCH001', 'BATCH002'] },
    { name: 'Eye Drops', batches: ['BATCH003', 'BATCH004'] },
    { name: 'DRYDEX SYRUP', batches: ['BATCH005'] },
    { name: 'Vitamin C', batches: ['BATCH006', 'BATCH007'] }
  ];

  const reasons = [
    'Damaged Goods',
    'Stock Correction',
    'Expired Items',
    'Theft/Loss',
    'Counting Error',
    'Quality Control',
    'Other'
  ];

  const adjustmentTypes = ['Increase', 'Decrease'];

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setAdjustmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAdjustment = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (adjustmentForm.item && adjustmentForm.batch && adjustmentForm.quantity && adjustmentForm.reason && adjustmentForm.adjustmentType) {
      const adjustment = {
        id: adjustments.length + 1,
        ...adjustmentForm,
        quantity: parseInt(adjustmentForm.quantity),
        date: new Date().toLocaleDateString('en-GB'),
        adjustedBy: 'Current User'
      };
      setAdjustments(prev => [adjustment, ...prev]);
      setAdjustmentForm({
        item: '',
        batch: '',
        quantity: '',
        reason: '',
        adjustmentType: '',
        date: new Date().toISOString().split('T')[0],
        remarks: ''
      });
    }
  };

  const getBatchesForItem = (itemName: string) => {
    const item = items.find(i => i.name === itemName);
    return item ? item.batches : [];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-7xl mx-auto">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Stock Adjustment</h1>
          <p className="text-gray-600 mt-2">Adjust stock quantities for discrepancies, damages, or corrections</p>
        </div>

        <div>
          {/* Stock Adjustment Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Stock Adjustment</h2>
            
            <form onSubmit={handleSubmitAdjustment} className="space-y-6">
              {/* Item & Batch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Item & Batch <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    name="item"
                    value={adjustmentForm.item}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    required
                  >
                    <option value="">Select Item</option>
                    {items.map((item, index) => (
                      <option key={index} value={item.name}>{item.name}</option>
                    ))}
                  </select>

                  <select
                    name="batch"
                    value={adjustmentForm.batch}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    required
                    disabled={!adjustmentForm.item}
                  >
                    <option value="">Select Batch</option>
                    {getBatchesForItem(adjustmentForm.item).map((batch, index) => (
                      <option key={index} value={batch}>{batch}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantity and Reason */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={adjustmentForm.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="Enter quantity"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Adjustment <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="reason"
                    value={adjustmentForm.reason}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    required
                  >
                    <option value="">Select Reason</option>
                    {reasons.map((reason, index) => (
                      <option key={index} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="remarks"
                  value={adjustmentForm.remarks}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="Provide detailed explanation for this adjustment..."
                  required
                />
              </div>

              {/* Adjustment Type and Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    name="adjustmentType"
                    value={adjustmentForm.adjustmentType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    required
                  >
                    <option value="">Select Type</option>
                    {adjustmentTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>

                  <input
                    type="date"
                    name="date"
                    value={adjustmentForm.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important:</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Stock adjustments directly affect inventory levels and cost calculations. Please ensure accuracy before submitting.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00b4d8] hover:bg-[#0099c3] text-white font-medium py-3 px-4 rounded-md transition duration-200"
              >
                Submit Adjustment
              </button>
            </form>
          </div>

          {/* Adjustment History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Adjustment History (Last 50)</h2>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {adjustments.map((adjustment) => (
                <div key={adjustment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-800">{adjustment.item}</h3>
                      <p className="text-sm text-gray-600">Batch: {adjustment.batch}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      adjustment.quantity > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {adjustment.quantity > 0 ? '+' : ''}{adjustment.quantity}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Reason:</span> {adjustment.reason}</p>
                    <p><span className="font-medium">Type:</span> {adjustment.adjustmentType}</p>
                    <p><span className="font-medium">Date:</span> {adjustment.date}</p>
                    <p><span className="font-medium">By:</span> {adjustment.adjustedBy}</p>
                  </div>
                  
                  {adjustment.remarks && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600"><span className="font-medium">Remarks:</span> {adjustment.remarks}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {adjustments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No adjustment history found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustment;
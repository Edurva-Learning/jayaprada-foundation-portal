'use client';

import React from 'react';

const StockReportsPage = () => {
  // Static data for the table
  const stockData = [
    {
      id: 1,
      medicineName: 'Dolo 650',
      completed: 1200,
      balance: 800,
      cost: 5.5,
      batchNumber: 'BATCH001',
    },
    {
      id: 2,
      medicineName: 'DRYDEX SYRUP',
      completed: 450,
      balance: 150,
      cost: 45.0,
      batchNumber: 'BATCH002',
    },
    {
      id: 3,
      medicineName: 'Eye Drops',
      completed: 300,
      balance: 200,
      cost: 12.75,
      batchNumber: 'BATCH003',
    },
    {
      id: 4,
      medicineName: 'Vitamin C Tablets',
      completed: 800,
      balance: 400,
      cost: 8.25,
      batchNumber: 'BATCH004',
    },
    {
      id: 5,
      medicineName: 'Pain Relief Gel',
      completed: 250,
      balance: 100,
      cost: 15.0,
      batchNumber: 'BATCH005',
    },
    {
      id: 6,
      medicineName: 'Antiseptic Cream',
      completed: 180,
      balance: 70,
      cost: 22.5,
      batchNumber: 'BATCH006',
    },
    {
      id: 7,
      medicineName: 'Paracetamol 500mg',
      completed: 2000,
      balance: 500,
      cost: 2.3,
      batchNumber: 'BATCH007',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Stock Reports</h1>
          <p className="text-gray-600 mt-2">Overview of medicine stock levels</p>
        </div>

        {/* Optional search/filter bar (can be removed if not needed) */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search by medicine name..."
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent">
            <option>All Batches</option>
            <option>BATCH001</option>
            <option>BATCH002</option>
            <option>BATCH003</option>
          </select>
          <button className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0099c3] transition">
            Filter
          </button>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Medicine Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Completed</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Balance</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Cost (₹)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Batch Number</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{item.medicineName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.completed}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.balance}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">₹{item.cost.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.batchNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Optional footer with total records */}
          {stockData.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 text-sm text-gray-600 border-t border-gray-200">
              Total Records: {stockData.length}
            </div>
          )}
        </div>

        {/* If no data (never happens here, but for completeness) */}
        {stockData.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
            No stock records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default StockReportsPage;
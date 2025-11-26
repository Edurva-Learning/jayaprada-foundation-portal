import React from 'react';

const StockReturnApproval = () => {
  const returnHistory = [
    {
      date: 'Nov 09, 2025',
      camp: 'Jagayyapet Camp',
      item: 'Dolo 650 123',
      batch: '1',
      qty: '💬',
      status: '💬',
      initiatedBy: 'Super Administrator',
      approvedBy: 'Super Administrator'
    },
    {
      date: 'Nov 09, 2025',
      camp: 'Jagayyapet Camp',
      item: 'Eye Drops Eye Drops',
      batch: '3',
      qty: '💬',
      status: '💬',
      initiatedBy: 'Super Administrator',
      approvedBy: 'Super Administrator'
    },
    {
      date: 'Nov 08, 2025',
      camp: 'Jagayyapet Camp',
      item: 'Dolo 650 123',
      batch: '1',
      qty: '💬',
      status: '💬',
      initiatedBy: 'Super Administrator',
      approvedBy: 'Super Administrator'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Stock Return Approval</h1>
      <p className="text-gray-600 mb-8">Review and approve/reject stock returns from camps</p>

      {/* Pending Returns Section */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pending Returns (0)</h2>
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <p className="text-gray-500">No pending returns for approval</p>
          <p className="text-gray-400 text-sm mt-1">All return requests have been processed.</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        {/* Return History Section */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Return History (Last 50)</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Camp</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Item</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Batch</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Qty</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Initiated By</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Approved By</th>
              </tr>
            </thead>
            <tbody>
              {returnHistory.map((returnItem, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{returnItem.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{returnItem.camp}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{returnItem.item}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{returnItem.batch}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{returnItem.qty}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{returnItem.status}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{returnItem.initiatedBy}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{returnItem.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockReturnApproval;
import React from 'react';

const CampStockReturn = () => {
  const returnHistory = [
    {
      date: 'Nov 09, 2025',
      time: '15:51',
      item: 'Dolo 650',
      batch: 'abc123',
      qtyReturned: '[ ]',
      reason: 'Camp Closing',
      status: '[Approved]',
      initiatedBy: 'Super Administrator'
    },
    {
      date: 'Nov 09, 2025',
      time: '15:51',
      item: 'Eye Drops',
      batch: 'def1283',
      qtyReturned: '[ ]',
      reason: 'Camp Closing',
      status: '[Approved]',
      initiatedBy: 'Super Administrator'
    },
    {
      date: 'Nov 08, 2025',
      time: '13:19',
      item: 'Dolo 650',
      batch: 'abc123',
      qtyReturned: '[ ]',
      reason: 'Camp Closing',
      status: '[Approved]',
      initiatedBy: 'Super Administrator'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-7xl mx-auto">
      
      <div>
        {/* Camp Stock Return Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#00b4d8] mb-2">Camp Stock Return</h2>
          <p className="text-gray-700">
            Camp: <span className="font-semibold">Jagayyapet Camp - Jagayyapet</span> | 
            <span className="font-semibold"> Nov 06, 2025 - Nov 14, 2025</span>
          </p>
        </div>

        {/* No Stock Available Section */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Stock Available for Return</h3>
            <p className="text-gray-600">
              There is no available stock in this camp that can be returned to main inventory. 
              This could be because all stock has been issued to participants or already returned.
            </p>
          </div>
        </div>

        {/* Return History Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-[#00b4d8] mb-4">Return History (Last 20)</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#00b4d8] text-white">
                  <th className="py-3 px-4 text-left text-sm font-medium">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Item</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Batch</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Qty Returned</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Reason</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Initiated By</th>
                </tr>
              </thead>
              <tbody>
                {returnHistory.map((returnItem, index) => (
                  <React.Fragment key={index}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {returnItem.date}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                        {returnItem.item}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {returnItem.batch}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {returnItem.qtyReturned}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {returnItem.reason}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {returnItem.status}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {returnItem.initiatedBy}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-1 px-4 text-xs text-gray-500">
                        {returnItem.time}
                      </td>
                      <td className="py-1 px-4 text-xs text-gray-500">
                        {returnItem.item === 'Dolo 650' ? '123' : 'Eye Drops'}
                      </td>
                      <td className="py-1 px-4 text-xs text-gray-500"></td>
                      <td className="py-1 px-4 text-xs text-gray-500"></td>
                      <td className="py-1 px-4 text-xs text-gray-500"></td>
                      <td className="py-1 px-4 text-xs text-gray-500"></td>
                      <td className="py-1 px-4 text-xs text-gray-500"></td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampStockReturn;
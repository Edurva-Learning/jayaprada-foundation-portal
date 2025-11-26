import React, { useState } from 'react';

const CampStockAllocation = () => {
  const [allocations, setAllocations] = useState([
    {
      id: 1,
      camp: 'Jagayyapet Camp',
      item: 'Eye Drops Eye Drops',
      batch: 'def 1203',
      expiry: 'Oct 2028',
      allocated: 5,
      available: 0,
      issued: 0,
      status: 'Excursed',
      issuedBy: 'Super Administrator',
      date: 'Nov 09, 2025'
    },
    {
      id: 2,
      camp: 'Jarawanet Camp',
      item: 'Polo 650',
      batch: 'alue 123',
      expiry: 'Nov 2028',
      allocated: 3,
      available: 0,
      issued: 1,
      status: 'Excursed',
      issuedBy: 'Super Administrator',
      date: 'Nov 09, 2025'
    }
  ]);

  const [allocationForm, setAllocationForm] = useState({
    camp: '',
    items: [{
      item: '',
      batch: '',
      quantity: ''
    }]
  });

  const camps = ['Jagayyapet Camp', 'Jarawanet Camp', 'Main City Camp', 'Rural Health Camp'];
  const items = ['Eye Drops', 'Dolo 650', 'Polo 650', 'DRYDEX SYRUP'];
  const batches = ['def 1203', 'alue 123', 'batch001', 'batch002'];

  const handleCampChange = (e: { target: { value: any; }; }) => {
    setAllocationForm({
      ...allocationForm,
      camp: e.target.value
    });
  };

  const handleItemChange = (index: number, field: 'item' | 'batch' | 'quantity', value: string) => {
  const newItems = [...allocationForm.items];
  newItems[index][field] = value;
  setAllocationForm({
    ...allocationForm,
    items: newItems
  });
};

  const addAnotherItem = () => {
    setAllocationForm({
      ...allocationForm,
      items: [...allocationForm.items, { item: '', batch: '', quantity: '' }]
    });
  };

  const handleAllocateStock = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (allocationForm.camp && allocationForm.items.every(item => item.item && item.batch && item.quantity)) {
      const newAllocations = allocationForm.items.map(item => ({
        id: allocations.length + 1,
        camp: allocationForm.camp,
        item: item.item,
        batch: item.batch,
        expiry: 'Dec 2026',
        allocated: parseInt(item.quantity),
        available: parseInt(item.quantity),
        issued: 0,
        status: 'Active',
        issuedBy: 'Super Administrator',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      }));
      
      setAllocations([...allocations, ...newAllocations]);
      setAllocationForm({
        camp: '',
        items: [{ item: '', batch: '', quantity: '' }]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Camp Stock Allocation</h1>
          <p className="text-gray-600 mt-2">Allocate stock from main inventory to camps</p>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Allocate Stock to Camp</h2>
            
            <form onSubmit={handleAllocateStock} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Camp <span className="text-red-500">*</span>
                </label>
                <select
                  value={allocationForm.camp}
                  onChange={handleCampChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  required
                >
                  <option value="">Select Camp</option>
                  {camps.map((camp, index) => (
                    <option key={index} value={camp}>{camp}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <span className="text-sm font-medium text-gray-700">Item *</span>
                  <span className="text-sm font-medium text-gray-700">Batch *</span>
                  <span className="text-sm font-medium text-gray-700">Quantity *</span>
                </div>

                {allocationForm.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <select
                      value={item.item}
                      onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      required
                    >
                      <option value="">Select Item</option>
                      {items.map((itemOption, idx) => (
                        <option key={idx} value={itemOption}>{itemOption}</option>
                      ))}
                    </select>

                    <select
                      value={item.batch}
                      onChange={(e) => handleItemChange(index, 'batch', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      required
                    >
                      <option value="">Select Batch</option>
                      {batches.map((batch, idx) => (
                        <option key={idx} value={batch}>{batch}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      placeholder="Quantity"
                      min="1"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Sample Size</h3>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={addAnotherItem}
                    className="flex-1 border border-[#00b4d8] text-[#00b4d8] hover:bg-[#00b4d8] hover:text-white font-medium py-2 px-4 rounded-md transition duration-200"
                  >
                    Add Another Item
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-[#00b4d8] hover:bg-[#0099c3] text-white font-medium py-2 px-4 rounded-md transition duration-200"
                  >
                    Allocate Stock
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Camp Stock Allocations</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Camp</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Item</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Batch</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Expiry</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Allocated</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Available</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Issued</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Issued By</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((allocation) => (
                    <tr key={allocation.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800">{allocation.camp}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{allocation.item}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{allocation.batch}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{allocation.expiry}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{allocation.allocated}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{allocation.available}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{allocation.issued}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {allocation.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{allocation.issuedBy}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{allocation.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {allocations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No camp stock allocations found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampStockAllocation;
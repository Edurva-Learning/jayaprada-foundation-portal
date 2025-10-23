// // app/community/page.tsx
// 'use client';

// import { useState } from 'react';

// export default function CommunityPage() {
//   const [filters, setFilters] = useState({
//     aadhar: '',
//     mobile: '',
//     name: '',
//     dateFrom: '',
//     dateTo: ''
//   });

//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleReset = () => {
//     setFilters({
//       aadhar: '',
//       mobile: '',
//       name: '',
//       dateFrom: '',
//       dateTo: ''
//     });
//   };

//   const supportRecords = [
//     {
//       id: 2,
//       beneficiary: 'Support2',
//       aadhar: '012345678934',
//       mobile: '0129384756',
//       familyHead: 'Father',
//       children: 3,
//       amount: '¥10,000.00',
//       createdAt: 'Sep 20, 2025'
//     },
//     {
//       id: 1,
//       beneficiary: 'Support1',
//       aadhar: '012345678933',
//       mobile: '0129384755',
//       familyHead: 'Father1',
//       children: 2,
//       amount: '¥20,000.00',
//       createdAt: 'Sep 20, 2025'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Community Outreach</h1>
          
//           <div className="flex space-x-6 mt-6">
//             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-64">
//               <h2 className="text-sm font-medium text-gray-500 mb-1">Total Donations</h2>
//               <p className="text-2xl font-semibold text-gray-800">¥30,000.00</p>
//             </div>
            
//             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-64">
//               <h2 className="text-sm font-medium text-gray-500 mb-1">Total Beneficiaries</h2>
//               <p className="text-2xl font-semibold text-gray-800">2</p>
//             </div>
//           </div>
//         </div>

//         <div className="h-px bg-gray-200 my-8"></div>

//         {/* Filter Section */}
//         <div className="mb-10">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Community Support</h2>
          
//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <span className="text-[#00b4d8]">Aadhar Number</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="aadhar"
//                   value={filters.aadhar}
//                   onChange={handleFilterChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
//                   placeholder="Search  by Aadhar"
//                 />
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="text"
//                   name="mobile"
//                   value={filters.mobile}
//                   onChange={handleFilterChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
//                   placeholder="Search by Mobile"
//                 />
//               </div>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 gap-6 mt-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 <span className="text-[#00b4d8]">Beneficiary Name</span>
//               </label>
//               <div>
//                 <input
//                   type="text"
//                   name="name"
//                   value={filters.name}
//                   onChange={handleFilterChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
//                   placeholder="Search by Name"
//                 />
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Date Range
//               </label>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   dd-mm-yyyy
//                 </label>
//                 <div className="flex space-x-2">
//                   <input
//                     type="text"
//                     name="dateFrom"
//                     value={filters.dateFrom}
//                     onChange={handleFilterChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
//                     placeholder="From"
//                   />
//                   <input
//                     type="text"
//                     name="dateTo"
//                     value={filters.dateTo}
//                     onChange={handleFilterChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
//                     placeholder="To"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex space-x-4 mt-6">
//             <button className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0099c3] transition-colors">
//               Apply Filters
//             </button>
//             <button 
//               onClick={handleReset}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//             >
//               Reset
//             </button>
//           </div>
//         </div>

//         <div className="h-px bg-gray-200 my-8"></div>

// //         {/* Records Section */}
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-gray-800">Community Support Records</h2>
//             <button className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0099c3] transition-colors flex items-center">
//               <span className="mr-2">+</span> Add Participant
//             </button>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IDSUFFICIARY</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMDMA</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MOBILE</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FAULT VIEJO</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHILDREN</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIRCUITO AT</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {supportRecords.map((record) => (
//                   <tr key={record.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.id}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.beneficiary}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.aadhar}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.mobile}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.familyHead}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.children}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.amount}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.createdAt}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <div className="flex space-x-2">
//                         <button className="text-blue-600 hover:text-blue-800 transition-colors">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                             <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                             <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                           </svg>
//                         </button>
//                         <button className="text-green-600 hover:text-green-800 transition-colors">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                             <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                           </svg>
//                         </button>
//                         <button className="text-red-600 hover:text-red-800 transition-colors">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                           </svg>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="h-px bg-gray-200 my-8"></div>
//       </div>
//     </div>
//   );
// }


// app/community/page.tsx
'use client';

import { useState } from 'react';

export default function CommunityPage() {
  const [filters, setFilters] = useState({
    aadhar: '',
    mobile: '',
    name: '',
    dateFrom: '',
    dateTo: ''
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    aadhar: '',
    mobile: '',
    address: '',
    purpose: '',
    familyHead: '',
    children: '',
    details: '',
    amount: ''
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFilters({
      aadhar: '',
      mobile: '',
      name: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form data:', formData);
    setIsFormOpen(false);
    // Reset form
    setFormData({
      name: '',
      aadhar: '',
      mobile: '',
      address: '',
      purpose: '',
      familyHead: '',
      children: '',
      details: '',
      amount: ''
    });
  };

  const supportRecords = [
    {
      id: 2,
      beneficiary: 'Support2',
      aadhar: '012345678934',
      mobile: '0129384756',
      familyHead: 'Father',
      children: 3,
      amount: '¥10,000.00',
      createdAt: 'Sep 20, 2025'
    },
    {
      id: 1,
      beneficiary: 'Support1',
      aadhar: '012345678933',
      mobile: '0129384755',
      familyHead: 'Father1',
      children: 2,
      amount: '¥20,000.00',
      createdAt: 'Sep 20, 2025'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        {/* Header Section */}
<div className="mb-8">
  <h1 className="text-3xl font-bold text-gray-800 mb-4">
    Community Outreach
  </h1>

  {/* Stats Grid (same style as the first one) */}
  <div className="grid grid-cols-4 gap-4">
    {[
      { label: "Total Donations", value: "¥30,000.00" },
      { label: "Total Beneficiaries", value: "2" },
    ].map((stat, i) => (
      <div
        key={i}
        className="p-4 border border-[#90e0ef] rounded-lg bg-[#caf0f8] text-center shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-800">{stat.value}</h2>
        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
      </div>
    ))}
  </div>
</div>

        <div className="h-px bg-gray-200 my-8"></div>

        {/* Filter Section */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Community Support</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-[#00b4d8]">Aadhar Number</span>
                </label>
                <input
                  type="text"
                  name="aadhar"
                  value={filters.aadhar}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                  placeholder="Search by Aadhar"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                 <span className="text-[#00b4d8]">Mobile Number</span>
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={filters.mobile}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                  placeholder="Search by Mobile"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-[#00b4d8]">Beneficiary Name</span>
              </label>
              <div>
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                  placeholder="Search by Name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-[#00b4d8]">Date Range</span>
              </label>
              <div>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                    placeholder="From"
                  />
                  {/* <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                    placeholder="To"
                  /> */}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0099c3] transition-colors">
              Apply Filters
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-8"></div>

        {/* Records Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Community Support Records</h2>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0099c3] transition-colors flex items-center"
            >
              <span className="mr-2">+</span> Add Community Support
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
                  <th className="p-3 font-semibold">ID</th>
                  <th className="p-3 font-semibold">Beneficiary</th>
                  <th className="p-3 font-semibold">Aadhar</th>
                  <th className="p-3 font-semibold">Mobile</th>
                  <th className="p-3 font-semibold">Family Head</th>
                  <th className="p-3 font-semibold">Childern</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Created At</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {supportRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.beneficiary}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.aadhar}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.familyHead}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.children}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="text-green-600 hover:text-green-800 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button className="text-red-600 hover:text-red-800 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-8"></div>
      </div>

      {/* Add Participant Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Participant</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Support Given To (Name) *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhar Number *
                    </label>
                    <input
                      type="text"
                      name="aadhar"
                      value={formData.aadhar}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Family Head Name *
                    </label>
                    <input
                      type="text"
                      name="familyHead"
                      value={formData.familyHead}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Children *
                    </label>
                    <input
                      type="number"
                      name="children"
                      value={formData.children}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (₹) *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose of Support
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Details
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0099c3] transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

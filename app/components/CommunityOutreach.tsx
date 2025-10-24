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

import { useEffect, useState } from 'react';
import { Eye, Loader2, Pencil, Trash2, User, X } from 'lucide-react';

export default function CommunityPage() {
  // Inline toast/notice similar to WomenEmpowerment
  const [notice, setNotice] = useState<null | { type: 'success' | 'error' | 'info'; message: string }>(null);
  const [filters, setFilters] = useState({
    aadhar: '',
    mobile: '',
    name: '',
    dateFrom: '',
    dateTo: ''
  });
  // Apply filters only when user clicks Apply (client-side filtering)
  const [appliedFilters, setAppliedFilters] = useState({
    aadhar: '',
    mobile: '',
    name: '',
    dateFrom: '',
    dateTo: ''
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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

  // Participants list state
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_CO_BASE = 'http://localhost:5000/community-outreach';

  const showNotice = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 3000);
  };

  // Action handlers (stubs for now)
  const handleView = (id: number) => {
    showNotice(`View details for record #${id}`, 'info');
  };
  const handleEdit = (id: number) => {
    const rec = participants.find(p => p.id === id);
    if (!rec) {
      showNotice('Record not found', 'error');
      return;
    }
    setEditingId(id);
    setFormData({
      name: rec.name || '',
      aadhar: rec.aadhar || '',
      mobile: rec.mobile || '',
      address: rec.address || '',
      purpose: rec.purpose || '',
      familyHead: rec.familyHead || '',
      children: rec.children?.toString?.() || '',
      details: rec.details || '',
      amount: rec.amount?.toString?.() || ''
    });
    setIsFormOpen(true);
  };
  const handleDelete = async (id: number) => {
    const rec = participants.find(p => p.id === id);
    const title = rec?.name ? `${rec.name} (ID ${id})` : `record #${id}`;
    const confirmed = typeof window !== 'undefined' ? window.confirm(`Delete ${title}? This cannot be undone.`) : true;
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_CO_BASE}/participants/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete');
      await fetchParticipants();
      showNotice('Record deleted', 'success');
    } catch (e: any) {
      console.error('Delete failed:', e);
      showNotice(e?.message || 'Failed to delete record', 'error');
    }
  };

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_CO_BASE}/participants`);
      if (!res.ok) throw new Error('Failed to load participants');
      const data = await res.json();
      setParticipants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching Community Outreach participants:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return d as string;
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };
  const formatAmount = (amt?: number | string) => {
    if (amt === null || amt === undefined) return '';
    const n = typeof amt === 'string' ? Number(amt) : amt;
    if (isNaN(Number(n))) return String(amt);
    return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n));
  };

  useEffect(() => { fetchParticipants(); }, []);

  // Normalize numeric strings for phone/aadhar
  const digitsOnly = (v: any) => String(v ?? '').replace(/\D/g, '');

  // Client-side filtered list based on applied filters
  const filteredParticipants = participants.filter((p: any) => {
    const nameMatch = !appliedFilters.name || String(p?.name ?? '')
      .toLowerCase()
      .includes(appliedFilters.name.toLowerCase());
    const aadharMatch = !appliedFilters.aadhar || digitsOnly(p?.aadhar)
      .includes(digitsOnly(appliedFilters.aadhar));
    const mobileMatch = !appliedFilters.mobile || digitsOnly(p?.mobile)
      .includes(digitsOnly(appliedFilters.mobile));

    // Date filter: inclusive from (and to, if provided)
    let dateMatch = true;
    if (appliedFilters.dateFrom || appliedFilters.dateTo) {
      const recDate = new Date(p?.created_at ?? p?.createdAt ?? '');
      if (!isNaN(recDate.getTime())) {
        if (appliedFilters.dateFrom) {
          const from = new Date(appliedFilters.dateFrom);
          if (!isNaN(from.getTime())) dateMatch = dateMatch && recDate >= from;
        }
        if (appliedFilters.dateTo) {
          const to = new Date(appliedFilters.dateTo);
          // Make 'to' inclusive by setting to end-of-day
          if (!isNaN(to.getTime())) {
            to.setHours(23, 59, 59, 999);
            dateMatch = dateMatch && recDate <= to;
          }
        }
      }
    }

    return nameMatch && aadharMatch && mobileMatch && dateMatch;
  });

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
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
    setAppliedFilters({ aadhar: '', mobile: '', name: '', dateFrom: '', dateTo: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      showNotice('Name is required', 'error');
      return;
    }

    try {
      const isEdit = editingId !== null;
      const url = isEdit ? `${API_CO_BASE}/participants/${editingId}` : `${API_CO_BASE}/participants`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to ${isEdit ? 'update' : 'save'} participant`);
      }

      await fetchParticipants();

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
      setEditingId(null);
      setIsFormOpen(false);
      showNotice(`Community support ${isEdit ? 'updated' : 'saved'} successfully`, 'success');
    } catch (e: any) {
      console.error('Save participant failed:', e);
      showNotice(e.message || 'Failed to save participant', 'error');
    }
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

  // Compute summary stats from community_outreach_participants (participants state)
  const totalDonations = participants.reduce(
    (sum: number, p: any) => sum + (Number(p?.amount) || 0),
    0
  );
  const totalBeneficiaries = participants.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {notice && (
          <div
            role="alert"
            className={`fixed top-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-lg text-white ${
              notice.type === 'success' ? 'bg-green-600' : notice.type === 'error' ? 'bg-red-600' : 'bg-gray-800'
            }`}
          >
            {notice.message}
          </div>
        )}
        {/* Header Section */}
        {/* Header Section */}
<div className="mb-8">
  <h1 className="text-3xl font-bold text-gray-800 mb-4">
    Community Outreach
  </h1>

  {/* Stats Grid (computed from community_outreach_participants) */}
  <div className="grid grid-cols-4 gap-4">
    {[
      { label: "Total Donations", value: `₹${formatAmount(totalDonations)}` },
      { label: "Total Beneficiaries", value: String(totalBeneficiaries) },
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
          
          <form onSubmit={(e) => { e.preventDefault(); setAppliedFilters({ ...filters }); }}>
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
                  <div className="w-full">
                    <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                    <input
                      type="date"
                      name="dateFrom"
                      value={filters.dateFrom}
                      onChange={handleFilterChange}
                      max={filters.dateTo || undefined}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                      aria-label="From date"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                    <input
                      type="date"
                      name="dateTo"
                      value={filters.dateTo}
                      onChange={handleFilterChange}
                      min={filters.dateFrom || undefined}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                      aria-label="To date"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button type="submit" className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0099c3] transition-colors">
              Apply Filters
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
          </form>
        </div>

        <div className="h-px bg-gray-200 my-8"></div>

        {/* Records Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Community Support Records</h2>
            <button 
              onClick={() => { setEditingId(null); setFormData({ name:'', aadhar:'', mobile:'', address:'', purpose:'', familyHead:'', children:'', details:'', amount:'' }); setIsFormOpen(true); }}
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
                  <th className="p-3 font-semibold">Children</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Created At</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={9} className="p-6">
                      <div className="flex items-center justify-center gap-3 text-[#0077b6]">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="font-medium">Loading participants...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && participants.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-gray-600">No records found</td>
                  </tr>
                )}
                {!loading && filteredParticipants.length === 0 && participants.length > 0 && (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-gray-600">No records match your filters</td>
                  </tr>
                )}
                {!loading && filteredParticipants.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="p-3">{record.id}</td>
                    <td className="p-3">{record.name}</td>
                    <td className="p-3">{record.aadhar}</td>
                    <td className="p-3">{record.mobile}</td>
                    <td className="p-3">{record.familyHead}</td>
                    <td className="p-3">{record.children}</td>
                    <td className="p-3">{formatAmount(record.amount)}</td>
                    <td className="p-3">{formatDate(record.created_at)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleView(record.id)}
                          className="text-[#00b4d8] hover:text-[#0096c7] p-2 rounded-lg transition-colors"
                          aria-label="View"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(record.id)}
                          className="text-green-600 hover:text-green-700 p-2 rounded-lg transition-colors"
                          aria-label="Edit"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg transition-colors"
                          aria-label="Delete"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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

      {/* Add Community Support Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
            {/* Header */}
            <div className="bg-[#00b4d8] rounded-t-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User size={24} />
                  <h2 className="text-2xl font-bold">{editingId ? 'Edit Community Support' : 'Add Community Support'}</h2>
                </div>
                <button 
                  onClick={closeForm}
                  className="p-2 hover:bg-[#0096c7] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-blue-100 mt-2">{editingId ? 'Update the support details below' : 'Fill in the support details below'}</p>
            </div>

            {/* Form */}
            <form id="coSupportForm" onSubmit={handleSubmit} className="p-6">
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all resize-none"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all resize-none"
                />
              </div>
            </form>

            {/* Footer Buttons */}
            <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                type="button"
                onClick={closeForm}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                form="coSupportForm"
                className="flex-1 px-6 py-3 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

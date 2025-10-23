// 'use client';
// import { useState } from 'react';

// export default function OrganicAgriculture() {
//   const [searchType, setSearchType] = useState('name');
//   const [searchValue, setSearchValue] = useState('');
  
//   // Mock data for the table
//   const participants = [
//     {
//       id: 1,
//       name: 'Rahul Sharma',
//       age: 35,
//       gender: 'Male',
//       phone: '9876543210',
//       aadhar: '1234-5678-9012',
//       registrationSource: 'Direct',
//       createdAt: '2023-01-15'
//     },
//     {
//       id: 2,
//       name: 'Priya Patel',
//       age: 28,
//       gender: 'Female',
//       phone: '8765432109',
//       aadhar: '2345-6789-0123',
//       registrationSource: 'Referral',
//       createdAt: '2023-02-20'
//     },
//     {
//       id: 3,
//       name: 'Amit Kumar',
//       age: 42,
//       gender: 'Male',
//       phone: '7654321098',
//       aadhar: '3456-7890-1234',
//       registrationSource: 'Campaign',
//       createdAt: '2023-03-10'
//     },
//     {
//       id: 4,
//       name: 'Sneha Singh',
//       age: 31,
//       gender: 'Female',
//       phone: '6543210987',
//       aadhar: '4567-8901-2345',
//       registrationSource: 'Direct',
//       createdAt: '2023-04-05'
//     }
//   ];

//   const handleSearch = (e : React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // In a real application, this would trigger an API call
//     console.log(`Searching by ${searchType}: ${searchValue}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with Add Participant Button */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Organic Agriculture Participants</h1>
//           </div>
//           <button className="px-6 py-3 bg-[#00b2d8] text-white rounded-md hover:bg-[#0099bc] transition-colors flex items-center gap-2">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//             </svg>
//             Add Participant
//           </button>
//         </div>

//         {/* Search Section */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="flex flex-wrap gap-4 mb-4">
//             <button 
//               className={`px-4 py-2 rounded-md ${searchType === 'name' ? 'bg-[#00b2d8] text-white' : 'bg-gray-200 text-gray-700'}`}
//               onClick={() => setSearchType('name')}
//             >
//               Search by Name
//             </button>
//             <button 
//               className={`px-4 py-2 rounded-md ${searchType === 'aadhar' ? 'bg-[#00b2d8] text-white' : 'bg-gray-200 text-gray-700'}`}
//               onClick={() => setSearchType('aadhar')}
//             >
//               Search by Aadhar
//             </button>
//             <button 
//               className={`px-4 py-2 rounded-md ${searchType === 'phone' ? 'bg-[#00b2d8] text-white' : 'bg-gray-200 text-gray-700'}`}
//               onClick={() => setSearchType('phone')}
//             >
//               Search by Phone
//             </button>
//           </div>
          
//           <form onSubmit={handleSearch} className="flex gap-4">
//             <input
//               type="text"
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               placeholder="Search participants..."
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b2d8]"
//             />
//             <button 
//               type="submit"
//               className="px-6 py-2 bg-[#00b2d8] text-white rounded-md hover:bg-[#0099bc] transition-colors flex items-center gap-2"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//               </svg>
//               Search
//             </button>
//           </form>
//         </div>

//         {/* Table Section */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhar</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Source</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {participants.map((participant) => (
//                   <tr key={participant.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.id}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{participant.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.age}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.gender}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.phone}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.aadhar}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.registrationSource}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.createdAt}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-3">
//                         {/* View Icon */}
//                         <button className="text-[#00b2d8] hover:text-[#0099bc]">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                             <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                             <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                           </svg>
//                         </button>
//                         {/* Edit Icon */}
//                         <button className="text-green-600 hover:text-green-800">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                             <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                           </svg>
//                         </button>
//                         {/* Delete Icon */}
//                         <button className="text-red-600 hover:text-red-800">
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
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { Search, User, Phone, IdCard, Plus, Eye, Edit, Trash2, X, MapPin, Users, Loader2 } from 'lucide-react';

export default function OrganicAgricultureParticipants() {
  const [notice, setNotice] = useState<null | { type: 'success' | 'error' | 'info'; message: string }>(null);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    aadhar: '',
    phone: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    aadhar: '',
    registrationSource: 'Organic Agriculture',
    registeredThrough: '',
    address: ''
  });

  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_OA_BASE = 'http://localhost:5000/organic-agriculture';

  const showNotice = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewParticipant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search filters:', searchFilters);
    // Implement search logic here
  };

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_OA_BASE}/participants`);
      if (!res.ok) throw new Error('Failed to load participants');
      const data = await res.json();
      setParticipants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching participants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParticipants(); }, []);

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipant.name) {
      showNotice('Name is required', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_OA_BASE}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newParticipant),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save participant');
      }

      await fetchParticipants();

      setNewParticipant({
        name: '',
        age: '',
        gender: '',
        phone: '',
        aadhar: '',
        registrationSource: 'Organic Agriculture',
        registeredThrough: '',
        address: ''
      });
      setShowAddForm(false);
      showNotice('Participant saved successfully', 'success');
    } catch (e: any) {
      console.error('Save participant failed:', e);
      showNotice(e.message || 'Failed to save participant', 'error');
    }
  };

  const handleCloseForm = () => {
    setNewParticipant({
      name: '',
      age: '',
      gender: '',
      phone: '',
      aadhar: '',
      registrationSource: 'Organic Agriculture',
      registeredThrough: '',
      address: ''
    });
    setShowAddForm(false);
  };

  const sortedParticipants = [...participants].sort((a, b) => {
    const ida = Number(a?.id ?? 0);
    const idb = Number(b?.id ?? 0);
    return ida - idb;
  });

  const formatDate = (d?: string) => {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return d as string;
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Organic Agriculture Participants</h1>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search by Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Search by Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={searchFilters.name}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="Enter name"
                  />
                </div>
              </div>
              
              {/* Search by Aadhar */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Search by Aadhar
                </label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="aadhar"
                    value={searchFilters.aadhar}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="Enter Aadhar number"
                  />
                </div>
              </div>
              
              {/* Search by Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Search by Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="phone"
                    value={searchFilters.phone}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
            
            {/* Search Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-2.5 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center gap-2"
              >
                <Search size={18} />
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Participants Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Table Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Participants List</h3>
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2.5 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Participant
            </button>
          </div>

          {/* Table */}
          <div className="overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Age</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Gender</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Aadhar</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Registration Source</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created At</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
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
                {!loading && sortedParticipants.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-gray-600">No participants found</td>
                  </tr>
                )}
                {!loading && sortedParticipants.map((participant: any) => (
                  <tr key={participant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{participant.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{participant.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{participant.age}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{participant.gender}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{participant.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{participant.aadhar}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{participant.registrationSource}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(participant.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-[#00b4d8] hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Participant Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
              {/* Header */}
              <div className="bg-[#00b4d8] rounded-t-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User size={24} />
                    <h2 className="text-2xl font-bold">Add New Participant</h2>
                  </div>
                  <button 
                    onClick={handleCloseForm}
                    className="p-2 hover:bg-[#0096c7] rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-blue-100 mt-2">Fill in the participant details below</p>
              </div>

              {/* Form */}
              <form onSubmit={handleAddParticipant} className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  {/* Name * */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User size={16} className="text-[#00b4d8]" />
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newParticipant.name}
                      onChange={handleParticipantChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={newParticipant.age}
                      onChange={handleParticipantChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      placeholder="Enter age"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={newParticipant.gender}
                      onChange={handleParticipantChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone size={16} className="text-[#00b4d8]" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={newParticipant.phone}
                      onChange={handleParticipantChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Aadhar Number */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <IdCard size={16} className="text-[#00b4d8]" />
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      name="aadhar"
                      value={newParticipant.aadhar}
                      onChange={handleParticipantChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      placeholder="Enter Aadhar number"
                    />
                  </div>

                  {/* Registration Source * (fixed) */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Registration Source *
                    </label>
                    <select
                      name="registrationSource"
                      value={newParticipant.registrationSource}
                      onChange={handleParticipantChange}
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none"
                      required
                    >
                      <option value="Organic Agriculture">Organic Agriculture</option>
                    </select>
                  </div>

                  {/* Registered through */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Registered through
                    </label>
                    <select
                      name="registeredThrough"
                      value={newParticipant.registeredThrough}
                      onChange={handleParticipantChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    >
                      <option value="">Select Source</option>
                      <option value="Field Visit">Field Visit</option>
                      <option value="Referral">Referral</option>
                      <option value="Campaign">Campaign</option>
                      <option value="Online Registration">Online Registration</option>
                      <option value="Community Outreach">Community Outreach</option>
                      <option value="Government Referral">Government Referral</option>
                    </select>
                  </div>

                  {/* Address - Full Width */}
                  <div className="col-span-2 space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin size={16} className="text-[#00b4d8]" />
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={newParticipant.address}
                      onChange={handleParticipantChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all resize-none"
                      placeholder="Enter complete address"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center justify-center gap-2"
                  >
                    <User size={18} />
                    Save Participant
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
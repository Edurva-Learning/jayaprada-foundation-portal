// 'use client';

// import { useState } from 'react';
// import { Search, User, Phone, IdCard, Download, Eye, MapPin, Users, Calendar, X, Camera, FileText } from 'lucide-react';

// export default function WomenEmpowerment() {
//   const [activeTab, setActiveTab] = useState<'participants' | 'records'>('participants');
//   const [filters, setFilters] = useState({
//     name: '',
//     aadhar: '',
//     phone: '',
//     trainingType: 'All Training Types',
//     counselling: 'All',
//     employmentStatus: 'All Statuses',
//     workshop: 'All'
//   });

//   const [showParticipantForm, setShowParticipantForm] = useState(false);
//   const [showRecordForm, setShowRecordForm] = useState(false);

//   // Participant Form state
//   const [participantForm, setParticipantForm] = useState({
//     name: '',
//     age: '',
//     gender: '',
//     phone: '',
//     aadhar: '',
//     address: '',
//     registrationSource: ''
//   });

//   // Record Form state
//   const [recordForm, setRecordForm] = useState({
//     participant: '',
//     trainingType: '',
//     workshopAttended: '',
//     counsellingDone: '',
//     employmentStatus: '',
//     photo: null as File | null,
//     idProof: null as File | null
//   });

//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleParticipantFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setParticipantForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleRecordFormChange = (
//   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
// ) => {
//   const { name, value } = e.target;

//   if (e.target instanceof HTMLInputElement && e.target.files) {
//     setRecordForm(prev => ({
//       ...prev,
//       [name]: e.target.files[0],
//     }));
//   } else {
//     setRecordForm(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   }
// };

//   const handleReset = () => {
//     setFilters({
//       name: '',
//       aadhar: '',
//       phone: '',
//       trainingType: 'All Training Types',
//       counselling: 'All',
//       employmentStatus: 'All Statuses',
//       workshop: 'All'
//     });
//   };

//   const handleSaveParticipant = () => {
//     console.log("Saving participant:", participantForm);
//     setParticipantForm({
//       name: '',
//       age: '',
//       gender: '',
//       phone: '',
//       aadhar: '',
//       address: '',
//       registrationSource: ''
//     });
//     setShowParticipantForm(false);
//   };

//   const handleSaveRecord = () => {
//     console.log("Saving record:", recordForm);
//     setRecordForm({
//       participant: '',
//       trainingType: '',
//       workshopAttended: '',
//       counsellingDone: '',
//       employmentStatus: '',
//       photo: null,
//       idProof: null
//     });
//     setShowRecordForm(false);
//   };

//   const handleCloseParticipantForm = () => {
//     setParticipantForm({
//       name: '',
//       age: '',
//       gender: '',
//       phone: '',
//       aadhar: '',
//       address: '',
//       registrationSource: ''
//     });
//     setShowParticipantForm(false);
//   };

//   const handleCloseRecordForm = () => {
//     setRecordForm({
//       participant: '',
//       trainingType: '',
//       workshopAttended: '',
//       counsellingDone: '',
//       employmentStatus: '',
//       photo: null,
//       idProof: null
//     });
//     setShowRecordForm(false);
//   };

//   const participantsData = [
//     {
//       id: 2,
//       name: 'Women1',
//       age: 36,
//       gender: 'female',
//       phone: '0192837465',
//       aadhar: '012345678913',
//       createdAt: 'Sep 20, 2025'
//     }
//   ];

//   const recordsData = [
//     {
//       id: 1,
//       participant: 'Women1',
//       trainingType: 'Sewing Machine',
//       workshop: 'Yes',
//       counselling: 'No',
//       employmentStatus: 'Self-employed',
//       createdAt: 'Sep 20, 2025'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">Women Empowerment Program</h1>
          
//           {/* Navigation Tabs */}
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('participants')}
//               className={`px-6 py-3 font-medium text-sm rounded-t-lg mr-2 ${
//                 activeTab === 'participants'
//                   ? 'bg-[#00b4d8] text-white'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               Participants
//             </button>
//             <button
//               onClick={() => setActiveTab('records')}
//               className={`px-6 py-3 font-medium text-sm rounded-t-lg ${
//                 activeTab === 'records'
//                   ? 'bg-[#00b4d8] text-white'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               Empowerment Records
//             </button>
//           </div>
//         </div>

//         {/* Participants Tab Content */}
//         {activeTab === 'participants' && (
//           <>
//             {/* Statistics Section */}
//             <div className="mb-8">
//               <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm mb-6">
//                 {/* <h2 className="text-lg font-semibold text-[#0077b6] mb-4">Participants</h2>
//                  */}
//                 <div className="mb-6">
//                   {/* <h3 className="text-md font-medium text-gray-700 mb-4">Empowerment Records</h3> */}
                  
//                   <div className="grid grid-cols-4 gap-4">
//                     <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
//                       <div className="text-2xl font-bold text-black mb-1">1</div>
//                       <div className="text-sm font-medium text-black">Total Participants</div>
//                     </div>
//                     <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
//                       <div className="text-2xl font-bold text-black mb-1">1</div>
//                       <div className="text-sm font-medium text-black">Sewing Machine Trained</div>
//                     </div>
//                     <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
//                       <div className="text-2xl font-bold text-black mb-1">1</div>
//                       <div className="text-sm font-medium text-black">Workshop Attended</div>
//                     </div>
//                     <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
//                       <div className="text-2xl font-bold text-black mb-1">0</div>
//                       <div className="text-sm font-medium text-black">Employed Participants</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Search Section */}
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-3 gap-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">Search by Name</label>
//                       <div className="relative">
//                         <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                         <input
//                           type="text"
//                           name="name"
//                           value={filters.name}
//                           onChange={handleFilterChange}
//                           className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
//                           placeholder="Enter name"
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">Search by Aadhar</label>
//                       <div className="relative">
//                         <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                         <input
//                           type="text"
//                           name="aadhar"
//                           value={filters.aadhar}
//                           onChange={handleFilterChange}
//                           className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
//                           placeholder="Enter Aadhar number"
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">Search by Phone</label>
//                       <div className="relative">
//                         <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                         <input
//                           type="text"
//                           name="phone"
//                           value={filters.phone}
//                           onChange={handleFilterChange}
//                           className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
//                           placeholder="Enter phone number"
//                         />
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex gap-3">
//                     <button className="px-6 py-2.5 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center gap-2">
//                       <Search size={18} />
//                       Search
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Participants Table */}
//             <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-[#0077b6]">Women Empowerment Participants</h2>
//                 <button 
//                   onClick={() => setShowParticipantForm(true)}
//                   className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
//                 >
//                   <User size={18} />
//                   Add Participate
//                 </button>
//               </div>
              
//               <div className="overflow-hidden">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
//                       <th className="p-3 font-semibold">ID</th>
//                       <th className="p-3 font-semibold">Name</th>
//                       <th className="p-3 font-semibold">Age</th>
//                       <th className="p-3 font-semibold">Gender</th>
//                       <th className="p-3 font-semibold">Phone</th>
//                       <th className="p-3 font-semibold">Aadhar</th>
//                       <th className="p-3 font-semibold">Created At</th>
//                       <th className="p-3 font-semibold">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {participantsData.map((participant) => (
//                       <tr key={participant.id} className="border-b border-gray-200 hover:bg-gray-50">
//                         <td className="p-3">{participant.id}</td>
//                         <td className="p-3">{participant.name}</td>
//                         <td className="p-3">{participant.age}</td>
//                         <td className="p-3">{participant.gender}</td>
//                         <td className="p-3">{participant.phone}</td>
//                         <td className="p-3">{participant.aadhar}</td>
//                         <td className="p-3">{participant.createdAt}</td>
//                         <td className="p-3">
//                           <div className="flex gap-2">
//                             <button className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
//                               + Add Record
//                             </button>
//                             <button className="bg-[#00b4d8] hover:bg-[#0096c7] text-white p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors">
//                               <Eye size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Empowerment Records Tab Content */}
//         {activeTab === 'records' && (
//           <>
//             {/* Statistics and Filters Section */}
//             <div className="mb-8">
//               <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm mb-6">
//                 <h2 className="text-lg font-semibold text-[#0077b6] mb-4">Participants</h2>
                
//                 <div className="mb-6">
//                   <h3 className="text-md font-medium text-gray-700 mb-4">Empowerment Records</h3>
                  
//                   <div className="grid grid-cols-4 gap-4 mb-6">
//                     <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
//                       <div className="text-2xl font-bold text-black mb-1">1</div>
//                       <div className="text-sm font-medium text-black">Total Participants</div>
//                     </div>
//                     <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
//                       <div className="text-2xl font-bold text-black mb-1">1</div>
//                       <div className="text-sm font-medium text-black">Sewing Machine Trained</div>
//                     </div>
//                     <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
//                       <div className="text-2xl font-bold text-black mb-1">1</div>
//                       <div className="text-sm font-medium text-black">Workshop Attended</div>
//                     </div>
//                     <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
//                       <div className="text-2xl font-bold text-black mb-1">0</div>
//                       <div className="text-sm font-medium text-black">Employed Participants</div>
//                     </div>
//                   </div>

//                   <h4 className="text-sm font-medium text-gray-700 mb-3">Filter Empowerment Records</h4>
                  
//                   <div className="grid grid-cols-4 gap-4 mb-6">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">Training Type</label>
//                       <select
//                         name="trainingType"
//                         value={filters.trainingType}
//                         onChange={handleFilterChange}
//                         className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
//                       >
//                         <option>All Training Types</option>
//                         <option>Sewing Machine</option>
//                         <option>Computer Training</option>
//                         <option>Beauty Parlor</option>
//                       </select>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">Counselling Done</label>
//                       <select
//                         name="counselling"
//                         value={filters.counselling}
//                         onChange={handleFilterChange}
//                         className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
//                       >
//                         <option>All</option>
//                         <option>Yes</option>
//                         <option>No</option>
//                       </select>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">Employment Status</label>
//                       <select
//                         name="employmentStatus"
//                         value={filters.employmentStatus}
//                         onChange={handleFilterChange}
//                         className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
//                       >
//                         <option>All Statuses</option>
//                         <option>Self-employed</option>
//                         <option>Employed</option>
//                         <option>Unemployed</option>
//                       </select>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">Workshop Attended</label>
//                       <select
//                         name="workshop"
//                         value={filters.workshop}
//                         onChange={handleFilterChange}
//                         className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
//                       >
//                         <option>All</option>
//                         <option>Yes</option>
//                         <option>No</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <button className="px-6 py-2.5 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center gap-2">
//                     <Search size={18} />
//                     Apply Filters
//                   </button>
//                   <button 
//                     onClick={handleReset}
//                     className="px-6 py-2.5 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Empowerment Records Table */}
//             <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-[#0077b6]">Empowerment Records</h2>
//                 <button className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
//                   <Download size={18} />
//                   Export
//                 </button>
//               </div>
              
//               <div className="overflow-hidden">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
//                       <th className="p-3 font-semibold">ID</th>
//                       <th className="p-3 font-semibold">Participant</th>
//                       <th className="p-3 font-semibold">Training Type</th>
//                       <th className="p-3 font-semibold">Workshop</th>
//                       <th className="p-3 font-semibold">Counselling</th>
//                       <th className="p-3 font-semibold">Employment Status</th>
//                       <th className="p-3 font-semibold">Created At</th>
//                       <th className="p-3 font-semibold">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {recordsData.map((record) => (
//                       <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
//                         <td className="p-3">{record.id}</td>
//                         <td className="p-3">{record.participant}</td>
//                         <td className="p-3">{record.trainingType}</td>
//                         <td className="p-3">{record.workshop}</td>
//                         <td className="p-3">{record.counselling}</td>
//                         <td className="p-3">{record.employmentStatus}</td>
//                         <td className="p-3">{record.createdAt}</td>
//                         <td className="p-3">
//                           <div className="flex gap-2">
//                             <button className="text-gray-600 hover:text-[#00b4d8] transition-colors text-lg">
//                               💬
//                             </button>
//                             <button className="text-gray-600 hover:text-[#00b4d8] transition-colors">
//                               <Eye size={18} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Add Participant Form Modal */}
//         {showParticipantForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
//               {/* Header */}
//               <div className="bg-[#00b4d8] rounded-t-2xl p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <User size={24} />
//                     <h2 className="text-2xl font-bold">Add New Participant</h2>
//                   </div>
//                   <button 
//                     onClick={handleCloseParticipantForm}
//                     className="p-2 hover:bg-[#0096c7] rounded-full transition-colors"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
//                 <p className="text-blue-100 mt-2">Fill in the participant details below</p>
//               </div>

//               {/* Form */}
//               <div className="p-6 max-h-[70vh] overflow-y-auto">
//                 <div className="grid grid-cols-2 gap-6">
//                   {/* Name */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <User size={16} className="text-[#00b4d8]" />
//                       Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={participantForm.name}
//                       onChange={handleParticipantFormChange}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                       placeholder="Enter full name"
//                     />
//                   </div>

//                   {/* Age */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <Calendar size={16} className="text-[#00b4d8]" />
//                       Age
//                     </label>
//                     <input
//                       type="number"
//                       name="age"
//                       value={participantForm.age}
//                       onChange={handleParticipantFormChange}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                       placeholder="Enter age"
//                     />
//                   </div>

//                   {/* Gender */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <Users size={16} className="text-[#00b4d8]" />
//                       Gender
//                     </label>
//                     <select
//                       name="gender"
//                       value={participantForm.gender}
//                       onChange={handleParticipantFormChange}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                     >
//                       <option value="">Select Gender</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>

//                   {/* Phone */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <Phone size={16} className="text-[#00b4d8]" />
//                       Phone
//                     </label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={participantForm.phone}
//                       onChange={handleParticipantFormChange}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                       placeholder="Enter phone number"
//                     />
//                   </div>

//                   {/* Aadhar Number */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <IdCard size={16} className="text-[#00b4d8]" />
//                       Aadhar Number
//                     </label>
//                     <input
//                       type="text"
//                       name="aadhar"
//                       value={participantForm.aadhar}
//                       onChange={handleParticipantFormChange}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                       placeholder="Enter Aadhar number"
//                     />
//                   </div>

//                   {/* Registration Source */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <Users size={16} className="text-[#00b4d8]" />
//                       Registration Source
//                     </label>
//                     <select
//                       name="registrationSource"
//                       value={participantForm.registrationSource}
//                       onChange={handleParticipantFormChange}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                     >
//                       <option value="">Select Source</option>
//                       <option value="walk-in">Walk-in</option>
//                       <option value="referral">Referral</option>
//                       <option value="campaign">Campaign</option>
//                     </select>
//                   </div>

//                   {/* Address - Full Width */}
//                   <div className="col-span-2 space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <MapPin size={16} className="text-[#00b4d8]" />
//                       Address
//                     </label>
//                     <textarea
//                       name="address"
//                       value={participantForm.address}
//                       onChange={handleParticipantFormChange}
//                       rows={3}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all resize-none"
//                       placeholder="Enter complete address"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Footer Buttons */}
//               <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//                 <button
//                   onClick={handleCloseParticipantForm}
//                   className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
//                 >
//                   Close
//                 </button>
//                 <button
//                   onClick={handleSaveParticipant}
//                   className="flex-1 px-6 py-3 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center justify-center gap-2"
//                 >
//                   <User size={18} />
//                   Save Participant
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Add Record Form Modal */}
//         {showRecordForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
//               {/* Header */}
//               <div className="bg-[#00b4d8] rounded-t-2xl p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <FileText size={24} />
//                     <h2 className="text-2xl font-bold">Add New Record</h2>
//                   </div>
//                   <button 
//                     onClick={handleCloseRecordForm}
//                     className="p-2 hover:bg-[#0096c7] rounded-full transition-colors"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
//                 <p className="text-blue-100 mt-2">Fill in the empowerment record details</p>
//               </div>

//               {/* Form */}
//               <div className="p-6 max-h-[70vh] overflow-y-auto">
//                 <div className="grid grid-cols-2 gap-6">
//                   {/* Participant */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <User size={16} className="text-[#00b4d8]" />
//                       Participant *
//                     </label>
//                     <select
//                       name="participant"
//                       value={recordForm.participant}
//                       onChange={handleRecordFormChange}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                     >
//                       <option value="">Select Participant</option>
//                       <option value="women1">Women1</option>
//                     </select>
//                   </div>

//                   {/* Training Type */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <FileText size={16} className="text-[#00b4d8]" />
//                       Training Type *
//                     </label>
//                     <select
//                       name="trainingType"
//                       value={recordForm.trainingType}
//                       onChange={handleRecordFormChange}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                     >
//                       <option value="">Select Training Type</option>
//                       <option value="sewing-machine">Sewing Machine</option>
//                     </select>
//                   </div>

//                   {/* Workshop Attended */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <Users size={16} className="text-[#00b4d8]" />
//                       Workshop Attended
//                     </label>
//                     <select
//                       name="workshopAttended"
//                       value={recordForm.workshopAttended}
//                       onChange={handleRecordFormChange}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                     >
//                       <option value="">Select Option</option>
//                       <option value="yes">Yes</option>
//                       <option value="no">No</option>
//                     </select>
//                   </div>

//                   {/* Counselling Done */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <Users size={16} className="text-[#00b4d8]" />
//                       Counselling Done
//                     </label>
//                     <select
//                       name="counsellingDone"
//                       value={recordForm.counsellingDone}
//                       onChange={handleRecordFormChange}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                     >
//                       <option value="">Select Option</option>
//                       <option value="yes">Yes</option>
//                       <option value="no">No</option>
//                     </select>
//                   </div>

//                   {/* Employment Status */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <Users size={16} className="text-[#00b4d8]" />
//                       Employment Status
//                     </label>
//                     <select
//                       name="employmentStatus"
//                       value={recordForm.employmentStatus}
//                       onChange={handleRecordFormChange}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                     >
//                       <option value="">Select Status</option>
//                       <option value="self-employed">Self-employed</option>
//                       <option value="employed">Employed</option>
//                       <option value="unemployed">Unemployed</option>
//                     </select>
//                   </div>

//                   {/* Photo */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <Camera size={16} className="text-[#00b4d8]" />
//                       Photo (Max 100KB, JPG/PNG)
//                     </label>
//                     <input
//                       type="file"
//                       name="photo"
//                       onChange={handleRecordFormChange}
//                       accept=".jpg,.jpeg,.png"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                     />
//                     <p className="text-xs text-gray-500">No file chosen</p>
//                   </div>

//                   {/* ID Proof */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <FileText size={16} className="text-[#00b4d8]" />
//                       ID Proof (Max 200KB, JPG/PNG)
//                     </label>
//                     <input
//                       type="file"
//                       name="idProof"
//                       onChange={handleRecordFormChange}
//                       accept=".jpg,.jpeg,.png"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
//                     />
//                     <p className="text-xs text-gray-500">No file chosen</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Footer Buttons */}
//               <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//                 <button
//                   onClick={handleCloseRecordForm}
//                   className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
//                 >
//                   Close
//                 </button>
//                 <button
//                   onClick={handleSaveRecord}
//                   className="flex-1 px-6 py-3 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center justify-center gap-2"
//                 >
//                   <FileText size={18} />
//                   Save Information
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { Search, User, Phone, IdCard, Download, Eye, MapPin, Users, Calendar, X, Camera, FileText } from 'lucide-react';

export default function WomenEmpowerment() {
  const [activeTab, setActiveTab] = useState<'participants' | 'records'>('participants');
  const [filters, setFilters] = useState({
    name: '',
    aadhar: '',
    phone: '',
    trainingType: 'All Training Types',
    counselling: 'All',
    employmentStatus: 'All Statuses',
    workshop: 'All'
  });

  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);

  // Participant Form state
  const [participantForm, setParticipantForm] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    aadhar: '',
    address: '',
    registrationSource: 'Women Empowerment',
    registeredThrough: ''
  });

  // Record Form state
  const [recordForm, setRecordForm] = useState({
    participant: '',
    trainingType: '',
    workshopAttended: '',
    counsellingDone: '',
    employmentStatus: '',
    photo: null as File | null,
    idProof: null as File | null
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParticipantFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setParticipantForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecordFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        setRecordForm(prev => ({
          ...prev,
          [name]: fileInput.files![0],
        }));
      }
    } else {
      setRecordForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleReset = () => {
    setFilters({
      name: '',
      aadhar: '',
      phone: '',
      trainingType: 'All Training Types',
      counselling: 'All',
      employmentStatus: 'All Statuses',
      workshop: 'All'
    });
  };

  const handleSaveParticipant = () => {
    console.log("Saving participant:", participantForm);
    setParticipantForm({
      name: '',
      age: '',
      gender: '',
      phone: '',
      aadhar: '',
      address: '',
      registrationSource: 'Women Empowerment',
      registeredThrough: ''
    });
    setShowParticipantForm(false);
  };

  const handleSaveRecord = () => {
    console.log("Saving record:", recordForm);
    // Validate required fields
    if (!recordForm.participant || !recordForm.trainingType) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Validate file sizes if files are selected
    if (recordForm.photo && recordForm.photo.size > 100 * 1024) {
      alert('Photo size should be less than 100KB');
      return;
    }
    
    if (recordForm.idProof && recordForm.idProof.size > 200 * 1024) {
      alert('ID Proof size should be less than 200KB');
      return;
    }
    
    // Save logic here
    setRecordForm({
      participant: '',
      trainingType: '',
      workshopAttended: '',
      counsellingDone: '',
      employmentStatus: '',
      photo: null,
      idProof: null
    });
    setShowRecordForm(false);
  };

  const handleCloseParticipantForm = () => {
    setParticipantForm({
      name: '',
      age: '',
      gender: '',
      phone: '',
      aadhar: '',
      address: '',
      registrationSource: 'Women Empowerment',
      registeredThrough: ''
    });
    setShowParticipantForm(false);
  };

  const handleCloseRecordForm = () => {
    setRecordForm({
      participant: '',
      trainingType: '',
      workshopAttended: '',
      counsellingDone: '',
      employmentStatus: '',
      photo: null,
      idProof: null
    });
    setShowRecordForm(false);
  };

  const handleAddRecord = (participantId: number, participantName: string) => {
    setRecordForm(prev => ({
      ...prev,
      participant: participantName
    }));
    setShowRecordForm(true);
  };

  const participantsData = [
    {
      id: 2,
      name: 'Women1',
      age: 36,
      gender: 'female',
      phone: '0192837465',
      aadhar: '012345678913',
      createdAt: 'Sep 20, 2025'
    }
  ];

  const recordsData = [
    {
      id: 1,
      participant: 'Women1',
      trainingType: 'Sewing Machine',
      workshop: 'Yes',
      counselling: 'No',
      employmentStatus: 'Self-employed',
      createdAt: 'Sep 20, 2025'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Women Empowerment Program</h1>
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('participants')}
              className={`px-6 py-3 font-medium text-sm rounded-t-lg mr-2 ${
                activeTab === 'participants'
                  ? 'bg-[#00b4d8] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Participants
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-6 py-3 font-medium text-sm rounded-t-lg ${
                activeTab === 'records'
                  ? 'bg-[#00b4d8] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Empowerment Records
            </button>
          </div>
        </div>

        {/* Participants Tab Content */}
        {activeTab === 'participants' && (
          <>
            {/* Statistics Section */}
            <div className="mb-8">
              <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm mb-6">
                <div className="mb-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">1</div>
                      <div className="text-sm font-medium text-black">Total Participants</div>
                    </div>
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">1</div>
                      <div className="text-sm font-medium text-black">Sewing Machine Trained</div>
                    </div>
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">1</div>
                      <div className="text-sm font-medium text-black">Workshop Attended</div>
                    </div>
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">0</div>
                      <div className="text-sm font-medium text-black">Employed Participants</div>
                    </div>
                  </div>
                </div>

                {/* Search Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Search by Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="name"
                          value={filters.name}
                          onChange={handleFilterChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                          placeholder="Enter name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Search by Aadhar</label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="aadhar"
                          value={filters.aadhar}
                          onChange={handleFilterChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                          placeholder="Enter Aadhar number"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Search by Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="phone"
                          value={filters.phone}
                          onChange={handleFilterChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center gap-2">
                      <Search size={18} />
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Participants Table */}
            <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0077b6]">Women Empowerment Participants</h2>
                <button 
                  onClick={() => setShowParticipantForm(true)}
                  className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <User size={18} />
                  Add Participant
                </button>
              </div>
              
              <div className="overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
                      <th className="p-3 font-semibold">ID</th>
                      <th className="p-3 font-semibold">Name</th>
                      <th className="p-3 font-semibold">Age</th>
                      <th className="p-3 font-semibold">Gender</th>
                      <th className="p-3 font-semibold">Phone</th>
                      <th className="p-3 font-semibold">Aadhar</th>
                      <th className="p-3 font-semibold">Created At</th>
                      <th className="p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantsData.map((participant) => (
                      <tr key={participant.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3">{participant.id}</td>
                        <td className="p-3">{participant.name}</td>
                        <td className="p-3">{participant.age}</td>
                        <td className="p-3">{participant.gender}</td>
                        <td className="p-3">{participant.phone}</td>
                        <td className="p-3">{participant.aadhar}</td>
                        <td className="p-3">{participant.createdAt}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleAddRecord(participant.id, participant.name)}
                              className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                            >
                              + Add Record
                            </button>
                            <button className="bg-[#00b4d8] hover:bg-[#0096c7] text-white p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors">
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Empowerment Records Tab Content */}
        {activeTab === 'records' && (
          <>
            {/* Statistics and Filters Section */}
            <div className="mb-8">
              <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm mb-6">
                <h2 className="text-lg font-semibold text-[#0077b6] mb-4">Participants</h2>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Empowerment Records</h3>
                  
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">1</div>
                      <div className="text-sm font-medium text-black">Total Participants</div>
                    </div>
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">1</div>
                      <div className="text-sm font-medium text-black">Sewing Machine Trained</div>
                    </div>
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">1</div>
                      <div className="text-sm font-medium text-black">Workshop Attended</div>
                    </div>
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">0</div>
                      <div className="text-sm font-medium text-black">Employed Participants</div>
                    </div>
                  </div>

                  <h4 className="text-sm font-medium text-gray-700 mb-3">Filter Empowerment Records</h4>
                  
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Training Type</label>
                      <select
                        name="trainingType"
                        value={filters.trainingType}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      >
                        <option>All Training Types</option>
                        <option>Sewing Machine</option>
                        <option>Computer Training</option>
                        <option>Beauty Parlor</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Counselling Done</label>
                      <select
                        name="counselling"
                        value={filters.counselling}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      >
                        <option>All</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                      <select
                        name="employmentStatus"
                        value={filters.employmentStatus}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      >
                        <option>All Statuses</option>
                        <option>Self-employed</option>
                        <option>Employed</option>
                        <option>Unemployed</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Workshop Attended</label>
                      <select
                        name="workshop"
                        value={filters.workshop}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      >
                        <option>All</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="px-6 py-2.5 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center gap-2">
                    <Search size={18} />
                    Apply Filters
                  </button>
                  <button 
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Empowerment Records Table */}
            <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0077b6]">Empowerment Records</h2>
                <button 
                  onClick={() => setShowRecordForm(true)}
                  className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <FileText size={18} />
                  Add Record
                </button>
              </div>
              
              <div className="overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
                      <th className="p-3 font-semibold">ID</th>
                      <th className="p-3 font-semibold">Participant</th>
                      <th className="p-3 font-semibold">Training Type</th>
                      <th className="p-3 font-semibold">Workshop</th>
                      <th className="p-3 font-semibold">Counselling</th>
                      <th className="p-3 font-semibold">Employment Status</th>
                      <th className="p-3 font-semibold">Created At</th>
                      <th className="p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recordsData.map((record) => (
                      <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3">{record.id}</td>
                        <td className="p-3">{record.participant}</td>
                        <td className="p-3">{record.trainingType}</td>
                        <td className="p-3">{record.workshop}</td>
                        <td className="p-3">{record.counselling}</td>
                        <td className="p-3">{record.employmentStatus}</td>
                        <td className="p-3">{record.createdAt}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button className="text-gray-600 hover:text-[#00b4d8] transition-colors text-lg">
                              💬
                            </button>
                            <button className="text-gray-600 hover:text-[#00b4d8] transition-colors">
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Add Participant Form Modal */}
        {showParticipantForm && (
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
                    onClick={handleCloseParticipantForm}
                    className="p-2 hover:bg-[#0096c7] rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-blue-100 mt-2">Fill in the participant details below</p>
              </div>

              {/* Form */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User size={16} className="text-[#00b4d8]" />
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={participantForm.name}
                      onChange={handleParticipantFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar size={16} className="text-[#00b4d8]" />
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={participantForm.age}
                      onChange={handleParticipantFormChange}
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
                      value={participantForm.gender}
                      onChange={handleParticipantFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
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
                      value={participantForm.phone}
                      onChange={handleParticipantFormChange}
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
                      value={participantForm.aadhar}
                      onChange={handleParticipantFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      placeholder="Enter Aadhar number"
                    />
                  </div>

                  {/* Registration Source */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Registration Source *
                    </label>
                    <select
                      name="registrationSource"
                      value={participantForm.registrationSource}
                      onChange={handleParticipantFormChange}
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none"
                    >
                      <option value="Women Empowerment">Women Empowerment</option>
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
                      value={participantForm.registeredThrough}
                      onChange={handleParticipantFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    >
                      <option value="">Select Source</option>
                      <option value="walk-in">Walk-in</option>
                      <option value="referral">Referral</option>
                      <option value="campaign">Campaign</option>
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
                      value={participantForm.address}
                      onChange={handleParticipantFormChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all resize-none"
                      placeholder="Enter complete address"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={handleCloseParticipantForm}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveParticipant}
                  className="flex-1 px-6 py-3 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center justify-center gap-2"
                >
                  <User size={18} />
                  Save Participant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Record Form Modal */}
        {showRecordForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
              {/* Header */}
              <div className="bg-[#00b4d8] rounded-t-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={24} />
                    <h2 className="text-2xl font-bold">Add Empowerment Record</h2>
                  </div>
                  <button 
                    onClick={handleCloseRecordForm}
                    className="p-2 hover:bg-[#0096c7] rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-blue-100 mt-2">Fill in the empowerment record details</p>
              </div>

              {/* Form */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  {/* Participant * */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User size={16} className="text-[#00b4d8]" />
                      Participant *
                    </label>
                    <select
                      name="participant"
                      value={recordForm.participant}
                      onChange={handleRecordFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select Participant</option>
                      <option value="Women1">Women1</option>
                      <option value="Women2">Women2</option>
                      <option value="Women3">Women3</option>
                    </select>
                  </div>

                  {/* Training Type * */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FileText size={16} className="text-[#00b4d8]" />
                      Training Type *
                    </label>
                    <select
                      name="trainingType"
                      value={recordForm.trainingType}
                      onChange={handleRecordFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select Training Type</option>
                      <option value="sewing-machine">Sewing Machine</option>
                      <option value="computer-training">Computer Training</option>
                      <option value="beauty-parlor">Beauty Parlor</option>
                      <option value="handicrafts">Handicrafts</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Workshop Attended */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Workshop Attended
                    </label>
                    <select
                      name="workshopAttended"
                      value={recordForm.workshopAttended}
                      onChange={handleRecordFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    >
                      <option value="">Select Option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {/* Counselling Done */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Counselling Done
                    </label>
                    <select
                      name="counsellingDone"
                      value={recordForm.counsellingDone}
                      onChange={handleRecordFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    >
                      <option value="">Select Option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {/* Employment Status */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Employment Status
                    </label>
                    <select
                      name="employmentStatus"
                      value={recordForm.employmentStatus}
                      onChange={handleRecordFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    >
                      <option value="">Select Status</option>
                      <option value="self-employed">Self-employed</option>
                      <option value="employed">Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="seeking-employment">Seeking Employment</option>
                    </select>
                  </div>

                  {/* Photo (Max 100KB, JPG/PNG) */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Camera size={16} className="text-[#00b4d8]" />
                      Photo (Max 100KB, JPG/PNG)
                    </label>
                    <input
                      type="file"
                      name="photo"
                      onChange={handleRecordFormChange}
                      accept=".jpg,.jpeg,.png"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00b4d8] file:text-white hover:file:bg-[#0096c7]"
                    />
                    <p className="text-xs text-gray-500">
                      {recordForm.photo ? `Selected: ${recordForm.photo.name}` : 'No file chosen'}
                    </p>
                  </div>

                  {/* ID Proof (Max 200KB, JPG/PNG) */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FileText size={16} className="text-[#00b4d8]" />
                      ID Proof (Max 200KB, JPG/PNG)
                    </label>
                    <input
                      type="file"
                      name="idProof"
                      onChange={handleRecordFormChange}
                      accept=".jpg,.jpeg,.png"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00b4d8] file:text-white hover:file:bg-[#0096c7]"
                    />
                    <p className="text-xs text-gray-500">
                      {recordForm.idProof ? `Selected: ${recordForm.idProof.name}` : 'No file chosen'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={handleCloseRecordForm}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveRecord}
                  className="flex-1 px-6 py-3 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={18} />
                  Save Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
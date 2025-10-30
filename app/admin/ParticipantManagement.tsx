// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Pencil, Trash2, Plus, X, Eye, Search } from 'lucide-react';

// interface Participant {
//   id: number;
//   name: string;
//   aadhar: string;
//   age: number;
//   gender: string;
//   phone: string;
//   address: string;
//   state: string;
//   assemblyconstituency: string;
//   district: string;
//   mandal: string;
//   village: string;
//   pincode: string;
//   registration_source: string;
//   created_at: string;
//   blood_checkup: boolean;
//   medicine_required: string;
//   medicine_name: string;
//   treatment_required: string;
//   surgery_required: string;
//   campCategory?: string;
//   house_no?: string;
// }

// interface Camp {
//   id: number;
//   camp_name: string;
//   date: string;
//   location: string;
//   services: string;
//   status: string;
//   campCategory: string;
// }

// const ParticipantManagement: React.FC = () => {
//   const [participants, setParticipants] = useState<Participant[]>([]);
//   const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
//   const [camps, setCamps] = useState<Camp[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [searchName, setSearchName] = useState('');
//   const [searchAadhar, setSearchAadhar] = useState('');
//   const [searchPhone, setSearchPhone] = useState('');
//   const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const [formData, setFormData] = useState({
//     name: '',
//     aadhar: '',
//     age: '',
//     gender: 'Male',
//     phone: '',
//     address: '',
//     state: '',
//     district: '',
//     assemblyconstituency: '',
//     mandal: '',
//     village: '',
//     pincode: '',
//     registration_source: '',
//     campCategory: '',
//     house_no: ''
//   });

//   const API_BASE_URL = 'http://localhost:5000';

//   // Show success message
//   const showSuccess = (message: string) => {
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 5000);
//   };

//   // Show error message
//   const showError = (message: string) => {
//     setErrorMessage(message);
//     setTimeout(() => setErrorMessage(''), 5000);
//   };

//   const fetchParticipants = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}/participants`);
//       const data = await res.json();
//       setParticipants(data);
//       setFilteredParticipants(data);
//     } catch (err) {
//       console.error('Error fetching participants:', err);
//       showError('Failed to fetch participants');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCamps = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/camps`);
//       const data = await res.json();
//       setCamps(data);
//     } catch (err) {
//       console.error('Error fetching camps:', err);
//     }
//   };

//   useEffect(() => {
//     fetchParticipants();
//     fetchCamps();
//   }, []);

//   // Auto-generate address when location fields change
//   useEffect(() => {
//     const addressParts = [];
    
//     if (formData.house_no) addressParts.push(`H.No: ${formData.house_no}`);
//     if (formData.village) addressParts.push(formData.village);
//     if (formData.mandal) addressParts.push(formData.mandal);
//     if (formData.district) addressParts.push(formData.district);
//     if (formData.assemblyconstituency) addressParts.push(formData.assemblyconstituency);
//     if (formData.state) addressParts.push(formData.state);
//     if (formData.pincode) addressParts.push(`Pincode: ${formData.pincode}`);
    
//     const generatedAddress = addressParts.join(', ');
    
//     if (generatedAddress) {
//       setFormData(prev => ({
//         ...prev,
//         address: generatedAddress
//       }));
//     }
//   }, [
//     formData.house_no,
//     formData.village,
//     formData.mandal,
//     formData.district,
//     formData.assemblyconstituency,
//     formData.state,
//     formData.pincode
//   ]);

//   // Search functionality
//   const handleSearch = () => {
//     if (searchName === '' && searchAadhar === '' && searchPhone === '') {
//       setFilteredParticipants(participants);
//       return;
//     }

//     const filtered = participants.filter(participant => {
//       const nameMatch = participant.name.toLowerCase().includes(searchName.toLowerCase());
//       const aadharMatch = participant.aadhar.includes(searchAadhar);
//       const phoneMatch = participant.phone.includes(searchPhone);
      
//       return (searchName === '' || nameMatch) && 
//              (searchAadhar === '' || aadharMatch) && 
//              (searchPhone === '' || phoneMatch);
//     });
//     setFilteredParticipants(filtered);
//   };

//   const handleResetSearch = () => {
//     setSearchName('');
//     setSearchAadhar('');
//     setSearchPhone('');
//     setFilteredParticipants(participants);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);

//       console.log('Form data being sent:', formData);
      
//       // Validate required fields
//       if (!formData.name || !formData.registration_source) {
//         showError('Please fill in all required fields');
//         return;
//       }

//       // Validate Aadhar number (12 digits) if provided
//       if (formData.aadhar && (formData.aadhar.length !== 12 || !/^\d+$/.test(formData.aadhar))) {
//         showError('Please enter a valid 12-digit Aadhar number');
//         return;
//       }

//       // Validate phone number (10 digits) if provided
//       if (formData.phone && (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone))) {
//         showError('Please enter a valid 10-digit phone number');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/participants`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       });

//       const result = await response.json();
//       console.log('API Response:', result);

//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to create participant');
//       }

//       await fetchParticipants();
//       setFormData({
//         name: '',
//         aadhar: '',
//         age: '',
//         gender: 'Male',
//         phone: '',
//         address: '',
//         state: '',
//         district: '',
//         assemblyconstituency: '',
//         mandal: '',
//         village: '',
//         pincode: '',
//         registration_source: '',
//         campCategory: '',
//         house_no: ''
//       });
//       setIsModalOpen(false);
//       showSuccess('Participant added successfully!');
//     } catch (err) {
//       console.error('Error saving participant:', err);
//       showError('Failed to save participant');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (participant: Participant) => {
//     setSelectedParticipant(participant);
//     setFormData({
//       name: participant.name,
//       aadhar: participant.aadhar,
//       age: participant.age.toString(),
//       gender: participant.gender,
//       phone: participant.phone,
//       address: participant.address,
//       state: participant.state,
//       district: participant.district,
//       assemblyconstituency: participant.assemblyconstituency,
//       mandal: participant.mandal,
//       village: participant.village,
//       pincode: participant.pincode,
//       registration_source: participant.registration_source,
//       campCategory: participant.campCategory || '',
//       house_no: participant.house_no || ''
//     });
//     setIsEditModalOpen(true);
//   };

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedParticipant) return;

//     try {
//       setLoading(true);
      
//       // Validate required fields
//       if (!formData.name || !formData.registration_source) {
//         showError('Please fill in all required fields');
//         return;
//       }

//       // Validate Aadhar number (12 digits) if provided
//       if (formData.aadhar && (formData.aadhar.length !== 12 || !/^\d+$/.test(formData.aadhar))) {
//         showError('Please enter a valid 12-digit Aadhar number');
//         return;
//       }

//       // Validate phone number (10 digits) if provided
//       if (formData.phone && (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone))) {
//         showError('Please enter a valid 10-digit phone number');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/participants/${selectedParticipant.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       });

//       const result = await response.json();
//       console.log('Update API Response:', result);

//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to update participant');
//       }

//       await fetchParticipants();
//       setIsEditModalOpen(false);
//       setSelectedParticipant(null);
//       showSuccess('Participant updated successfully!');
//     } catch (err) {
//       console.error('Error updating participant:', err);
//       showError('Failed to update participant');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleView = (participant: Participant) => {
//     setSelectedParticipant(participant);
//     setIsViewModalOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this participant?')) return;
    
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
//         method: 'DELETE'
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete participant');
//       }

//       await fetchParticipants();
//       showSuccess('Participant deleted successfully!');
//     } catch (err) {
//       console.error('Error deleting participant:', err);
//       showError('Failed to delete participant');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       name: '',
//       aadhar: '',
//       age: '',
//       gender: 'Male',
//       phone: '',
//       address: '',
//       state: '',
//       district: '',
//       assemblyconstituency: '',
//       mandal: '',
//       village: '',
//       pincode: '',
//       registration_source: '',
//       campCategory: '',
//       house_no: ''
//     });
//     setIsModalOpen(false);
//     setIsEditModalOpen(false);
//     setIsViewModalOpen(false);
//     setSelectedParticipant(null);
//   };

//   // Message Display Component
//   const MessageDisplay = () => (
//     <>
//       {successMessage && (
//         <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
//           <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
//           {successMessage}
//         </div>
//       )}
//       {errorMessage && (
//         <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
//           <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
//           {errorMessage}
//         </div>
//       )}
//     </>
//   );

//   return (
//     <div>
//       <MessageDisplay />
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Participant Management</h1>
//       </div>
      
//       <div className="flex justify-between mb-4">
//         {/* Search Section */}
//         <div className="flex items-center gap-3 flex-1 mr-4">
//           <input
//             type="text"
//             placeholder="Search by Name"
//             value={searchName}
//             onChange={(e) => setSearchName(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//           />
//           <input
//             type="text"
//             placeholder="Search by Aadhar"
//             value={searchAadhar}
//             onChange={(e) => setSearchAadhar(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//           />
//           <input
//             type="text"
//             placeholder="Search by Phone"
//             value={searchPhone}
//             onChange={(e) => setSearchPhone(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//           />
//           <button 
//             onClick={handleSearch}
//             className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
//           >
//             <Search size={18} /> Search
//           </button>
//           {(searchName || searchAadhar || searchPhone) && (
//             <button 
//               onClick={handleResetSearch}
//               className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
//             >
//               Reset
//             </button>
//           )}
//         </div>

//         {/* Add Participant Button */}
//         <button
//           onClick={() => setIsModalOpen(true)}
//           disabled={loading}
//           className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 shadow-sm disabled:opacity-50"
//         >
//           <Plus size={18} /> Add Participant
//         </button>
//       </div>

//       {/* Add Participant Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center p-6 border-b">
//               <h2 className="text-xl font-semibold">Add New Participant</h2>
//               <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Registration Source <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="registration_source"
//                   value={formData.registration_source}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   required
//                 >
//                   <option value="">Select Registration Source</option>
//                   {camps.map((camp) => (
//                     <option key={camp.id} value={camp.camp_name}>
//                       {camp.camp_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Camp Category
//                 </label>
//                 <select
//                   name="campCategory"
//                   value={formData.campCategory}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 >
//                   <option value="">Select Camp Category</option>
//                   <option value="Eye CheckUp">Eye CheckUp</option>
//                   <option value="Dental CheckUp">Dental CheckUp</option>
//                   <option value="General CheckUp">General CheckUp</option>
//                   <option value="Cancer Screening">Cancer Screening</option>
//                   {camps.map((camp) => (
//                     <option key={camp.id} value={camp.campCategory}>
//                       {camp.campCategory}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
//                 <input
//                   type="number"
//                   name="age"
//                   value={formData.age}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   min="0"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 >
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   maxLength={10}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
//                 <input
//                   type="text"
//                   name="aadhar"
//                   value={formData.aadhar}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   maxLength={12}
//                 />
//               </div>
              
//               {/* Location Fields */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
//                 <select
//                   name="state"
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 >
//                   <option value="">Select State</option>
//                   <option value="Andhra Pradesh">Andhra Pradesh</option>
//                   <option value="Telangana">Telangana</option>
//                   <option value="Karnataka">Karnataka</option>
//                   <option value="Tamil Nadu">Tamil Nadu</option>
//                   <option value="Maharashtra">Maharashtra</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Constituency</label>
//                 <input
//                   type="text"
//                   name="assemblyconstituency"
//                   value={formData.assemblyconstituency}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
//                 <input
//                   type="text"
//                   name="district"
//                   value={formData.district}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Mandal</label>
//                 <input
//                   type="text"
//                   name="mandal"
//                   value={formData.mandal}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
//                 <input
//                   type="text"
//                   name="village"
//                   value={formData.village}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
//                 <input
//                   type="text"
//                   name="pincode"
//                   value={formData.pincode}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   House No/Street No/Building No
//                 </label>
//                 <input
//                   type="text"
//                   name="house_no"
//                   value={formData.house_no}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   placeholder="Enter house number, street, or building details"
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Address (Auto-generated)
//                 </label>
//                 <textarea
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y bg-gray-50"
//                   placeholder="Address will be automatically generated from the location fields above"
//                   readOnly
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   This field is automatically generated from the location information you provide above.
//                 </p>
//               </div>

//               <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
//                 <button
//                   type="button"
//                   onClick={handleClose}
//                   disabled={loading}
//                   className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
//                 >
//                   Close
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
//                 >
//                   {loading ? 'Saving...' : 'Save Participant'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Participant Modal */}
//       {isEditModalOpen && selectedParticipant && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center p-6 border-b">
//               <h2 className="text-xl font-semibold">Edit Participant</h2>
//               <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleUpdate} className="p-6 grid grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Registration Source <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="registration_source"
//                   value={formData.registration_source}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   required
//                 >
//                   <option value="">Select Registration Source</option>
//                   {camps.map((camp) => (
//                     <option key={camp.id} value={camp.camp_name}>
//                       {camp.camp_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Camp Category
//                 </label>
//                 <select
//                   name="campCategory"
//                   value={formData.campCategory}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 >
//                   <option value="">Select Camp Category</option>
//                   <option value="Eye CheckUp">Eye CheckUp</option>
//                   <option value="Dental CheckUp">Dental CheckUp</option>
//                   <option value="General CheckUp">General CheckUp</option>
//                   <option value="Cancer Screening">Cancer Screening</option>
//                   {camps.map((camp) => (
//                     <option key={camp.id} value={camp.campCategory}>
//                       {camp.campCategory}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
//                 <input
//                   type="number"
//                   name="age"
//                   value={formData.age}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   min="0"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 >
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   maxLength={10}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
//                 <input
//                   type="text"
//                   name="aadhar"
//                   value={formData.aadhar}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   maxLength={12}
//                 />
//               </div>
              
//               {/* Location Fields */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
//                 <select
//                   name="state"
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 >
//                   <option value="">Select State</option>
//                   <option value="Andhra Pradesh">Andhra Pradesh</option>
//                   <option value="Telangana">Telangana</option>
//                   <option value="Karnataka">Karnataka</option>
//                   <option value="Tamil Nadu">Tamil Nadu</option>
//                   <option value="Maharashtra">Maharashtra</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Constituency</label>
//                 <input
//                   type="text"
//                   name="assemblyconstituency"
//                   value={formData.assemblyconstituency}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
//                 <input
//                   type="text"
//                   name="district"
//                   value={formData.district}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Mandal</label>
//                 <input
//                   type="text"
//                   name="mandal"
//                   value={formData.mandal}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
//                 <input
//                   type="text"
//                   name="village"
//                   value={formData.village}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
//                 <input
//                   type="text"
//                   name="pincode"
//                   value={formData.pincode}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   House No/Street No/Building No
//                 </label>
//                 <input
//                   type="text"
//                   name="house_no"
//                   value={formData.house_no}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   placeholder="Enter house number, street, or building details"
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Address (Auto-generated)
//                 </label>
//                 <textarea
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y bg-gray-50"
//                   placeholder="Address will be automatically generated from the location fields above"
//                   readOnly
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   This field is automatically generated from the location information you provide above.
//                 </p>
//               </div>

//               <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
//                 <button
//                   type="button"
//                   onClick={handleClose}
//                   disabled={loading}
//                   className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
//                 >
//                   Close
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
//                 >
//                   {loading ? 'Updating...' : 'Update Participant'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* View Participant Modal */}
//       {isViewModalOpen && selectedParticipant && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center p-6 border-b">
//               <h2 className="text-xl font-semibold">Participant Details</h2>
//               <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="p-6 grid grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.name}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.age}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.gender}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.phone}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.aadhar}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Registration Source</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.registration_source}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Camp Category</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.campCategory || 'Not specified'}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.state}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Constituency</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.assemblyconstituency}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.district}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Mandal</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.mandal}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.village}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.pincode}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">House No/Street No/Building No</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {selectedParticipant.house_no || 'Not specified'}
//                 </div>
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[80px]">
//                   {selectedParticipant.address}
//                 </div>
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Created At</label>
//                 <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
//                   {new Date(selectedParticipant.created_at).toLocaleDateString()}
//                 </div>
//               </div>
//               <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
//                 <button
//                   onClick={handleClose}
//                   className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Participants Table */}
//       <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm">
//         {loading ? (
//           <div className="text-center py-8">Loading participants...</div>
//         ) : (
//           <table className="w-full text-left">
//             <thead className="bg-gray-100 text-gray-700 text-left">
//               <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
//                 <th className="px-4 py-3">ID</th>
//                 <th className="px-4 py-3">Name</th>
//                 <th className="px-4 py-3">Age</th>
//                 <th className="px-4 py-3">Gender</th>
//                 <th className="px-4 py-3">Phone</th>
//                 <th className="px-4 py-3">Aadhar</th>
//                 <th className="px-4 py-3">Registration Source</th>
//                 <th className="px-4 py-3">Camp Category</th>
//                 <th className="px-4 py-3">Created At</th>
//                 <th className="px-4 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredParticipants.map((p) => (
//                 <tr key={p.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-3">{p.id}</td>
//                   <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
//                   <td className="px-4 py-3">{p.age}</td>
//                   <td className="px-4 py-3">{p.gender}</td>
//                   <td className="px-4 py-3">{p.phone}</td>
//                   <td className="px-4 py-3">{p.aadhar}</td>
//                   <td className="px-4 py-3 text-gray-700">{p.registration_source}</td>
//                   <td className="px-4 py-3 text-gray-700">{p.campCategory || 'Not specified'}</td>
//                   <td className="px-4 py-3">{new Date(p.created_at).toLocaleDateString()}</td>
//                   <td className="px-4 py-3 flex items-center gap-3">
//                     <button 
//                       onClick={() => handleView(p)}
//                       className="bg-blue-300 hover:bg-blue-500 text-black p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
//                     >
//                       <Eye size={18} />
//                     </button>
//                     <button 
//                       onClick={() => handleEdit(p)}
//                       className="bg-orange-300 hover:bg-orange-500 text-black p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
//                     >
//                       <Pencil size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//         {filteredParticipants.length === 0 && !loading && (
//           <div className="text-center py-8 text-gray-500">No participants found</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ParticipantManagement;



'use client'; 
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Eye, Search } from 'lucide-react';

interface Participant {
  id: number;
  name: string;
  aadhar: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  state: string;
  assemblyconstituency: string;
  district: string;
  mandal: string;
  village: string;
  pincode: string;
  house_no?: string;
  registration_source: string;
  created_at: string;
  blood_checkup: boolean;
  medicine_required: string;
  medicine_name: string;
  treatment_required: string;
  campcategory: string; // 👈 updated to match backend
}

interface Camp {
  id: number;
  camp_name: string;
  date: string;
  location: string;
  services: string;
  status: string;
  campCategory: string;
}

const ParticipantManagement: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchAadhar, setSearchAadhar] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    aadhar: '',
    age: '',
    gender: 'Male',
    phone: '',
    address: '',
    state: '',
    district: '',
    assemblyconstituency: '',
    mandal: '',
    village: '',
    pincode: '',
    house_no: '',
    registration_source: '',
    campcategory: '', // 👈 updated to match backend
    blood_checkup: false,
    medicine_required: '',
    medicine_name: '',
    treatment_required: ''
  });

  const API_BASE_URL = 'http://api.jpf-portal-api.com';

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Show error message
  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/participants`);
      const data = await res.json();
      setParticipants(data);
      setFilteredParticipants(data);
    } catch (err) {
      console.error('Error fetching participants:', err);
      showError('Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };

  const fetchCamps = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/camps`);
      const data = await res.json();
      setCamps(data);
    } catch (err) {
      console.error('Error fetching camps:', err);
    }
  };

  useEffect(() => {
    fetchParticipants();
    fetchCamps();
  }, []);

  // Auto-generate address when location fields change
  useEffect(() => {
    const addressParts = [];
    
    if (formData.house_no) addressParts.push(`H.No: ${formData.house_no}`);
    if (formData.village) addressParts.push(`Village: ${formData.village}`);
    if (formData.mandal) addressParts.push(`Mandal: ${formData.mandal}`);
    if (formData.district) addressParts.push(`District: ${formData.district}`);
    if (formData.assemblyconstituency) addressParts.push(`Constituency: ${formData.assemblyconstituency}`);
    if (formData.state) addressParts.push(`State: ${formData.state}`);
    if (formData.pincode) addressParts.push(`Pincode: ${formData.pincode}`);
    
    const generatedAddress = addressParts.join(', ');
    
    if (generatedAddress) {
      setFormData(prev => ({
        ...prev,
        address: generatedAddress
      }));
    }
  }, [
    formData.house_no,
    formData.village,
    formData.mandal,
    formData.district,
    formData.assemblyconstituency,
    formData.state,
    formData.pincode
  ]);

  // Search functionality
  const handleSearch = () => {
    if (searchName === '' && searchAadhar === '' && searchPhone === '') {
      setFilteredParticipants(participants);
      return;
    }

    const filtered = participants.filter(participant => {
      const nameMatch = participant.name.toLowerCase().includes(searchName.toLowerCase());
      const aadharMatch = participant.aadhar.includes(searchAadhar);
      const phoneMatch = participant.phone.includes(searchPhone);
      
      return (searchName === '' || nameMatch) && 
             (searchAadhar === '' || aadharMatch) && 
             (searchPhone === '' || phoneMatch);
    });
    setFilteredParticipants(filtered);
  };

  const handleResetSearch = () => {
    setSearchName('');
    setSearchAadhar('');
    setSearchPhone('');
    setFilteredParticipants(participants);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      console.log('Form data being sent:', formData);
      
      // Validate required fields
      if (!formData.name || !formData.registration_source) {
        showError('Please fill in all required fields');
        return;
      }

      // Validate Aadhar number (12 digits) if provided
      if (formData.aadhar && (formData.aadhar.length !== 12 || !/^\d+$/.test(formData.aadhar))) {
        showError('Please enter a valid 12-digit Aadhar number');
        return;
      }

      // Validate phone number (10 digits) if provided
      if (formData.phone && (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone))) {
        showError('Please enter a valid 10-digit phone number');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create participant');
      }

      await fetchParticipants();
      setFormData({
        name: '',
        aadhar: '',
        age: '',
        gender: 'Male',
        phone: '',
        address: '',
        state: '',
        district: '',
        assemblyconstituency: '',
        mandal: '',
        village: '',
        pincode: '',
        house_no: '',
        registration_source: '',
        campcategory: '',
        blood_checkup: false,
        medicine_required: '',
        medicine_name: '',
        treatment_required: ''
      });
      setIsModalOpen(false);
      showSuccess('Participant added successfully!');
    } catch (err) {
      console.error('Error saving participant:', err);
      showError('Failed to save participant');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (participant: Participant) => {
    setSelectedParticipant(participant);
    setFormData({
      name: participant.name,
      aadhar: participant.aadhar,
      age: participant.age.toString(),
      gender: participant.gender,
      phone: participant.phone,
      address: participant.address,
      state: participant.state,
      district: participant.district,
      assemblyconstituency: participant.assemblyconstituency,
      mandal: participant.mandal,
      village: participant.village,
      pincode: participant.pincode,
      house_no: participant.house_no || '',
      registration_source: participant.registration_source,
      campcategory: participant.campcategory,
      blood_checkup: participant.blood_checkup,
      medicine_required: participant.medicine_required,
      medicine_name: participant.medicine_name,
      treatment_required: participant.treatment_required
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant) return;

    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.name || !formData.registration_source) {
        showError('Please fill in all required fields');
        return;
      }

      // Validate Aadhar number (12 digits) if provided
      if (formData.aadhar && (formData.aadhar.length !== 12 || !/^\d+$/.test(formData.aadhar))) {
        showError('Please enter a valid 12-digit Aadhar number');
        return;
      }

      // Validate phone number (10 digits) if provided
      if (formData.phone && (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone))) {
        showError('Please enter a valid 10-digit phone number');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/participants/${selectedParticipant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('Update API Response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update participant');
      }

      await fetchParticipants();
      setIsEditModalOpen(false);
      setSelectedParticipant(null);
      showSuccess('Participant updated successfully!');
    } catch (err) {
      console.error('Error updating participant:', err);
      showError('Failed to update participant');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this participant?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete participant');
      }

      await fetchParticipants();
      showSuccess('Participant deleted successfully!');
    } catch (err) {
      console.error('Error deleting participant:', err);
      showError('Failed to delete participant');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      aadhar: '',
      age: '',
      gender: 'Male',
      phone: '',
      address: '',
      state: '',
      district: '',
      assemblyconstituency: '',
      mandal: '',
      village: '',
      pincode: '',
      house_no: '',
      registration_source: '',
      campcategory: '',
      blood_checkup: false,
      medicine_required: '',
      medicine_name: '',
      treatment_required: ''
    });
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedParticipant(null);
  };

  // Message Display Component
  const MessageDisplay = () => (
    <>
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          {errorMessage}
        </div>
      )}
    </>
  );

  return (
    <div>
      <MessageDisplay />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Participant Management</h1>
      </div>
      
      <div className="flex justify-between mb-4">
        {/* Search Section */}
        <div className="flex items-center gap-3 flex-1 mr-4">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="Search by Aadhar"
            value={searchAadhar}
            onChange={(e) => setSearchAadhar(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="Search by Phone"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button 
            onClick={handleSearch}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Search size={18} /> Search
          </button>
          {(searchName || searchAadhar || searchPhone) && (
            <button 
              onClick={handleResetSearch}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Add Participant Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 shadow-sm disabled:opacity-50"
        >
          <Plus size={18} /> Add Participant
        </button>
      </div>

      {/* Add Participant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Add New Participant</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                <input
                  type="text"
                  name="aadhar"
                  value={formData.aadhar}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  maxLength={12}
                />
              </div>

              {/* Camp Information */}
              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Camp Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Source <span className="text-red-500">*</span>
                </label>
                <select
                  name="registration_source"
                  value={formData.registration_source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Select Registration Source</option>
                  {Array.isArray(camps) && camps.map((camp) => (
  <option key={camp.id} value={camp.camp_name}>
    {camp.camp_name}
  </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Camp Category
                </label>
                <select
                  name="campcategory"
                  value={formData.campcategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select Camp Category</option>
                  <option value="Eye CheckUp">Eye CheckUp</option>
                  <option value="Dental CheckUp">Dental CheckUp</option>
                  <option value="General CheckUp">General CheckUp</option>
                  <option value="Cancer Screening">Cancer Screening</option>
                  {camps.map((camp) => (
                    <option key={camp.id} value={camp.campCategory}>
                      {camp.campCategory}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Information */}
              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Constituency</label>
                <input
                  type="text"
                  name="assemblyconstituency"
                  value={formData.assemblyconstituency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mandal</label>
                <input
                  type="text"
                  name="mandal"
                  value={formData.mandal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House No/Street No/BUilding No
                </label>
                <input
                  type="text"
                  name="house_no"
                  value={formData.house_no}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y bg-gray-50"
                  />
                </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y bg-gray-50"
                  placeholder="Address will be automatically generated from the location fields above"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  This field is automatically generated from the location information you provide above.
                </p>
              </div>

              {/* Medical Information */}
              {/* <div className="col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
              </div> */}

              {/* <div className="col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="blood_checkup"
                    checked={formData.blood_checkup}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Blood Checkup Required</span>
                </label>
              </div> */}

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Required</label>
                <select
                  name="medicine_required"
                  value={formData.medicine_required}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
                <input
                  type="text"
                  name="medicine_name"
                  value={formData.medicine_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="If medicine required"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Required</label>
                <input
                  type="text"
                  name="treatment_required"
                  value={formData.treatment_required}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Specify treatment if required"
                />
              </div> */}

              <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Participant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Participant Modal */}
      {isEditModalOpen && selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Participant</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 grid grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                <input
                  type="text"
                  name="aadhar"
                  value={formData.aadhar}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  maxLength={12}
                />
              </div>

              {/* Camp Information */}
              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Camp Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Source <span className="text-red-500">*</span>
                </label>
                <select
                  name="registration_source"
                  value={formData.registration_source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Select Registration Source</option>
                  {camps.map((camp) => (
                    <option key={camp.id} value={camp.camp_name}>
                      {camp.camp_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Camp Category
                </label>
                <select
                  name="campcategory"
                  value={formData.campcategory || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select Camp Category</option>
                  <option value="Eye CheckUp">Eye CheckUp</option>
                  <option value="Dental CheckUp">Dental CheckUp</option>
                  <option value="General CheckUp">General CheckUp</option>
                  <option value="Cancer Screening">Cancer Screening</option>
                  {camps.map((camp) => (
                    <option key={camp.id} value={camp.campCategory}>
                      {camp.campCategory}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Information */}
              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Constituency</label>
                <input
                  type="text"
                  name="assemblyconstituency"
                  value={formData.assemblyconstituency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mandal</label>
                <input
                  type="text"
                  name="mandal"
                  value={formData.mandal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address (Auto-generated)
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y bg-gray-50"
                  placeholder="Address will be automatically generated from the location fields above"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  This field is automatically generated from the location information you provide above.
                </p>
              </div>

              {/* Medical Information */}
              {/* <div className="col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
              </div>

              <div className="col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="blood_checkup"
                    checked={formData.blood_checkup}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Blood Checkup Required</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Required</label>
                <select
                  name="medicine_required"
                  value={formData.medicine_required}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
                <input
                  type="text"
                  name="medicine_name"
                  value={formData.medicine_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="If medicine required"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Required</label>
                <input
                  type="text"
                  name="treatment_required"
                  value={formData.treatment_required}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Specify treatment if required"
                />
              </div> */}

              <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Participant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Participant Modal */}
      {isViewModalOpen && selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Participant Details</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.age}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.gender}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.phone}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.aadhar}
                </div>
              </div>

              {/* Camp Information */}
              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Camp Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Source</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.registration_source}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Camp Category</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.campcategory || 'Not specified'}
                </div>
              </div>

              {/* Location Information */}
              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.state}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Constituency</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.assemblyconstituency}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.district}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mandal</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.mandal}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.village}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.pincode}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">House No/Street No</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[80px]">
                  {selectedParticipant.house_no}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[80px]">
                  {selectedParticipant.address}
                </div>
              </div>

              {/* Medical Information */}
              {/* <div className="col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Checkup</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.blood_checkup ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Required</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.medicine_required || 'Not specified'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.medicine_name || 'Not specified'}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Required</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.treatment_required || 'Not specified'}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Created At</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {new Date(selectedParticipant.created_at).toLocaleDateString()}
                </div>
              </div> */}
              <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Participants Table */}
      <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-8">Loading participants...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Aadhar</th>
                <th className="px-4 py-3">Registration Source</th>
                <th className="px-4 py-3">Camp Category</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-4 py-3">{p.age}</td>
                  <td className="px-4 py-3">{p.gender}</td>
                  <td className="px-4 py-3">{p.phone}</td>
                  <td className="px-4 py-3">{p.aadhar}</td>
                  <td className="px-4 py-3 text-gray-700">{p.registration_source}</td>
                  <td className="px-4 py-3 text-gray-700">{p.campcategory || 'Not specified'}</td>
                  <td className="px-4 py-3">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <button 
                      onClick={() => handleView(p)}
                      className="bg-blue-300 hover:bg-blue-500 text-black p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleEdit(p)}
                      className="bg-orange-300 hover:bg-orange-500 text-black p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    {/* <button 
                      onClick={() => handleDelete(p.id)}
                       className="text-gray-600 hover:text-red-500"
                     >
                       <Trash2 size={18} />
                     </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filteredParticipants.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">No participants found</div>
        )}
      </div>
    </div>
  );
};

export default ParticipantManagement;
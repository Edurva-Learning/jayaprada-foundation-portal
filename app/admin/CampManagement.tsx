// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Pencil, Trash2, Plus, X, Calendar } from 'lucide-react';

// interface Camp {
//   id: number;
//   camp_name: string;
//   date: string;
//   location: string;
//   services: string;
//   status: string;
// }

// const CampManagement: React.FC = () => {
//   const [camps, setCamps] = useState<Camp[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCamp, setEditingCamp] = useState<Camp | null>(null);
//   const [formData, setFormData] = useState({
//     camp_name: '',
//     date: '',
//     location: '',
//     services: '',
//   });

//   const API_URL = 'http://localhost:5000/camps'; // Replace with your backend URL

//   // ✅ Fetch all camps
//   const fetchCamps = async () => {
//     try {
//       const res = await fetch(API_URL);
//       const data = await res.json();
//       setCamps(data);
//     } catch (err) {
//       console.error('Error fetching camps:', err);
//     }
//   };

//   useEffect(() => {
//     fetchCamps();
//   }, []);

//   // ✅ Handle input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Add or update camp
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (editingCamp) {
//         // Update camp
//         const res = await fetch(`${API_URL}/${editingCamp.id}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ ...formData, status: editingCamp.status }),
//         });
//         const updatedCamp = await res.json();
//         setCamps((prev) =>
//           prev.map((camp) => (camp.id === updatedCamp.id ? updatedCamp : camp))
//         );
//         setEditingCamp(null);
//       } else {
//         // Add new camp
//         const res = await fetch(API_URL, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ ...formData, status: 'Active' }),
//         });
//         const newCamp = await res.json();
//         setCamps((prev) => [newCamp, ...prev]);
//       }

//       setFormData({ camp_name: '', date: '', location: '', services: '' });
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error('Error saving camp:', err);
//     }
//   };

//   // ✅ Delete camp
//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this camp?')) return;
//     try {
//       const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
//       if (res.ok) {
//         setCamps((prev) => prev.filter((camp) => camp.id !== id));
//       }
//     } catch (err) {
//       console.error('Error deleting camp:', err);
//     }
//   };

//   // ✅ Open modal for editing
//   const handleEdit = (camp: Camp) => {
//     setEditingCamp(camp);
//     setFormData({
//       camp_name: camp.camp_name,
//       date: camp.date,
//       location: camp.location,
//       services: camp.services,
//     });
//     setIsModalOpen(true);
//   };

//   const handleClose = () => {
//     setFormData({ camp_name: '', date: '', location: '', services: '' });
//     setEditingCamp(null);
//     setIsModalOpen(false);
//   };

//   return (
//     <div>
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 shadow-sm"
//         >
//           <Plus size={18} /> Add Camp
//         </button>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center p-6 border-b">
//               <h2 className="text-xl font-semibold">
//                 {editingCamp ? 'Edit Camp' : 'Add New Camp'}
//               </h2>
//               <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="p-6">
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Camp Name</label>
//                 <input
//                   type="text"
//                   name="camp_name"
//                   value={formData.camp_name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                     required
//                   />
//                   <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
//                 <input
//                   type="text"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   required
//                 />
//               </div>
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
//                 <textarea
//                   name="services"
//                   value={formData.services}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end gap-3 pt-4 border-t">
//                 <button
//                   type="button"
//                   onClick={handleClose}
//                   className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//                 >
//                   Close
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//                 >
//                   {editingCamp ? 'Update Camp' : 'Save Camp'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
//         <table className="min-w-full border-collapse text-sm">
//           <thead className="bg-gray-100 text-gray-700 text-left">
//             <tr>
//               <th className="px-4 py-3 border-b">ID</th>
//               <th className="px-4 py-3 border-b">Name</th>
//               <th className="px-4 py-3 border-b">Date</th>
//               <th className="px-4 py-3 border-b">Location</th>
//               <th className="px-4 py-3 border-b">Services</th>
//               <th className="px-4 py-3 border-b">Status</th>
//               <th className="px-4 py-3 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {camps.map((camp) => (
//               <tr key={camp.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-3 border-b">{camp.id}</td>
//                 <td className="px-4 py-3 border-b text-blue-700 hover:underline cursor-pointer">{camp.camp_name}</td>
//                 <td className="px-4 py-3 border-b">{camp.date}</td>
//                 <td className="px-4 py-3 border-b">{camp.location}</td>
//                 <td className="px-4 py-3 border-b">{camp.services}</td>
//                 <td className="px-4 py-3 border-b">
//                   <span
//                     className={`text-xs font-semibold px-3 py-1 rounded-full ${
//                       camp.status === 'Active'
//                         ? 'bg-cyan-100 text-cyan-700'
//                         : 'bg-emerald-100 text-emerald-700'
//                     }`}
//                   >
//                     {camp.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 border-b flex items-center gap-3">
//                   <button
//                     className="text-gray-600 hover:text-blue-500"
//                     onClick={() => handleEdit(camp)}
//                   >
//                     <Pencil size={18} />
//                   </button>
//                   <button
//                     className="text-gray-600 hover:text-red-500"
//                     onClick={() => handleDelete(camp.id)}
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CampManagement;
'use client';
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Calendar } from 'lucide-react';

interface Camp {
  id: number;
  camp_name: string;
  date: string;
  location: string;
  services: string;
  status: string;
}

const CampManagement: React.FC = () => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Camp | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    camp_name: '',
    date: '',
    location: '',
    services: '',
  });

  const API_URL = 'https://api.jpf-portal-api.com/camps'; // Replace with your backend URL

  // Fetch all camps
  const fetchCamps = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCamps(data);
    } catch (err) {
      console.error('Error fetching camps:', err);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update camp
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingCamp) {
        const res = await fetch(`${API_URL}/${editingCamp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, status: editingCamp.status }),
        });
        const updatedCamp = await res.json();
        setCamps((prev) => prev.map((camp) => (camp.id === updatedCamp.id ? updatedCamp : camp)));
        setEditingCamp(null);
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, status: 'Active' }),
        });
        const newCamp = await res.json();
        setCamps((prev) => [newCamp, ...prev]);
      }
      setFormData({ camp_name: '', date: '', location: '', services: '' });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving camp:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete camp with simple alert
  const handleDelete = async (campId: number, campName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${campName}"?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${campId}`, { method: 'DELETE' });
      if (res.ok) {
        setCamps((prev) => prev.filter((camp) => camp.id !== campId));
      }
    } catch (err) {
      console.error('Error deleting camp:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal for editing
  const handleEdit = (camp: Camp) => {
    setEditingCamp(camp);
    setFormData({
      camp_name: camp.camp_name,
      date: camp.date,
      location: camp.location,
      services: camp.services,
    });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setFormData({ camp_name: '', date: '', location: '', services: '' });
    setEditingCamp(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Simple Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Camp Management</h1>
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition"
          disabled={isLoading}
        >
          <Plus size={18} /> Add Camp
        </button>
      </div>

      {/* Camps Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3 border-b font-semibold">ID</th>
              <th className="px-4 py-3 border-b font-semibold">Name</th>
              <th className="px-4 py-3 border-b font-semibold">Date</th>
              <th className="px-4 py-3 border-b font-semibold">Location</th>
              <th className="px-4 py-3 border-b font-semibold">Services</th>
              <th className="px-4 py-3 border-b font-semibold">Status</th>
              <th className="px-4 py-3 border-b font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {camps.map((camp) => (
              <tr key={camp.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 border-b">{camp.id}</td>
                <td className="px-4 py-3 border-b text-blue-700 hover:underline cursor-pointer">{camp.camp_name}</td>
                <td className="px-4 py-3 border-b">{camp.date}</td>
                <td className="px-4 py-3 border-b">{camp.location}</td>
                <td className="px-4 py-3 border-b">{camp.services}</td>
                <td className="px-4 py-3 border-b">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${camp.status === 'Active' ? 'bg-cyan-100 text-cyan-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {camp.status}
                  </span>
                </td>
                <td className="px-4 py-3 border-b flex items-center gap-3">
                  <button onClick={() => handleEdit(camp)} className="text-gray-600 hover:text-blue-500">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(camp.id, camp.camp_name)} className="text-gray-600 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">{editingCamp ? 'Edit Camp' : 'Add New Camp'}</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600" disabled={isLoading}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Camp Name</label>
                <input type="text" name="camp_name" value={formData.camp_name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500" required disabled={isLoading}/>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500" required disabled={isLoading}/>
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500" required disabled={isLoading}/>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
                <textarea name="services" value={formData.services} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500" required disabled={isLoading}/>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400" disabled={isLoading}>Close</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2" disabled={isLoading}>
                  {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (editingCamp ? 'Update Camp' : 'Save Camp')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampManagement;

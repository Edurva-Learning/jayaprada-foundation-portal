// 'use client';
// import React, { useState } from 'react';
// import { Pencil, Trash2, Plus, X } from 'lucide-react';

// const initialUsers = [
//   {
//     id: 1,
//     username: 'admin',
//     name: 'Admin User',
//     role: 'Admin',
//     createdAt: '2024-01-15',
//     status: 'Active',
//   },
//   {
//     id: 2,
//     username: 'john.doe',
//     name: 'John Doe',
//     role: 'Staff',
//     createdAt: '2024-02-20',
//     status: 'Active',
//   },
// ];

// const UserManagement: React.FC = () => {
//   const [users, setUsers] = useState(initialUsers);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     username: '',
//     password: '',
//     role: 'Staff',
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const newUser = {
//       id: users.length + 1,
//       username: formData.username,
//       name: formData.name,
//       role: formData.role,
//       createdAt: new Date().toISOString().split('T')[0],
//       status: 'Active',
//     };
//     setUsers((prev) => [...prev, newUser]);
//     setFormData({ name: '', username: '', password: '', role: 'Staff' });
//     setIsModalOpen(false);
//   };

//   const handleClose = () => {
//     setFormData({ name: '', username: '', password: '', role: 'Staff' });
//     setIsModalOpen(false);
//   };

//   return (
//     <div>
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 shadow-sm"
//         >
//           <Plus size={18} /> Add New
//         </button>
//       </div>

//       {isModalOpen && (
//         <>
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center p-6 border-b">
//                 <h2 className="text-xl font-semibold">Add New User</h2>
//                 <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
//                   <X size={20} />
//                 </button>
//               </div>
//               <form onSubmit={handleSubmit} className="p-6">
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                     required
//                   />
//                 </div>
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//                   <select
//                     name="role"
//                     value={formData.role}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                   >
//                     <option value="Staff">Staff</option>
//                     <option value="Admin">Admin</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end gap-3 pt-4 border-t">
//                   <button
//                     type="button"
//                     onClick={handleClose}
//                     className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//                   >
//                     Close
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//                   >
//                     Save User
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </>
//       )}

//       <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
//         <table className="min-w-full border-collapse text-sm">
//           <thead className="bg-gray-100 text-gray-700 text-left">
//             <tr>
//               <th className="px-4 py-3 border-b">ID</th>
//               <th className="px-4 py-3 border-b">Username</th>
//               <th className="px-4 py-3 border-b">Name</th>
//               <th className="px-4 py-3 border-b">Role</th>
//               <th className="px-4 py-3 border-b">Created At</th>
//               <th className="px-4 py-3 border-b">Status</th>
//               <th className="px-4 py-3 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-3 border-b">{user.id}</td>
//                 <td className="px-4 py-3 border-b">{user.username}</td>
//                 <td className="px-4 py-3 border-b">{user.name}</td>
//                 <td className="px-4 py-3 border-b">
//                   <span
//                     className={`text-xs font-semibold px-3 py-1 rounded-full ${
//                       user.role === 'Admin'
//                         ? 'bg-cyan-100 text-cyan-700'
//                         : 'bg-emerald-100 text-emerald-700'
//                     }`}
//                   >
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 border-b">{user.createdAt}</td>
//                 <td className="px-4 py-3 border-b">
//                   <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-100 text-cyan-700">
//                     {user.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 border-b flex items-center gap-3">
//                   <button className="text-gray-600 hover:text-blue-500">
//                     <Pencil size={18} />
//                   </button>
//                   <button className="text-gray-600 hover:text-red-500">
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

// export default UserManagement;
'use client';
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  created_at: string;
  status: string;
  password?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'Staff',
  });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_URL = 'https://api.jpf-portal-api.com/users'; // update if needed

  // Fetch all users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get<User[]>(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingUserId) {
        // Update user
        const res = await axios.put<User>(`${API_URL}/${editingUserId}`, {
          ...formData,
          created_at: new Date().toISOString().split('T')[0],
          status: 'Active',
        });
        setUsers((prev) =>
          prev.map((user) => (user.id === editingUserId ? res.data : user))
        );
      } else {
        // Create new user
        const res = await axios.post<User>(API_URL, {
          ...formData,
          created_at: new Date().toISOString().split('T')[0],
          status: 'Active',
        });
        setUsers((prev) => [...prev, res.data]);
      }
      setFormData({ name: '', username: '', password: '', role: 'Staff' });
      setEditingUserId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving user:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password || '',
      role: user.role,
    });
    setEditingUserId(user.id);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setFormData({ name: '', username: '', password: '', role: 'Staff' });
    setEditingUserId(null);
    setIsModalOpen(false);
  };

  return (
    <div>
  {/* Simple Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
      </div>

      {/* Add New Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 shadow-sm"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingUserId ? 'Edit User' : 'Add New User'}
              </h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required={!editingUserId}
                  disabled={saving}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  disabled={saving}
                >
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  disabled={saving}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Skeleton width={60} height={20} />
                    </>
                  ) : editingUserId ? 'Update User' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        {loadingUsers ? (
          <div className="p-4 space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height={40} />
            ))}
          </div>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3 border-b">ID</th>
                <th className="px-4 py-3 border-b">Username</th>
                <th className="px-4 py-3 border-b">Name</th>
                <th className="px-4 py-3 border-b">Role</th>
                <th className="px-4 py-3 border-b">Created At</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{user.id}</td>
                  <td className="px-4 py-3 border-b">{user.username}</td>
                  <td className="px-4 py-3 border-b">{user.name}</td>
                  <td className="px-4 py-3 border-b">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        user.role === 'Admin'
                          ? 'bg-cyan-100 text-cyan-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b">{user.created_at.split('T')[0]}</td>
                  <td className="px-4 py-3 border-b">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-100 text-cyan-700">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b flex items-center gap-3">
                    <button
                      className="text-gray-600 hover:text-blue-500"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-gray-600 hover:text-red-500"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

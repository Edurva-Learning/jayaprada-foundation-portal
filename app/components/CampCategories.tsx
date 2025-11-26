// pages/camp-categories.js or components/CampCategories.js
import { useState } from 'react';

const CampCategories = () => {
  const [categories, setCategories] = useState([
    { id: 8, name: 'Blood Tests', formType: 'blood_test', description: 'Sugar test, Haemoglobin Test', status: 'Active' },
    { id: 5, name: 'Cancer Screening', formType: 'cancer_screening', description: 'Cancer screening and awareness camp', status: 'Active' },
    { id: 12, name: 'Dental', formType: 'dental', description: 'Dental medicines and supplies', status: 'Active' },
    { id: 2, name: 'Dental Camp', formType: 'dental_screening', description: 'Dental screening', status: 'Active' },
    { id: 4, name: 'ENT Camp', formType: 'ent_screening', description: 'Ear, Nose and Throat examination', status: 'Active' },
    { id: 1, name: 'Eye Camp', formType: 'eye_screening', description: 'Eye examination and treatment camp', status: 'Active' },
    { id: 14, name: 'First Aid', formType: 'first_aid', description: 'First aid supplies and emergency medicines', status: 'Active' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    formType: '',
    description: ''
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (!formData.name || !formData.formType) {
      alert('Please fill in required fields');
      return;
    }

    if (editingId) {
      setCategories(categories.map(cat => 
        cat.id === editingId 
          ? { ...cat, ...formData }
          : cat
      ));
      setEditingId(null);
    } else {
      const newCategory = {
        id: Math.max(...categories.map(cat => cat.id)) + 1,
        ...formData,
        status: 'Active'
      };
      setCategories([...categories, newCategory]);
    }

    setFormData({
      name: '',
      formType: '',
      description: ''
    });
  };

  const handleEdit = (category: { id: any; name: any; formType: any; description: any; status?: string; }) => {
    setFormData({
      name: category.name,
      formType: category.formType,
      description: category.description
    });
    setEditingId(category.id);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      formType: '',
      description: ''
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Manage Camp Categories</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 bg-[#00b4d8] px-6 py-4 rounded-lg overflow-hidden">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Type *
                </label>
                <input
                  type="text"
                  name="formType"
                  value={formData.formType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="e.g., eye_screening, dental_screening"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                placeholder="Enter description"
              />
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex justify-end space-x-3">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#00b4d8] border border-transparent rounded-md hover:bg-[#0099c3] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
              >
                {editingId ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">Existing Categories</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.formType}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {category.description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {category.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-[#00b4d8] hover:text-[#0099c3] font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default CampCategories;
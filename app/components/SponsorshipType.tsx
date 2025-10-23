// components/education/SponsorshipTypes.tsx
import { Plus, Edit, MoreHorizontal } from 'lucide-react';

export default function SponsorshipTypes() {
  const typesData = [
    {
      id: '1',
      name: 'Education Fee Scholarship',
      description: 'Full tuition fee support for underprivileged students',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Book & Supplies Grant',
      description: 'Support for educational materials and supplies',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Uniform Allowance',
      description: 'Financial assistance for school uniforms',
      status: 'Active',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Sponsorship Types</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Type
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {typesData.map((type) => (
                <tr key={type.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-b">{type.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{type.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 border-b">{type.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border-b">{type.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-b">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
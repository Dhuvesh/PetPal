
import { Search, PlusCircle } from 'lucide-react';
import { users } from '../../data/MockData';
import StatusBadge from '../../components/StatusBadge';

const UserManagementPage = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="font-semibold mb-4">User Management</h2>
      <div className="mb-4 flex justify-between">
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full p-2 pl-8 border border-gray-300 rounded-md text-sm"
          />
          <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button className="px-3 py-1 bg-black text-white rounded-lg text-sm">
          <PlusCircle className="w-4 h-4 inline mr-1" />
          Add User
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{user.name}</td>
              <td className="px-4 py-3 text-sm">{user.email}</td>
              <td className="px-4 py-3 text-sm">{user.role}</td>
              <td className="px-4 py-3">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-4 py-3 text-sm">
                <button className="text-blue-600 text-xs underline mr-2">Edit</button>
                {user.status === 'Active' ? (
                  <button className="text-red-600 text-xs underline">Deactivate</button>
                ) : (
                  <button className="text-green-600 text-xs underline">Activate</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementPage;
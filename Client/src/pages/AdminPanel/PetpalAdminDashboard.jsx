import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  PlusCircle, 
  Heart, 
  ClipboardList, 
  Search,
  Bell,
  Settings,
  LogOut,
  Filter,
  ArrowUpRight,
  Users,
  Check,
  X
} from 'lucide-react';

const PetpalAdminDashboard = () => {
  const [activePage, setActivePage] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Add Pet', icon: PlusCircle },
    { name: 'Donation Management', icon: Heart },
    { name: 'Adoption Applications', icon: ClipboardList },
    { name: 'User Management', icon: Users }
  ];

  // Verification requests data
  const verificationRequests = [
    { id: 1, name: 'Emma Johnson', date: 'May 15, 2025', status: 'pending' },
    { id: 2, name: 'Michael Chen', date: 'May 14, 2025', status: 'pending' },
    { id: 3, name: 'Sophia Rodriguez', date: 'May 13, 2025', status: 'pending' },
    { id: 4, name: 'James Wilson', date: 'May 12, 2025', status: 'pending' },
    { id: 5, name: 'Olivia Davis', date: 'May 11, 2025', status: 'pending' },
  ];

  // Render different page content based on active page
  const renderPageContent = () => {
    switch(activePage) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Owner Verification':
        return <VerificationPage requests={verificationRequests} />;
      case 'Add Pet':
        return <AddPetPage />;
      case 'Donation Management':
        return <DonationPage />;
      case 'Adoption Applications':
        return <AdoptionPage />;
    
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-60 bg-black text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="font-bold text-lg">PETPAL ADMIN</div>
        </div>
        
        <nav className="mt-4 flex-grow px-2">
          {menuItems.map((item) => (
            <button 
              key={item.name}
              className={`px-3 py-2 my-1 flex items-center cursor-pointer space-x-3 rounded w-full text-left ${
                activePage === item.name 
                  ? 'bg-white text-black font-medium' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
        
        {/* Profile Section */}
        <div className="p-4 border-t border-gray-800 mx-2">
          <div className="flex items-center space-x-2">
            <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
              A
            </div>
            <div className="flex-grow">
              <div className="text-sm">Admin</div>
            </div>
            <LogOut className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="text-lg font-semibold">{activePage}</div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-100 pl-8 pr-4 py-1 rounded-lg text-sm w-48 focus:outline-none"
              />
              <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <Bell className="w-5 h-5 text-gray-500" />
            <Settings className="w-5 h-5 text-gray-500" />
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
};

// Page Components
const DashboardPage = () => (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {[
        { label: 'Total Pets', value: '238', change: '+14' },
        { label: 'Active Owners', value: '143', change: '+12' },
        { label: 'Pending Verifications', value: '27', change: '+4' },
        { label: 'Adoption Rate', value: '68%', change: '+2%' }
      ].map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">{stat.label}</div>
          <div className="mt-1 flex items-end justify-between">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-gray-600">
              {stat.change} this week
            </div>
          </div>
        </div>
      ))}
    </div>
    
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <h2 className="font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="font-medium">New pet added</div>
          <div className="text-sm text-gray-500">Max, Golden Retriever · 10 minutes ago</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="font-medium">Owner verification approved</div>
          <div className="text-sm text-gray-500">Sarah Williams · 1 hour ago</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="font-medium">Donation received</div>
          <div className="text-sm text-gray-500">$150 from John Smith · 3 hours ago</div>
        </div>
      </div>
    </div>
  </div>
);



const AddPetPage = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
    <h2 className="font-semibold mb-4">Add New Pet</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
        <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
        <select className="w-full p-2 border border-gray-300 rounded-md">
          <option>Dog</option>
          <option>Cat</option>
          <option>Bird</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
        <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input type="number" className="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea className="w-full p-2 border border-gray-300 rounded-md" rows="3"></textarea>
      </div>
      <div className="pt-2">
        <button className="px-4 py-2 bg-black text-white rounded-lg">Add Pet</button>
      </div>
    </div>
  </div>
);

const DonationPage = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
    <h2 className="font-semibold mb-4">Donation Management</h2>
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-500">Total Donations</div>
          <div className="text-2xl font-bold">$8,245</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-500">This Month</div>
          <div className="text-2xl font-bold">$1,280</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-500">Average Donation</div>
          <div className="text-2xl font-bold">$58</div>
        </div>
      </div>
    </div>
    <div>
      <h3 className="font-medium mb-2">Recent Donations</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
            <th className="px-4 py-2">Donor</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-4 py-3">John Smith</td>
            <td className="px-4 py-3">$150</td>
            <td className="px-4 py-3">May 15, 2025</td>
            <td className="px-4 py-3"><span className="text-green-600">Completed</span></td>
          </tr>
          <tr>
            <td className="px-4 py-3">Maria Garcia</td>
            <td className="px-4 py-3">$75</td>
            <td className="px-4 py-3">May 14, 2025</td>
            <td className="px-4 py-3"><span className="text-green-600">Completed</span></td>
          </tr>
          <tr>
            <td className="px-4 py-3">David Lee</td>
            <td className="px-4 py-3">$200</td>
            <td className="px-4 py-3">May 13, 2025</td>
            <td className="px-4 py-3"><span className="text-green-600">Completed</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const AdoptionPage = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
    <h2 className="font-semibold mb-4">Adoption Applications</h2>
    <table className="w-full">
      <thead>
        <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Applicant</th>
          <th className="px-4 py-2">Pet</th>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 text-sm">#104</td>
          <td className="px-4 py-3 text-sm">Rebecca Johnson</td>
          <td className="px-4 py-3 text-sm">Bella (Cat)</td>
          <td className="px-4 py-3 text-sm text-gray-500">May 15, 2025</td>
          <td className="px-4 py-3">
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
              In Review
            </span>
          </td>
          <td className="px-4 py-3 text-sm">
            <button className="text-blue-600 text-xs underline">Review</button>
          </td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 text-sm">#103</td>
          <td className="px-4 py-3 text-sm">Thomas Wright</td>
          <td className="px-4 py-3 text-sm">Max (Dog)</td>
          <td className="px-4 py-3 text-sm text-gray-500">May 14, 2025</td>
          <td className="px-4 py-3">
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
              Approved
            </span>
          </td>
          <td className="px-4 py-3 text-sm">
            <button className="text-blue-600 text-xs underline">View</button>
          </td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 text-sm">#102</td>
          <td className="px-4 py-3 text-sm">Sarah Miller</td>
          <td className="px-4 py-3 text-sm">Daisy (Dog)</td>
          <td className="px-4 py-3 text-sm text-gray-500">May 13, 2025</td>
          <td className="px-4 py-3">
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
              Rejected
            </span>
          </td>
          <td className="px-4 py-3 text-sm">
            <button className="text-blue-600 text-xs underline">View</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const UserManagementPage = () => (
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
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 text-sm">Admin User</td>
          <td className="px-4 py-3 text-sm">admin@petpal.com</td>
          <td className="px-4 py-3 text-sm">Administrator</td>
          <td className="px-4 py-3">
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
              Active
            </span>
          </td>
          <td className="px-4 py-3 text-sm">
            <button className="text-blue-600 text-xs underline mr-2">Edit</button>
            <button className="text-red-600 text-xs underline">Deactivate</button>
          </td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 text-sm">Emily Davis</td>
          <td className="px-4 py-3 text-sm">emily@petpal.com</td>
          <td className="px-4 py-3 text-sm">Volunteer</td>
          <td className="px-4 py-3">
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
              Active
            </span>
          </td>
          <td className="px-4 py-3 text-sm">
            <button className="text-blue-600 text-xs underline mr-2">Edit</button>
            <button className="text-red-600 text-xs underline">Deactivate</button>
          </td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 text-sm">Mark Wilson</td>
          <td className="px-4 py-3 text-sm">mark@petpal.com</td>
          <td className="px-4 py-3 text-sm">Volunteer</td>
          <td className="px-4 py-3">
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
              Inactive
            </span>
          </td>
          <td className="px-4 py-3 text-sm">
            <button className="text-blue-600 text-xs underline mr-2">Edit</button>
            <button className="text-green-600 text-xs underline">Activate</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default PetpalAdminDashboard;
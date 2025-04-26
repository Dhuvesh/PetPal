import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  PlusCircle, 
  Heart, 
  ClipboardList, 
  User 
} from 'lucide-react';

const PetpalAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Owner Verification');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Owner Verification', icon: ShieldCheck },
    { name: 'Add pet', icon: PlusCircle },
    { name: 'Donation to NGO', icon: Heart },
    { name: 'Adoption Applications', icon: ClipboardList }
  ];

  // Breadcrumb component
  const Breadcrumbs = () => {
    const pathItems = activeTab.split(' ');
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span>Petpal Admin</span>
        {pathItems.map((item, index) => (
          <React.Fragment key={item}>
            <span>/</span>
            <span className={index === pathItems.length - 1 ? 'text-purple-600 font-semibold' : ''}>
              {item}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white flex flex-col">
        <div className="p-4 font-bold text-xl">Petpal Admin</div>
        <nav className="mt-4 flex-grow">
          {menuItems.map((item) => (
            <div 
              key={item.name}
              className={`px-4 py-2 flex items-center cursor-pointer space-x-3 ${
                activeTab === item.name 
                  ? 'bg-purple-600 text-white' 
                  : 'hover:bg-gray-800'
              }`}
              onClick={() => setActiveTab(item.name)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </div>
          ))}
        </nav>
        
        {/* Profile Section */}
        <div className="bg-blue-500 text-white p-4 flex items-center space-x-3">
          <User className="w-6 h-6" />
          <span>Profile</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100">
        {/* Header with Breadcrumbs */}
        <div className="p-4 bg-white border-b flex justify-between items-center pt-20">
          <div>
            <h1 className="text-xl font-semibold text-purple-600">{activeTab}</h1>
            <Breadcrumbs />
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-4">
          {/* Placeholder for main content */}
        </div>
      </div>
    </div>
  );
};

export default PetpalAdminDashboard;
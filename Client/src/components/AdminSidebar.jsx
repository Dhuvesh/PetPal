import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  PlusCircle, 
  Heart, 
  ClipboardList, 
  Users,
  LogOut
} from 'lucide-react';
import { menuItems } from '../data/MockData';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the current page from the URL path
  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;
  
  // Map of icon names to actual icon components
  const iconComponents = {
    LayoutDashboard: LayoutDashboard,
    ShieldCheck: ShieldCheck,
    PlusCircle: PlusCircle,
    Heart: Heart,
    ClipboardList: ClipboardList,
    Users: Users
  };

  return (
    <div className="w-60 bg-black text-white flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="font-bold text-lg">PETPAL ADMIN</div>
      </div>
      
      <nav className="mt-4 flex-grow px-2">
        {menuItems.map((item) => {
          const IconComponent = iconComponents[item.icon];
          return (
            <button 
              key={item.name}
              className={`px-3 py-2 my-1 flex items-center cursor-pointer space-x-3 rounded w-full text-left ${
                currentPath === item.path 
                  ? 'bg-white text-black font-medium' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => navigate(item.path)}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm">{item.name}</span>
            </button>
          );
        })}
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
  );
};

export default Sidebar;
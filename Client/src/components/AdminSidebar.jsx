import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  PlusCircle, 
  ClipboardList, 
  LogOut, 
  DollarSign, 
  Contact 
} from 'lucide-react';


const Sidebar = () => {
  const location = useLocation();
 

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      path: '/ngo-panel/dashboard' 
    },
    { 
      name: 'Add Pet', 
      icon: <PlusCircle className="w-5 h-5" />, 
      path: '/ngo-panel/add-pet' 
    },
    { 
      name: 'Adoptions', 
      icon: <Heart className="w-5 h-5" />, 
      path: '/ngo-panel/adoptions' 
    },
    { 
      name: 'Users', 
      icon: <Users className="w-5 h-5" />, 
      path: '/ngo-panel/users' 
    },
    { 
      name: 'Donations', 
      icon: <DollarSign className="w-5 h-5" />, 
      path: '/ngo-panel/donations' 
    },
    { 
      name: 'Contact Messages', 
      icon: <Contact className="w-5 h-5" />, 
      path: '/ngo-panel/contacts' 
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-black text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto shadow-lg">
      <div className="p-5 border-b border-base-300">
        <h1 className="text-2xl font-bold text-white">PETPAL NGO</h1>
      </div>

      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-white text-black' 
                      : 'hover:bg-slate-400'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-base-300">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-error hover:bg-base-300 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
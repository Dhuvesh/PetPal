
import { useLocation } from 'react-router-dom';
import { Search, Bell, Settings } from 'lucide-react';
import { menuItems } from '../data/MockData';

const Header = () => {
  const location = useLocation();
  
  // Extract the current page from the URL path
  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;
  
  // Get the current page title from the path
  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.name : 'Dashboard';
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="text-lg font-semibold">{getPageTitle()}</div>
      
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
  );
};

export default Header;
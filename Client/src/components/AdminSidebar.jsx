
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
   
  Heart, 
  PlusCircle, 
  
  LogOut, 
  DollarSign, 
  Contact,

} from 'lucide-react';
import { useAuthStore } from '../store/UseAuthStore';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-black text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto shadow-lg flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">PETPAL NGO</h1>
      </div>

      <div className="p-4 flex-1">
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
                      : 'hover:bg-slate-700'
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

      {/* User Info Section */}
      <div className="p-4 border-t border-gray-700">
        {authUser && authUser.userType === 'ngo' && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            {/* NGO Name */}
            <div className="mb-2">
              <div className="text-xs text-gray-400 uppercase tracking-wide">NGO</div>
              <div className="text-sm font-semibold text-white truncate">
                {authUser.ngoName}
              </div>
            </div>
            
            {/* Representative Name */}
            <div className="mb-2">
              <div className="text-xs text-gray-400 uppercase tracking-wide">Representative</div>
              <div className="text-sm font-medium text-white truncate">
                {authUser.personName}
              </div>
            </div>
            
            {/* Email */}
            <div className="mb-1">
              <div className="text-xs text-gray-400 uppercase tracking-wide">Email</div>
              <div className="text-xs text-gray-300 truncate">
                {authUser.email}
              </div>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
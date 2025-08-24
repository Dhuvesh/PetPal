import { Link } from "react-router-dom";
import { useAuthStore } from "../store/UseAuthStore";
import { useChatStore } from "../store/useChatStore"; 
import {
  LogOut,
  Settings,
  User,
  MessageSquare,
  UserIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import NotificationDropdown from "./Notification";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { initializeSocket, disconnectSocket } = useChatStore(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // --- NEW: MANAGE SOCKET LIFECYCLE HERE ---
  useEffect(() => {
    if (authUser) {
      // If user is logged in, connect the socket
      initializeSocket();
    }
    // No cleanup function here, disconnect is handled on logout
  }, [authUser, initializeSocket]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    disconnectSocket(); // Disconnect the socket first
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">PetPal</h1>
            </Link>
          </div>

          {/* Nav buttons */}
          <div className="hidden md:flex items-center justify-center gap-2">
            <Link to="/" className="btn btn-sm btn-ghost">Home</Link>
            <Link to="/adopt" className="btn btn-sm btn-ghost">Adopt</Link>
            <Link to="/rehome" className="btn btn-sm btn-ghost">Rehome</Link>
            <Link to="/donate" className="btn btn-sm btn-ghost">Donate</Link>
            <Link to="/contact" className="btn btn-sm btn-ghost">Contact Us</Link>
          </div>

          {/* Profile dropdown */}
          {authUser ? (
            <div className="flex items-center gap-3">
              {authUser.userType !== 'ngo' && (
                <NotificationDropdown className="hidden md:block" />
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-base-200 p-2 rounded-lg transition-colors"
                >
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                      <span className="text-xs">
                        {authUser.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {authUser.fullName || 'User'}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-base-300">
                      <p className="text-sm font-medium">{authUser.fullName}</p>
                      <p className="text-xs text-base-content/60">{authUser.email}</p>
                      {authUser.userType && (
                        <p className="text-xs text-primary font-medium capitalize">
                          {authUser.userType}
                        </p>
                      )}
                    </div>
                    <div className="py-2">
                      <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-base-200" onClick={() => setIsDropdownOpen(false)}><User className="w-4 h-4" />Profile</Link>
                      <Link to="/my-applications" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-base-200" onClick={() => setIsDropdownOpen(false)}><UserIcon className="w-4 h-4" />My Applications</Link>
                      <Link to="/chat" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-base-200" onClick={() => setIsDropdownOpen(false)}><MessageSquare className="w-4 h-4" />Messages</Link>
                      <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-base-200" onClick={() => setIsDropdownOpen(false)}><Settings className="w-4 h-4" />Settings</Link>
                      {authUser.userType !== 'ngo' && (
                        <div className="md:hidden">
                          <NotificationDropdown className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-base-200 w-full" />
                        </div>
                      )}
                      <hr className="my-2 border-base-300" />
                      <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
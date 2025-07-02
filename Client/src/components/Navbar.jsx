  import { Link } from "react-router-dom";
  import { useAuthStore } from "../store/UseAuthStore";
  import { LogOut, PawPrint, Settings, User, ChevronDown, UserIcon } from "lucide-react";
  import { useState, useRef, useEffect } from "react";

  const Navbar = () => {
    const { logout, authUser } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <header
        className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80"
      >
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            {/* Logo on the left */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-lg font-bold">PetPal</h1>
              </Link>
            </div>

            {/* Navigation buttons in the middle */}
            <div className="hidden md:flex items-center justify-center gap-2">
              <Link
                to="/"
                className="btn btn-sm btn-ghost"
              >
                Home
              </Link>
              <Link
                to="/adopt"
                className="btn btn-sm btn-ghost"
              >
                Adopt
              </Link>
              <Link
                to="/rehome"
                className="btn btn-sm btn-ghost"
              >
                Rehome
              </Link>
              <Link
                to="/donate"
                className="btn btn-sm btn-ghost"
              >
                Donate
              </Link>
              <Link
                to="/contact"
                className="btn btn-sm btn-ghost"
              >
                Contact Us
              </Link>
            </div>

            {/* Profile dropdown on the right */}
            {authUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-1 bg-base-200 rounded-md shadow-lg">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-base-300 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/my-applications"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-base-300 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <UserIcon className="w-4 h-4" />
                      My Applications
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-base-300 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      className="flex items-center gap-2 px-4 py-2 hover:bg-base-300 w-full text-left transition-colors"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-ghost">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-sm btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  };

  export default Navbar;
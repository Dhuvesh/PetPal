import { House, PawPrint, Info   } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Headers() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <nav className="bg-gradient-to-r from-yellow-300 to-green-400 p-2 shadow-md">
      <div className="grid grid-cols-2 items-center  p-4 mx-auto">
        <div className="flex items-center gap-2">
          <PawPrint className="w-10 h-10 text-green-700" />
          <Link to="/">
            <h1 className="font-extrabold text-3xl text-green-700 ">PetPal</h1>
          </Link>
        </div>
        <div className="flex justify-end">
          <ul className="flex items-center gap-6 text-lg font-semibold">
            <li>
              <Link
                to="/"
                className="flex items-center space-x-2 text-green-800 hover:text-yellow-600 transition-colors"
              >
                <House className="w-6 h-6" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-green-800 hover:text-yellow-600 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Info className="w-6 h-6" />
                  <span>About</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center space-x-2">
                {currentUser ? (
                  <img
                    src={currentUser.profilePic}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-green-600"
                  />
                ) : (
                  <div className="text-green-800 hover:text-yellow-600 transition-colors">
                    Sign In
                  </div>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

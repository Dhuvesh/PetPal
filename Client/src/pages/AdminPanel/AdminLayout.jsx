import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "../../components/AdminSidebar.jsx"

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-white text-black ">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/AdminSidebar';
import Header from '../../components/Header';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Component */}
        <Header />
        
        {/* Content Area - This is where the Outlet will render the current page */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
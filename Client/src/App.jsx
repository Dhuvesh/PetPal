import { Navigate, Route, Routes, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "./store/UseAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Loader, MessageCircle } from 'lucide-react';
import { useThemeStore } from "./store/useThemeStore";

// Main pages
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import ContactUsPage from "./pages/ContactUspage";
import DonationPage from "./pages/Donation";

// Pet related pages
import PetAdoptionStore from "./pages/Adoption/PetStore";
import PetDetailsPage from "./pages/Adoption/PetDetails";
import EnhancedPetRehomingForm from "./pages/Rehome/RehomePet";
import VetServicesPage from "./pages/VetServices/VetServices";

// Admin/NGO panel pages
import Navbar from "./components/Navbar";
import AdminLayout from "./pages/AdminPanel/AdminLayout";
import Dashboard from "./pages/AdminPanel/AdminDashboard";
import AdoptionPage from "./pages/AdminPanel/AdoptionPage";
import AdminDonationPage from "./pages/AdminPanel/DonationPage";
import AdminContactPage from "./pages/AdminPanel/ContactPage";
import AdoptionFormPage from "./pages/Adoption/AdoptioFormPage";
import MyAdoptionsPage from "./pages/Adoption/Status";
import ChatSystem from "./pages/ChatPage";

// Protected Route Component for NGO Panel
const ProtectedNGORoute = ({ children }) => {
  const { authUser } = useAuthStore();
  
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user is NGO type
  if (authUser.userType !== 'ngo') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  // Check if the current path is part of the NGO panel
  const isNGOpanel = location.pathname.startsWith("/ngo-panel");
  // Check if currently on chat page to hide the chat button
  const isChatPage = location.pathname === "/chat";

  return (
    <div data-theme={theme}>
      {/* Only render Navbar if NOT on NGO panel */}
      {!isNGOpanel && <Navbar />}
      
      <Routes>
        {/* Main Routes */}
        <Route 
          path="/" 
          element={
            authUser ? (
              // Redirect NGO users to their panel, regular users to landing page
              authUser.userType === 'ngo' ? <Navigate to="/ngo-panel" replace /> : <LandingPage />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/signup" 
          element={!authUser ? <SignUpPage /> : (
            // Redirect based on user type after signup
            authUser.userType === 'ngo' ? <Navigate to="/ngo-panel" /> : <Navigate to="/" />
          )} 
        />
        <Route 
          path="/login" 
          element={!authUser ? <LoginPage /> : (
            // Redirect based on user type after login
            authUser.userType === 'ngo' ? <Navigate to="/ngo-panel" /> : <Navigate to="/" />
          )} 
        />
        <Route path="/contact" element={authUser ? <ContactUsPage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/adopt" element={authUser ? <PetAdoptionStore/> : <Navigate to="/login" />} />
        <Route path="/adopt/:id" element={authUser ? <PetDetailsPage /> : <Navigate to="/login" />} />
        <Route path="/adopt/form/:id" element={authUser ? <AdoptionFormPage /> : <Navigate to="/login" />} />
        <Route path="/donate" element={authUser ? <DonationPage /> : <Navigate to="/login" />} />
        <Route path="/rehome" element={authUser ? <EnhancedPetRehomingForm /> : <Navigate to="/login" />} />
        <Route path="/vet-services" element={authUser ? <VetServicesPage /> : <Navigate to="/login" />} />
        <Route path="/my-applications" element={<MyAdoptionsPage />} />
        <Route path="/chat" element={authUser ? <ChatSystem /> : <Navigate to="/login" />} />
        
        {/* NGO Panel Routes - Protected and Nested under AdminLayout */}
        <Route 
          path="/ngo-panel" 
          element={
            <ProtectedNGORoute>
              <AdminLayout />
            </ProtectedNGORoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-pet" element={<EnhancedPetRehomingForm />} />
          <Route path="donations" element={<AdminDonationPage />} />
          <Route path="adoptions" element={<AdoptionPage />} />
          <Route path="contacts" element={<AdminContactPage />} />
        </Route>
      </Routes>

      {/* Fixed Chat Button - Only show if user is authenticated and not already on chat page */}
      {authUser && !isChatPage && (
        <Link 
          to="/chat"
          className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          title="Open Chat"
        >
          <MessageCircle className="w-6 h-6" />
        </Link>
      )}

      <Toaster />
    </div>
  );
}
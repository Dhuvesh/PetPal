import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/UseAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Loader } from 'lucide-react';
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
import UserManagementPage from "./pages/AdminPanel/UserManagementPage";
import AdminDonationPage from "./pages/AdminPanel/DonationPage";
import AdminContactPage from "./pages/AdminPanel/ContactPage";
import AdoptionFormPage from "./pages/Adoption/AdoptioFormPage";

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

  return (
    <div data-theme={theme}>
      {/* Only render Navbar if NOT on NGO panel */}
      {!isNGOpanel && <Navbar />}
      
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={authUser ? <LandingPage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/adopt" element={<PetAdoptionStore />} />
        <Route path="/adopt/:id" element={<PetDetailsPage />} />
        <Route path="/adopt/form/:id" element={<AdoptionFormPage />} />
        <Route path="/donate" element={<DonationPage />} />
        <Route path="/rehome" element={<EnhancedPetRehomingForm />} />
        <Route path="/vet-services" element={<VetServicesPage />} />
        
        {/* NGO Panel Routes - Nested under AdminLayout */}
        <Route path="/ngo-panel" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-pet" element={<EnhancedPetRehomingForm />} />
          <Route path="donations" element={<AdminDonationPage />} />
          <Route path="adoptions" element={<AdoptionPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="contacts" element={<AdminContactPage />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}
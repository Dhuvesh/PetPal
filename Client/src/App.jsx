import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { useAuthStore } from "./store/UseAuthStore";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { Loader } from 'lucide-react'
import { useThemeStore } from "./store/useThemeStore";
import Navbar from "./components/Navbar";
import PetAdoptionStore from "./pages/Adoption/PetStore";
import PetDetailsPage from "./pages/Adoption/PetDetails";
import PetRehomingForm from "./pages/Rehome/RehomePet";
import VetServicesPage from "./pages/VetServices/VetServices";
import PetpalAdminDashboard from "./pages/AdminPanel/PetpalAdminDashboard";
import ContactPage from "./pages/ContactUspage";
import DonationPage from "./pages/Donation";

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

  // Check if the current path is /ngo-panel
  const isNGOpanel = location.pathname === "/ngo-panel";

  return (
    <>
      {/* Main content with conditional navbar */}
      <div data-theme={theme}>
        {/* Only render Navbar if NOT on NGO panel */}
        {!isNGOpanel && <Navbar />}
        
        <Routes>
          <Route path="/" element={authUser ? <LandingPage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/adopt" element={<PetAdoptionStore />} />
          <Route path="/adopt/:id" element={<PetDetailsPage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/rehome" element={<PetRehomingForm />} />
          <Route path="/vet-services" element={<VetServicesPage />} />
          {/* NGO panel route moved to main Routes */}
          <Route path="/ngo-panel" element={<PetpalAdminDashboard />} />
        </Routes>
        <Toaster />
      </div>
    </>
  )
}
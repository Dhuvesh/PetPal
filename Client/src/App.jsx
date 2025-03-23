import { Navigate, Route, Routes } from "react-router-dom";

import { useAuthStore } from "./store/UseAuthStore";
import {  useEffect } from "react";
import LandingPage from "./pages/LandingPage";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import {Loader} from 'lucide-react'
import { useThemeStore } from "./store/useThemeStore";
import Navbar from "./components/Navbar";
import PetAdoptionStore from "./pages/Adoption/PetStore";
import PetDetailsPage from "./pages/Adoption/PetDetails";
import PetRehomingForm from "./pages/Rehome/RehomePet";
import VetServicesPage from "./pages/VetServices/VetServices";

export default function App() {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const {theme} = useThemeStore()

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser});



  if(isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )
  
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <LandingPage />:<Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage />:<Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage />: <Navigate to="/" />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage />: <Navigate to="/login" />} />
        <Route path="/adopt" element = {<PetAdoptionStore />} />
        <Route path="/adopt/:id" element = {<PetDetailsPage />} />
        <Route path="/rehome" element = {<PetRehomingForm />} />
        <Route path="/vet-services" element={<VetServicesPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}
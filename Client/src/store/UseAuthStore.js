import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/api/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      let res;
      
      if (data.userType === 'ngo') {
        // Convert file to base64 for NGO signup
        let idCardPhotoBase64 = '';
        if (data.idCardPhoto) {
          idCardPhotoBase64 = await convertToBase64(data.idCardPhoto);
        }

        const ngoData = {
          ngoName: data.ngoName,
          personName: data.personName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          password: data.password,
          idCardPhoto: idCardPhotoBase64
        };
        
        res = await axiosInstance.post("/api/auth/ngo-signup", ngoData);
        toast.success("NGO registration submitted successfully! Please wait for verification.");
      } else {
        // Regular user signup
        const userData = {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          userType: 'user'
        };
        
        res = await axiosInstance.post("/api/auth/signup", userData);
        toast.success("Account created successfully");
      }
      
      set({ authUser: res.data });
      return res.data; // Return the user data for navigation logic
      
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
      throw error; // Re-throw to handle in component
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/api/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      return res.data; // Return user data for navigation
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error; // Re-throw to handle in component
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/api/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));

// Helper function to convert file to base64
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
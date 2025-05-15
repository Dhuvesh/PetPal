import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [signupType, setSignupType] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userFormData, setUserFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [ngoFormData, setNgoFormData] = useState({
    ngoName: '',
    contactPersonName: '',
    email: '',
    phoneNumber: '',
    idCardPhoto: null,
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateUserForm = () => {
    if (!userFormData.fullName.trim()) return toast.error("Full name is required");
    if (!userFormData.email.trim()) return toast.error("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(userFormData.email)) return toast.error("Invalid email format");
    if (!userFormData.password.trim()) return toast.error("Password is required");
    if (userFormData.password.length < 6) return toast.error("Password must be at least 6 characters long");
    return true;
  };

  const validateNgoForm = () => {
    if (!ngoFormData.ngoName.trim()) return toast.error("NGO name is required");
    if (!ngoFormData.contactPersonName.trim()) return toast.error("Contact person name is required");
    if (!ngoFormData.email.trim()) return toast.error("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(ngoFormData.email)) return toast.error("Invalid email format");
    if (!ngoFormData.phoneNumber.trim()) return toast.error("Phone number is required");
    if (!/^\d{10}$/.test(ngoFormData.phoneNumber)) return toast.error("Invalid phone number");
    if (!ngoFormData.idCardPhoto) return toast.error("ID card photo is required");
    return true;
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const success = validateUserForm();
    if (success) {
      signup(userFormData);
    }
  };

  const handleNgoSubmit = (e) => {
    e.preventDefault();
    const success = validateNgoForm();
    if (success) {
      signup(ngoFormData);
    }
  };

  const handleIdCardUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNgoFormData({ ...ngoFormData, idCardPhoto: file });
    }
  };

  // Render signup type selection if not selected
  if (!signupType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-6">
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Pet Adoption Image Section */}
          <div className="hidden md:block bg-cover bg-center" style={{
            backgroundImage: 'url("/api/placeholder/600/800?text=Pet+Adoption")',
            backgroundSize: 'cover'
          }}>
            <div className="h-full bg-black/40 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h2 className="text-4xl font-bold mb-4">Join Our Pet Community</h2>
                <p className="text-xl">Choose how you want to make a difference</p>
              </div>
            </div>
          </div>

          {/* Signup Type Selection */}
          <div className="flex flex-col justify-center p-8 space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Sign Up As</h2>
            <button 
              onClick={() => setSignupType('user')}
              className="btn btn-primary btn-lg w-full flex items-center justify-center space-x-3"
            >
              <LucideIcons.User className="w-6 h-6" />
              <span>Individual User</span>
            </button>
            <button 
              onClick={() => setSignupType('ngo')}
              className="btn btn-secondary btn-lg w-full flex items-center justify-center space-x-3"
            >
              <LucideIcons.Building2 className="w-6 h-6" />
              <span>NGO / Shelter</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User Signup Form
  if (signupType === 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-6 pt-15 mt-7">
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Pet Adoption Image Section */}
          <div className="hidden md:block bg-cover bg-center" style={{
            backgroundImage: 'url("https://img.freepik.com/free-vector/adopt-pet-with-man-dogs_23-2148519498.jpg?ga=GA1.1.185710264.1725692991&semt=ais_hybrid&w=740")',
            backgroundSize: 'cover'
          }}>
            <div className="h-full bg-black/40 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <LucideIcons.DogIcon className="w-24 h-24 mx-auto mb-4" />
                <h2 className="text-4xl font-bold mb-4">Welcome Pet Lover!</h2>
                <p className="text-xl">Find your perfect companion today</p>
              </div>
            </div>
          </div>

          {/* User Signup Form */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-6">Create User Account</h2>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={userFormData.fullName}
                    onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
                    className="input input-bordered w-full pl-10"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <LucideIcons.User className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    className="input input-bordered w-full pl-10"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <LucideIcons.Mail className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    className="input input-bordered w-full pl-10 pr-10"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <LucideIcons.Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showPassword ? (
                      <LucideIcons.EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <LucideIcons.Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <LucideIcons.Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Switch to NGO Signup */}
            <div className="text-center mt-4">
              <button 
                onClick={() => setSignupType('ngo')}
                className="text-primary hover:underline"
              >
                Already have an account? Login 
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NGO Signup Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-6 pt-28">
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Pet Adoption Image Section */}
        <div className="hidden md:block bg-cover bg-center" style={{
          backgroundImage: 'url("https://img.freepik.com/free-vector/adopt-pet-with-man-dogs_23-2148519498.jpg?ga=GA1.1.185710264.1725692991&semt=ais_hybrid&w=740")',
          backgroundSize: 'cover'
        }}>
          <div className="h-full bg-black/40 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <LucideIcons.Building2 className="w-24 h-24 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">NGO Registration</h2>
              <p className="text-xl">Help us make a difference in animal lives</p>
            </div>
          </div>
        </div>

        {/* NGO Signup Form */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-6">NGO / Shelter Registration</h2>
          <form onSubmit={handleNgoSubmit} className="space-y-4">
            {/* NGO Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">NGO Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter NGO name"
                  value={ngoFormData.ngoName}
                  onChange={(e) => setNgoFormData({ ...ngoFormData, ngoName: e.target.value })}
                  className="input input-bordered w-full pl-10"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <LucideIcons.Building2 className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Contact Person Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Contact Person Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Name of contact person"
                  value={ngoFormData.contactPersonName}
                  onChange={(e) => setNgoFormData({ ...ngoFormData, contactPersonName: e.target.value })}
                  className="input input-bordered w-full pl-10"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <LucideIcons.User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="NGO contact email"
                  value={ngoFormData.email}
                  onChange={(e) => setNgoFormData({ ...ngoFormData, email: e.target.value })}
                  className="input input-bordered w-full pl-10"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <LucideIcons.Mail className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Phone Number</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Contact phone number"
                  value={ngoFormData.phoneNumber}
                  onChange={(e) => setNgoFormData({ ...ngoFormData, phoneNumber: e.target.value })}
                  className="input input-bordered w-full pl-10"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <LucideIcons.Phone className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* ID Card Upload */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Valid ID Card</span>
              </label>
              <input
                type="file"
                onChange={handleIdCardUpload}
                className="file-input file-input-bordered w-full"
                accept="image/*"
              />
              {ngoFormData.idCardPhoto && (
                <div className="mt-2 text-sm text-green-600">
                  {ngoFormData.idCardPhoto.name} uploaded
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-secondary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <LucideIcons.Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Register NGO"
              )}
            </button>
          </form>

          {/* Switch to User Signup */}
          <div className="text-center mt-4">
            <button 
              onClick={() => setSignupType('user')}
              className="text-secondary hover:underline"
            >
              Signing up as an individual user instead?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
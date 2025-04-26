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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-6">
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Pet Adoption Image Section */}
          <div className="hidden md:block bg-cover bg-center" style={{
            backgroundImage: 'url("/api/placeholder/600/800?text=Adopt+a+Friend")',
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
                Signing up as an NGO instead?
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
          backgroundImage: 'url("data:image/jpeg;base64,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")',
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
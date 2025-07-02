import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    password: '',
    userType: 'user', // Default user type
    
    // Individual user fields
    fullName: '',
    
    // NGO specific fields
    ngoName: '',
    personName: '',
    phoneNumber: '',
    idCardPhoto: null,
  });

  const validateForm = () => {
    // Common validations
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    // User type specific validations
    if (formData.userType === 'user') {
      if (!formData.fullName.trim()) {
        toast.error("Full name is required");
        return false;
      }
    } else if (formData.userType === 'ngo') {
      if (!formData.ngoName.trim()) {
        toast.error("NGO name is required");
        return false;
      }
      if (!formData.personName.trim()) {
        toast.error("Person name is required");
        return false;
      }
      if (!formData.phoneNumber.trim()) {
        toast.error("Phone number is required");
        return false;
      }
      if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
        toast.error("Invalid phone number format");
        return false;
      }
      if (!formData.idCardPhoto) {
        toast.error("Valid ID card photo is required");
        return false;
      }
    }

    return true;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setFormData({ ...formData, idCardPhoto: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const userData = await signup(formData);
      
      // Navigate based on user type and verification status
      if (formData.userType === 'user') {
        navigate('/');
      } else if (formData.userType === 'ngo') {
        // For NGO users, navigate to login page
        // They need to wait for verification before accessing the NGO panel
        navigate('/login');
      }
    } catch (error) {
      // Error handling is done in the store
      console.error('Signup error:', error);
    }
  };

  const renderUserForm = () => (
    <>
      {/* Full Name Input */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Full Name</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="input input-primary w-full pl-10"
            disabled={isSigningUp}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <LucideIcons.User className="h-5 w-5 text-base-content/50" />
          </div>
        </div>
      </div>
    </>
  );

  const renderNGOForm = () => (
    <>
      {/* NGO Name Input */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">NGO Name</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter NGO name"
            value={formData.ngoName}
            onChange={(e) => setFormData({ ...formData, ngoName: e.target.value })}
            className="input input-primary w-full pl-10"
            disabled={isSigningUp}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <LucideIcons.Building className="h-5 w-5 text-base-content/50" />
          </div>
        </div>
      </div>

      {/* Person Name Input */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Representative Name</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter your name"
            value={formData.personName}
            onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
            className="input input-primary w-full pl-10"
            disabled={isSigningUp}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <LucideIcons.User className="h-5 w-5 text-base-content/50" />
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
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="input input-primary w-full pl-10"
            disabled={isSigningUp}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <LucideIcons.Phone className="h-5 w-5 text-base-content/50" />
          </div>
        </div>
      </div>

      {/* ID Card Photo Upload */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Valid ID Card Photo</span>
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="file-input file-input-primary w-full"
            disabled={isSigningUp}
          />
          {formData.idCardPhoto && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-success">
              <LucideIcons.CheckCircle className="h-4 w-4" />
              <span>{formData.idCardPhoto.name}</span>
            </div>
          )}
        </div>
        <label className="label">
          <span className="label-text-alt text-base-content/60">
            Upload a clear photo of your valid ID card (Max 5MB)
          </span>
        </label>
      </div>
    </>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-100 overflow-hidden relative">
      <div className="absolute inset-0 bg-primary/10 animate-[shimmer_10s_ease_infinite]"></div>
      
      <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 z-10 relative">
        {/* Left Side - Illustration & Motivational Section */}
        <div className="bg-primary/20 flex flex-col justify-center items-center p-12 space-y-8 text-center">
          <div className="bg-primary/20 p-6 rounded-full">
            <LucideIcons.DogIcon className="w-32 h-32 text-primary animate-bounce" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-base-content">
              Join <span className="text-primary">PetPal</span>
            </h1>
            <p className="text-xl text-base-content/80 max-w-md mx-auto">
              Your compassionate journey starts here. Connect, care, and make a difference in animal welfare.
            </p>
          </div>
          
          <div className="flex space-x-4 text-base-content/70">
            <div className="flex items-center space-x-2">
              <LucideIcons.Heart className="w-6 h-6 text-primary" />
              <span>Rehome</span>
            </div>
            <div className="flex items-center space-x-2">
              <LucideIcons.Home className="w-6 h-6 text-primary" />
              <span>Adopt</span>
            </div>
            <div className="flex items-center space-x-2">
              <LucideIcons.Star className="w-6 h-6 text-primary" />
              <span>Donate</span>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="bg-base-200 flex items-center justify-center p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-base-content mb-2 mt-6">Create Account</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Type Dropdown */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Sign up as</span>
                </label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    userType: e.target.value,
                    // Reset form fields when switching user types
                    fullName: '',
                    ngoName: '',
                    personName: '',
                    phoneNumber: '',
                    idCardPhoto: null
                  })}
                  className="select select-primary w-full"
                  disabled={isSigningUp}
                >
                  <option value="user">Individual User</option>
                  <option value="ngo">NGO Representative</option>
                </select>
              </div>

              {/* Dynamic Form Fields */}
              {formData.userType === 'user' ? renderUserForm() : renderNGOForm()}

              {/* Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input input-primary w-full pl-10"
                    disabled={isSigningUp}
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <LucideIcons.Mail className="h-5 w-5 text-base-content/50" />
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input input-primary w-full pl-10 pr-10"
                    disabled={isSigningUp}
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <LucideIcons.Lock className="h-5 w-5 text-base-content/50" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
                    disabled={isSigningUp}
                  >
                    {showPassword ? (
                      <LucideIcons.EyeOff className="h-5 w-5 text-base-content/50 hover:text-base-content" />
                    ) : (
                      <LucideIcons.Eye className="h-5 w-5 text-base-content/50 hover:text-base-content" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <LucideIcons.Loader2 className="h-5 w-5 animate-spin mr-2" />
                    {formData.userType === 'ngo' ? 'Registering NGO...' : 'Creating Account...'}
                  </>
                ) : (
                  formData.userType === 'ngo' ? "Register NGO" : "Create Account"
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-base-content/70">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
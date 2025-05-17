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
    fullName: '',
    email: '',
    password: '',
    userType: 'user', // Default user type
  });

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters long");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success) {
      switch(formData.userType) {
        case 'user':
          signup(formData);
          navigate('/user-dashboard');
          break;
        case 'ngo':
          signup(formData);
          navigate('/ngo-dashboard');
          break;
        default:
          toast.error("Invalid user type");
      }
    }
  };

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
              <h2 className="text-3xl font-bold text-base-content mb-2">Create Account</h2>
              <p className="text-base-content/70">Sign up to start your mission</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Type Dropdown */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Sign up as</span>
                </label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                  className="select select-primary w-full"
                >
                  <option value="user">Individual User</option>
                  <option value="ngo">NGO Representative</option>
                </select>
              </div>

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
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <LucideIcons.User className="h-5 w-5 text-base-content/50" />
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input input-primary w-full pl-10"
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
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <LucideIcons.Lock className="h-5 w-5 text-base-content/50" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
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
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
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
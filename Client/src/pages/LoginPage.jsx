import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email.trim()) {
      return toast.error("Email is required");
    }
    if (!formData.password.trim()) {
      return toast.error("Password is required");
    }

    login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Pet Adoption Image Section */}
        <div className="hidden md:block bg-cover bg-center" style={{
          backgroundImage: 'url("/api/placeholder/600/800?text=Welcome+Back")',
          backgroundSize: 'cover'
        }}>
          <div className="h-full bg-black/40 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <LucideIcons.DogIcon className="w-24 h-24 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-xl">Continue your animal welfare journey</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-6">Login to Your Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              
              {/* Optional: Forgot Password Link */}
              <label className="label">
                <a href="/forgot-password" className="label-text-alt link link-primary">Forgot password?</a>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <LucideIcons.Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
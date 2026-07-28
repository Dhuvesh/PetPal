import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/UseAuthStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user', // Default user type for UI purposes only
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email.trim()) {
      return toast.error("Email is required");
    }
    if (!formData.password.trim()) {
      return toast.error("Password is required");
    }

    try {

      const userData = await login({
        email: formData.email,
        password: formData.password
      });

      if (userData.userType === 'user') {
        navigate('/');
      } else if (userData.userType === 'ngo') {
        navigate('/ngo-panel');
      } else {
        toast.error("Unknown user type");
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-100 overflow-y-auto relative py-8 px-4 md:py-0 md:px-0 md:overflow-hidden md:max-h-screen">
      <div className="absolute inset-0 bg-primary/10 animate-[shimmer_10s_ease_infinite]"></div>

      <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 z-10 relative gap-6 md:gap-0">
        {/* Left Side - Illustration & Motivational Section */}
        <div className="hidden md:flex bg-primary/20 h-screen flex-col justify-center items-center p-6 md:p-12 space-y-6 md:space-y-8 text-center">
          <div className="bg-primary/20 p-4 md:p-6 rounded-full">
            <LucideIcons.DogIcon className="w-20 h-20 md:w-32 md:h-32 text-primary animate-bounce" />
          </div>

          <div className="space-y-3 md:space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-base-content">
              Welcome to <span className="text-primary">PetPal</span>
            </h1>
            <p className="text-lg md:text-xl text-base-content/80 max-w-md mx-auto">
              Your compassionate journey starts here. Connect, care, and make a difference in animal welfare.
            </p>
          </div>

          <div className="flex space-x-4 text-base-content/70 flex-wrap justify-center gap-y-2">
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

        {/* Compact mobile header, shown only below md */}
        <div className="flex md:hidden flex-col items-center text-center space-y-3 mb-2">
          <div className="bg-primary/20 p-4 rounded-full">
            <LucideIcons.DogIcon className="w-14 h-14 text-primary animate-bounce" />
          </div>
          <h1 className="text-2xl font-extrabold text-base-content">
            Welcome to <span className="text-primary">PetPal</span>
          </h1>
          <p className="text-sm text-base-content/80 max-w-xs mx-auto">
            Your compassionate journey starts here. Connect, care, and make a difference in animal welfare.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-base-200 flex items-center justify-center p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-none">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-2 mt-2 md:mt-6">Login</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

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
                    disabled={isLoggingIn}
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <LucideIcons.Mail className="h-5 w-5 text-base-content/50" />
                  </div>
                </div>
              </div>

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
                    className="input input-primary w-full pl-10 pr-10"
                    disabled={isLoggingIn}
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <LucideIcons.Lock className="h-5 w-5 text-base-content/50" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
                    disabled={isLoggingIn}
                  >
                    {showPassword ? (
                      <LucideIcons.EyeOff className="h-5 w-5 text-base-content/50 hover:text-base-content" />
                    ) : (
                      <LucideIcons.Eye className="h-5 w-5 text-base-content/50 hover:text-base-content" />
                    )}
                  </button>
                </div>

                {/* Forgot Password Link */}
                <label className="label">
                  <Link to="/forgot-password" className="label-text-alt link link-primary">
                    Forgot password?
                  </Link>
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
              <p className="text-base-content/70">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import useAuth from '@/app/hooks/useAuth';

export default function SignupPage() {
  const router = useRouter();
  const { signup, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(null);

  useEffect(() => {
    if (error) setFormError(error);
  }, [error]);

  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!username || !email || !password || !confirmPassword || !termsAccepted) {
      setFormError('Please fill in all fields and accept terms');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Enhanced password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setFormError('Password must be 8+ chars with uppercase, lowercase, and number');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    const success = await signup(username, email, password, confirmPassword);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="flex items-center justify-center mb-8 animate-slideInDown">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-lg shadow-lg">
            <Zap className="text-white" size={32} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 animate-slideInUp">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
            Join AppManager and start automating your setup
          </p>

          {formError && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg text-sm flex items-center gap-2 animate-slideInDown">
              <AlertCircle size={18} className="flex-shrink-0" />
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all duration-300 disabled:bg-slate-100 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                  placeholder="your_username"
                  required
                  aria-label="Username"
/>
              </div>
            </div>

            {/* Email Input */}
            <div className="animate-slideInLeft" style={{ animationDelay: '0.15s' }}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all duration-300 disabled:bg-slate-100 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                  placeholder="your@email.com"
                  required
                  aria-label="Email address"
/>
              </div>
            </div>

            {/* Password Input */}
            <div className="animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all duration-300 disabled:bg-slate-100 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  required
                  aria-label="Password"
/>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                At least 6 characters recommended
              </p>
            </div>

            {/* Confirm Password Input */}
            <div className="animate-slideInLeft" style={{ animationDelay: '0.25s' }}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all duration-300 disabled:bg-slate-100 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  required
                  aria-label="Confirm password"
/>
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && (
                <div className="flex items-center gap-2 mt-1">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle size={16} className="text-green-600" />
                      <p className="text-xs text-green-600">Passwords match</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} className="text-red-600" />
                      <p className="text-xs text-red-600">Passwords do not match</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <label className="flex items-start cursor-pointer group animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-slate-300 mt-0.5" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={loading}
                aria-label="Accept terms and conditions"
              />
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                I agree to the{' '}
                <Link href="#" className="text-blue-600 hover:underline font-semibold">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-blue-600 hover:underline font-semibold">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-400 font-semibold mt-8 btn-interactive transition-all duration-300 flex items-center justify-center gap-2 animate-slideInLeft"
              style={{ animationDelay: '0.35s' }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center text-slate-600 dark:text-slate-300 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold transition-colors hover:underline">
              Login Here
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 dark:text-slate-400 text-xs mt-6 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          © 2024 AppManager. Secure and fast app installation.
        </p>
      </div>
    </div>
  );
}


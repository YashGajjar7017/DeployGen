/**
 * useAuth Hook
 * Custom React hook for authentication operations
 */

import { useState } from 'react';
import { authAPI } from '@/app/lib/api';
import useAuthStore from '@/app/lib/store';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { setUser, logout, user, token, isAuthenticated } = useAuthStore();

  const signup = async (username, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const response = await authAPI.signup({
        username,
        email,
        password,
        confirmPassword,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user, token);
      toast.success('Account created successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user, token);
      toast.success('Login successful');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    toast.success('Logged out successfully');
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    signup,
    login,
    logout: handleLogout,
  };
};

export default useAuth;

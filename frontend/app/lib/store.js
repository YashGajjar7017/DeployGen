/**
 * Auth Store
 * Zustand store for managing authentication state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user, token) => set({ user, token, isAuthenticated: !!token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;

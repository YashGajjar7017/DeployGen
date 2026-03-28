/**
 * App Store
 * Zustand store for managing app selection and configuration
 */

import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  apps: [],
  selectedApps: [],
  filteredApps: [],
  categories: [],
  selectedCategory: null,
  searchQuery: '',

  // Set apps
  setApps: (apps) => set({ apps, filteredApps: apps }),

  // Set categories
  setCategories: (categories) => set({ categories }),

  // Toggle app selection
  toggleApp: (appId) => set((state) => {
    const isSelected = state.selectedApps.includes(appId);
    const newSelected = isSelected
      ? state.selectedApps.filter(id => id !== appId)
      : [...state.selectedApps, appId];
    return { selectedApps: newSelected };
  }),

  // Select multiple apps
  selectMultipleApps: (appIds) => set({ selectedApps: appIds }),

  // Clear selection
  clearSelection: () => set({ selectedApps: [] }),

  // Filter apps
  filterApps: (category = null, searchQuery = '') => set((state) => {
    let filtered = state.apps;

    if (category) {
      filtered = filtered.filter(app => app.category === category);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query)
      );
    }

    return {
      filteredApps: filtered,
      selectedCategory: category,
      searchQuery,
    };
  }),
}));

export default useAppStore;

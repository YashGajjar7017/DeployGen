/**
 * Header Component
 * Navigation bar with theme toggle and auth links
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, LogOut, User } from 'lucide-react';
import useAuthStore from '@/app/lib/store';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            ⚙️
          </div>
          DeployGen
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
            Dashboard
          </Link>
          <Link href="/apps" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
            Apps
          </Link>
          <Link href="/premium" className="text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors">
            Premium
          </Link>
          <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
            Contact
          </Link>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          {/* Auth */}
          {mounted && (
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600">
                    <User size={18} />
                    {user?.username}
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg">
                    Login
                  </Link>
                  <Link href="/login/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="px-4 py-4 space-y-3">
            <Link href="/dashboard" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
              Dashboard
            </Link>
            <Link href="/apps" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
              Apps
            </Link>
            <Link href="/premium" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-cyan-600 rounded-lg hover:bg-cyan-50 dark:hover:bg-slate-700 transition-colors">
              Premium
            </Link>
            <Link href="/about" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
              Contact
            </Link>
            <hr className="dark:border-slate-700" />
            {mounted && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link href="/profile" className="block px-4 py-2 text-slate-600 dark:text-slate-300">
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2 text-blue-600">
                      Login
                    </Link>
                    <Link href="/login/signup" className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-center">
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

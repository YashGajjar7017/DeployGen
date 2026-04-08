/**
 * Header Component - Glassmorphic Design
 * Modern navigation bar with glass effect, theme toggle and auth links
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, LogOut, User, Zap } from 'lucide-react';
import useAuthStore from '@/app/lib/store';
import { GlassButton } from './GlassComponents';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md">
      {/* Glass background with border */}
      <div className="absolute inset-0 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border-b border-white/20 dark:border-white/10" />
      
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo with glow */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
          <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold group-hover:shadow-glow transition-shadow duration-300">
            ⚙️
          </div>
          <span className="gradient-text">DeployGen</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/apps', label: 'Apps' },
            { href: '/premium', label: 'Premium' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
            </Link>
          ))}

          {/* Theme Toggle with glass effect */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-lg bg-white/20 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 backdrop-blur-md transition-all duration-200 text-slate-700 dark:text-slate-200"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          {/* Auth Section */}
          {mounted && (
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-200"
                  >
                    <User size={18} />
                    <span className="text-sm">{user?.username}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/60 hover:bg-red-600/80 text-white rounded-lg backdrop-blur-md border border-red-400/30 transition-all duration-200 hover:shadow-glow"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/login/signup"
                    className="px-4 py-2 bg-blue-500/70 hover:bg-blue-600/80 text-white rounded-lg backdrop-blur-md border border-blue-400/30 transition-all duration-200 hover:shadow-glow font-medium flex items-center gap-2"
                  >
                    <Zap size={16} />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/5 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu with glass effect */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-md border-b border-white/20 dark:border-white/10">
          <div className="px-4 py-4 space-y-2">
            <Link href="/dashboard" className="block px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
              Dashboard
            </Link>
            <Link href="/apps" className="block px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
              Apps
            </Link>
            <Link href="/premium" className="block px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:text-cyan-600 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
              Premium
            </Link>
            <Link href="/about" className="block px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:text-purple-600 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
              Contact
            </Link>
            <hr className="dark:border-white/10 my-2" />
            {mounted && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link href="/profile" className="block px-4 py-2.5 text-slate-600 dark:text-slate-300">
                      Profile: {user?.username}
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2.5 text-blue-600 dark:text-blue-400">
                      Login
                    </Link>
                    <Link href="/login/signup" className="block px-4 py-2.5 bg-blue-500/60 text-white rounded-lg text-center font-medium hover:bg-blue-600/80 transition-colors">
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

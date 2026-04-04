/**
 * User Settings Page
 * Comprehensive settings dashboard with profile, security, and preferences
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/app/lib/store';
import { authAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Settings, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form states
  const [formData, setFormData] = useState({
    phone: '',
    bio: '',
    country: '',
    avatarUrl: '',
  });
  
  // Email verification
  const [emailVerificationToken, setEmailVerificationToken] = useState('');
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailToken, setEmailToken] = useState('');
  
  // Password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Preferences
  const [preferences, setPreferences] = useState({
    notificationsEnabled: true,
    twoFactorEnabled: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchSettings();
  }, [isAuthenticated, router]);

  const fetchSettings = async () => {
    try {
      const response = await authAPI.getSettings();
      setSettings(response.data.settings);
      setFormData({
        phone: response.data.settings.phone || '',
        bio: response.data.settings.bio || '',
        country: response.data.settings.country || '',
        avatarUrl: response.data.settings.avatarUrl || '',
      });
      setPreferences({
        notificationsEnabled: response.data.settings.notificationsEnabled,
        twoFactorEnabled: response.data.settings.twoFactorEnabled,
      });
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch settings');
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handlePreferenceChange = (key) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const saveProfile = async () => {
    try {
      await authAPI.updateSettings(formData);
      await fetchSettings();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const requestEmailVerification = async () => {
    try {
      const response = await authAPI.requestEmailVerification();
      setEmailToken(response.data.token);
      setEmailVerificationToken('');
      toast.success('Verification token generated. Check your email or use the token below.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request verification');
    }
  };

  const verifyEmailHandler = async () => {
    if (!emailVerificationToken.trim()) {
      toast.error('Please enter the verification token');
      return;
    }
    
    setVerifyingEmail(true);
    try {
      await authAPI.verifyEmail(emailVerificationToken);
      await fetchSettings();
      toast.success('Email verified successfully');
      setEmailVerificationToken('');
      setEmailToken('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify email');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      await authAPI.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const savePreferences = async () => {
    try {
      await authAPI.updateSettings(preferences);
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update preferences');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your account, profile, and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-6 space-y-2 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('email')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeTab === 'email'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Mail size={20} />
                <span>Email</span>
                {!settings?.emailVerified && (
                  <span className="ml-auto px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs rounded">
                    Unverified
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeTab === 'security'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Lock size={20} />
                <span>Security</span>
              </button>
              
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeTab === 'preferences'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Bell size={20} />
                <span>Preferences</span>
              </button>

              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeTab === 'account'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Shield size={20} />
                <span>Account Info</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Profile Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleProfileChange}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleProfileChange}
                      placeholder="United States"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleProfileChange}
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                    <p className="text-xs text-slate-500 mt-1">{formData.bio.length}/500</p>
                  </div>

                  <button
                    onClick={saveProfile}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            )}

            {/* Email Tab */}
            {activeTab === 'email' && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Email Verification
                </h2>

                <div className="space-y-6">
                  <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <strong>Email:</strong> {settings?.email}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                      <strong>Status:</strong>{' '}
                      {settings?.emailVerified ? (
                        <span className="text-green-600 dark:text-green-400">✓ Verified</span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">✗ Not Verified</span>
                      )}
                    </p>
                  </div>

                  {!settings?.emailVerified && (
                    <>
                      {emailToken && (
                        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                            Your verification token (copy and paste below):
                          </p>
                          <code className="block bg-white dark:bg-slate-800 p-2 rounded border border-slate-300 dark:border-slate-600 text-xs break-all">
                            {emailToken}
                          </code>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Verification Token
                        </label>
                        <input
                          type="text"
                          value={emailVerificationToken}
                          onChange={(e) => setEmailVerificationToken(e.target.value)}
                          placeholder="Paste verification token here"
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={requestEmailVerification}
                          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          Request Verification Token
                        </button>
                        <button
                          onClick={verifyEmailHandler}
                          disabled={verifyingEmail || !emailVerificationToken.trim()}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          {verifyingEmail ? 'Verifying...' : 'Verify Email'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Security Settings
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password (minimum 6 characters)"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={changePassword}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Preferences
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Receive email updates about your account</p>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('notificationsEnabled')}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        preferences.notificationsEnabled ? 'bg-green-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          preferences.notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security</p>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('twoFactorEnabled')}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        preferences.twoFactorEnabled ? 'bg-green-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          preferences.twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    onClick={savePreferences}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Account Info Tab */}
            {activeTab === 'account' && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Account Information
                </h2>

                <div className="space-y-4">
                  <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Username</p>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">{settings?.username}</p>
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">{settings?.email}</p>
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Subscription</p>
                    <p className="text-lg font-medium text-slate-900 dark:text-white capitalize">
                      {settings?.subscription}
                      {settings?.isPremium && ' ✨'}
                    </p>
                  </div>

                  {settings?.premiumExpiry && (
                    <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Premium Expiry</p>
                      <p className="text-lg font-medium text-slate-900 dark:text-white">
                        {new Date(settings?.premiumExpiry).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Member Since</p>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      {new Date(settings?.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Last Login</p>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      {settings?.lastLogin
                        ? new Date(settings?.lastLogin).toLocaleString()
                        : 'Never'}
                    </p>
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Login Count</p>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">{settings?.loginCount}</p>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg mt-6">
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Downloads</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {settings?.totalDownloads}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Tokens</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {settings?.totalTokensGenerated}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

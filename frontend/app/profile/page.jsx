/**
 * Profile Page
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/app/lib/store';
import { authAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setProfile(response.data.user);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, router]);

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
        Your Profile
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Info */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Account Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Username</label>
              <p className="text-lg text-slate-900 dark:text-white mt-1">{profile?.username}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</label>
              <p className="text-lg text-slate-900 dark:text-white mt-1">{profile?.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Subscription</label>
              <p className="text-lg text-slate-900 dark:text-white mt-1 capitalize">
                {profile?.subscription}
                {profile?.isPremium && ' ✨'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Member Since</label>
              <p className="text-lg text-slate-900 dark:text-white mt-1">
                {new Date(profile?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Your Statistics
          </h2>

          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Tokens Generated</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                {profile?.totalTokensGenerated}
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Downloads</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                {profile?.totalDownloads}
              </p>
            </div>

            {profile?.isPremium && (
              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">Premium Expires</p>
                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-300">
                  {new Date(profile?.premiumExpiry).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

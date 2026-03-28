/**
 * Home Page
 * Landing page with welcome and setup instructions
 */

'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, Download } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Install All Your Dev Tools
            <span className="text-blue-600"> in One Click</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Select your favorite applications, generate a secure token, and let our Windows client handle the rest. No more manual installations.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              href="/apps"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 font-semibold"
            >
              Browse Apps
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
            <Zap className="text-blue-600 mb-4" size={32} />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Lightning Fast
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Parallel downloads and silent installations. Install everything in minutes, not hours.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
            <Shield className="text-green-600 mb-4" size={32} />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Secure & Safe
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Encrypted tokens, one-time use configs, automatic expiry. Your setup is protected.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
            <Download className="text-purple-600 mb-4" size={32} />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Easy to Use
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Simple UI, multiple app support, history tracking. Setup management made easy.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 bg-white dark:bg-slate-800 p-12 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Select Apps', desc: 'Choose from 20+ applications' },
              { num: 2, title: 'Generate Token', desc: 'Create secure setup config' },
              { num: 3, title: 'Download Client', desc: 'Get Windows installer' },
              { num: 4, title: 'Install', desc: 'Paste token and done!' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Ready to automate your setup? Start now.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
          >
            Create Your First Setup
          </Link>
        </div>
      </section>
    </div>
  );
}

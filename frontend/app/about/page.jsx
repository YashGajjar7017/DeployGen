'use client';

import { Users, Target, Zap, Award, CheckCircle, TrendingUp } from 'lucide-react';
import Header from '@/app/components/Header';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-slideInDown">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
              About <span className="text-purple-600">DeployGEN</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Simplifying development setup for developers worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slideInLeft">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
              We believe setting up development environments shouldn't be complicated. Just because you're a developer doesn't mean you need to spend hours configuring tools and installing applications.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
              DeployGEN transforms the way developers install and manage their tools. With a single click, set up your entire development environment exactly the way you need it.
            </p>
            <div className="flex gap-4">
              <Zap className="text-purple-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Fast & Efficient</h3>
                <p className="text-slate-600 dark:text-slate-300">Parallel downloads and installations</p>
              </div>
            </div>
          </div>
          <div className="animate-slideInRight">
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-2xl p-8 card-hover">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Why Choose Us?</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <span className="text-slate-700 dark:text-slate-200">One-click installation of all tools</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <span className="text-slate-700 dark:text-slate-200">Secure token-based authentication</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <span className="text-slate-700 dark:text-slate-200">Cross-platform support</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <span className="text-slate-700 dark:text-slate-200">Regular updates and maintenance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-slate-50 dark:bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Target, title: 'Simple', desc: 'Easy to use, hard to mess up' },
              { icon: Users, title: 'Community', desc: 'Built for developers, by developers' },
              { icon: Award, title: 'Quality', desc: 'High standards for every release' },
              { icon: TrendingUp, title: 'Innovation', desc: 'Always improving and evolving' }
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-700 rounded-xl p-8 text-center card-hover animate-slideInUp"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <value.icon className="text-blue-600 dark:text-blue-400 mx-auto mb-4" size={40} />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white text-center mb-12">By The Numbers</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { number: '5000+', label: 'Active Users' },
            { number: '10000+', label: 'Apps Installed' },
            { number: '99.9%', label: 'Uptime' },
            { number: '24/7', label: 'Support' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="text-center animate-fadeIn"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <p className="text-slate-600 dark:text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-slate-50 dark:bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'John Developer', role: 'Founder & CEO' },
              { name: 'Sarah Designer', role: 'Head of Design' },
              { name: 'Mike Engineer', role: 'Lead Backend Engineer' }
            ].map((member, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-700 rounded-xl p-8 text-center card-hover animate-slideInUp"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-slate-600 dark:text-slate-300">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Join Our Growing Community</h2>
          <p className="text-purple-100 mb-8 text-lg">Start automating your development setup today</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 font-semibold btn-interactive"
            >
              Get Started
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-purple-600 font-semibold btn-interactive transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

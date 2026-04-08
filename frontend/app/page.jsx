/**
 * Home Page - Glassmorphic Landing
 * Modern hero section with animation and CTA
 */

'use client';

import Link from 'next/link';
import { GlassCard, GlassButton, GlassPanel } from '@/app/components/GlassComponents';
import { Sparkles, Zap, Shield, Rocket, Code, BarChart3, ArrowRight } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Smart caching and optimized requests for instant responses',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Token-based authentication and encrypted data storage',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: Rocket,
      title: 'Easy Deploy',
      description: 'One-click installation with automatic configuration',
      color: 'from-blue-400 to-cyan-500',
    },
  ];

  const steps = [
    { num: 1, title: 'Select Apps', desc: 'Choose from 50+ applications' },
    { num: 2, title: 'Generate Token', desc: 'Create secure setup config' },
    { num: 3, title: 'Download Client', desc: 'Get Windows installer' },
    { num: 4, title: 'Install', desc: 'Paste token and done!' },
  ];

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative md:min-h-screen flex items-center pt-20 md:pt-0">
        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="gradient-text gradient-animated">Deploy Like Magic</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Select your apps, generate a token, and install everything instantly. No complexity, just simplicity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <GlassButton variant="primary" size="lg" className="w-full sm:w-auto">
                    <Sparkles size={20} />
                    Get Started
                  </GlassButton>
                </Link>
                <Link href="/apps">
                  <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto">
                    <ArrowRight size={20} />
                    Browse Apps
                  </GlassButton>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {[
                  { label: 'Apps', value: '50+' },
                  { label: 'Users', value: '1K+' },
                  { label: 'Deploys', value: '5K+' },
                ].map((stat) => (
                  <GlassCard key={stat.label} className="p-4 text-center">
                    <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Right Visual - Animated Glass Card */}
            <div className="relative h-96 md:h-full hidden md:flex items-center justify-center">
              <GlassCard className="p-8 w-full max-w-sm glow-ring animate-pulse-glow">
                <div className="space-y-4">
                  {/* Skeleton animation */}
                  <div className="h-3 bg-white/20 rounded-full w-3/4" />
                  <div className="h-3 bg-white/20 rounded-full w-1/2" />
                  <div className="space-y-2 pt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-2 bg-white/10 rounded-full" />
                    ))}
                  </div>
                  <div className="pt-4 flex gap-2">
                    <div className="flex-1 h-8 bg-gradient-primary rounded-lg opacity-70" />
                    <div className="flex-1 h-8 bg-white/20 rounded-lg" />
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Why Choose <span className="gradient-text">DeployGen?</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experience lightning-fast deployments with our modern glassmorphic interface
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard
                  key={feature.title}
                  hover
                  className="p-6 space-y-4 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white group-hover:shadow-glow transition-all duration-300`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{feature.description}</p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassPanel title="How It Works" subtitle="Four simple steps to deploy">
            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  {/* Connection line */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500/30 to-transparent" />
                  )}
                  
                  <GlassCard className="p-6 text-center relative z-10">
                    <div className="w-12 h-12 bg-gradient-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4 shadow-glow">
                      {step.num}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {step.desc}
                    </p>
                  </GlassCard>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-8 md:p-16 text-center space-y-8 glow-ring">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Deploy?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Join thousands of users who've simplified their deployment workflow
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <GlassButton variant="primary" size="lg" className="px-8">
                  <Rocket size={20} />
                  Start Now
                </GlassButton>
              </Link>
              <Link href="/contact">
                <GlassButton variant="secondary" size="lg" className="px-8">
                  Contact Us
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}

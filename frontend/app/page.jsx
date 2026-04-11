/**
 * Home Page - Glassmorphic Landing
 * Modern hero section with cursor-tracking animation and CTA
 */

'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { GlassCard, GlassButton, GlassPanel } from '@/app/components/GlassComponents';
import { Sparkles, Zap, Shield, Rocket, Code, BarChart3, ArrowRight, Wand2 } from 'lucide-react';

export default function Home() {
  const containerRef = useRef(null);
  const circlesRef = useRef([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Cursor tracking circles effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Update circle positions based on cursor
      circlesRef.current.forEach((circle, index) => {
        if (circle) {
          const delay = index * 0.05;
          setTimeout(() => {
            circle.style.left = `${e.clientX}px`;
            circle.style.top = `${e.clientY}px`;
          }, delay * 100);
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <main className="min-h-screen overflow-hidden" ref={containerRef}>
      {/* Cursor-Tracking Circles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (circlesRef.current[i] = el)}
          className={`cursor-circle fixed pointer-events-none rounded-full mix-blend-screen`}
          style={{
            width: `${80 - i * 15}px`,
            height: `${80 - i * 15}px`,
            background: `rgba(${59 + i * 20}, 130 - i * 20, 246, ${0.2 - i * 0.03})`,
            filter: `blur(${15 + i * 10}px)`,
            zIndex: -1,
            transition: 'all 0.3s ease-out',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Hero Section */}
      <section className="relative md:min-h-screen flex items-center pt-20 md:pt-0">
        {/* Enhanced animated background elements */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-float animate-pulse-slow" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-4 flex flex-col">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/20 border border-blue-400/40 w-fit mb-4 animate-slideInLeft">
                  <Wand2 size={16} className="text-blue-400" />
                  <span className="text-sm text-blue-400 font-semibold">Next-Gen Deployment</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black leading-tight">
                  <span className="gradient-text gradient-animated">Deploy Like Magic</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Select your apps, generate a secure token, and install everything with one click. Zero complexity, maximum efficiency.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-slideInUp">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <GlassButton variant="primary" size="lg" className="w-full justify-center">
                    <Sparkles size={20} />
                    Get Started Now
                  </GlassButton>
                </Link>
                <Link href="/apps" className="w-full sm:w-auto">
                  <GlassButton variant="secondary" size="lg" className="w-full justify-center">
                    <ArrowRight size={20} />
                    Explore Apps
                  </GlassButton>
                </Link>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-4 pt-12 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                {[
                  { label: 'Apps', value: '50+', icon: '📦' },
                  { label: 'Users', value: '1K+', icon: '👥' },
                  { label: 'Deploys', value: '5K+', icon: '🚀' },
                ].map((stat) => (
                  <GlassCard key={stat.label} className="p-4 text-center group hover:scale-105">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.label}</div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Right Visual - Enhanced Animated Glass Card */}
            <div className="relative h-96 md:h-full hidden md:flex items-center justify-center animate-slideInRight">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/10 rounded-3xl blur-2xl scale-95 animate-pulse-slow" />
              <GlassCard className="p-8 w-full max-w-sm glow-ring animate-float relative">
                <div className="space-y-5">
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex-1 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="h-3 bg-white/20 rounded-full w-4/5" />
                    <div className="h-3 bg-white/15 rounded-full w-3/5" />
                  </div>
                  <div className="space-y-2 pt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-2 bg-white/10 rounded-full" style={{ width: `${80 - i * 15}%` }} />
                    ))}
                  </div>
                  <div className="pt-4 flex gap-2">
                    <div className="flex-1 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-70 group-hover:opacity-100 transition-opacity" />
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
          <div className="text-center mb-16 space-y-4 animate-slideInDown">
            <h2 className="text-4xl md:text-5xl font-black">
              Why Choose <span className="gradient-text">DeployGen?</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experience lightning-fast deployments with our beautiful glassmorphic interface and premium features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard
                  key={feature.title}
                  hover
                  className="p-8 space-y-4 group animate-slideInUp glow-on-hover"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white group-hover:shadow-glow transition-all duration-300 transform group-hover:scale-110`}>
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:gradient-text transition-all">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="inline-flex items-center gap-2 text-blue-500 text-sm font-semibold">
                      Learn more <ArrowRight size={16} />
                    </div>
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
          <GlassPanel title="How It Works?" subtitle="Four simple steps to deploy everything instantly">
            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={i} className="relative group animate-slideInUp" style={{ animationDelay: `${i * 0.15}s` }}>
                  {/* Connection line */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent group-hover:from-blue-500/80 transition-all duration-300" />
                  )}
                  
                  <GlassCard className="p-6 text-center relative z-10 group-hover:scale-105 transition-transform hover:glow-ring">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4 shadow-glow text-lg transform group-hover:scale-110 transition-transform">
                      {step.num}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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
      <section className="py-20 md:py-32 relative z-10 mb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-8 md:p-16 text-center space-y-8 glow-ring group hover:shadow-2xl transition-all animate-slideInUp">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black group-hover:gradient-text transition-all">
                Ready to Deploy?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Join thousands of users who've simplified their deployment workflow with DeployGen
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <GlassButton variant="primary" size="lg" className="px-8 w-full">
                  <Rocket size={20} />
                  Start Deploying
                </GlassButton>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <GlassButton variant="secondary" size="lg" className="px-8 w-full">
                  Get in Touch
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}

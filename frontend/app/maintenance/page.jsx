'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Zap } from 'lucide-react';
import { GlassCard } from '@/app/components/GlassComponents';

export default function MaintenancePage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [maintenanceData, setMaintenanceData] = useState(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await fetch('/api/admin/maintenance');
        if (response.ok) {
          const data = await response.json();
          setMaintenanceData(data);
        }
      } catch (error) {
        console.error('Failed to fetch maintenance data');
      }
    };

    fetchMaintenance();
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!maintenanceData?.endTime) return;

      const endTime = new Date(maintenanceData.endTime).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [maintenanceData]);

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center animate-slideInUp">
      <div className="w-24 h-24 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-2xl flex items-center justify-center mb-3 border border-orange-500/50 glow-ring">
        <span className="text-4xl font-black gradient-text">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-red-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="max-w-4xl w-full relative z-10">
        {/* Main card */}
        <GlassCard className="p-8 md:p-16 text-center space-y-8 glow-ring animate-slideInUp">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white animate-pulse-glow">
              <AlertTriangle size={40} />
            </div>
          </div>

          {/* Title and message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black">
              <span className="gradient-text">Scheduled Maintenance</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {maintenanceData?.message || 'We are currently performing scheduled maintenance to improve your experience.'}
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-8 flex items-center justify-center gap-2">
              <Clock size={16} />
              WE'LL BE BACK IN
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <TimeUnit value={timeLeft.days} label="Days" />
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <TimeUnit value={timeLeft.minutes} label="Minutes" />
              <TimeUnit value={timeLeft.seconds} label="Seconds" />
            </div>
          </div>

          {/* Additional info */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 space-y-2">
            <p className="font-semibold text-orange-600 dark:text-orange-400 flex items-center justify-center gap-2">
              <Zap size={18} />
              Expected Downtime
            </p>
            {maintenanceData?.endTime && (
              <p className="text-slate-600 dark:text-slate-300">
                From {new Date(maintenanceData.startTime).toLocaleString()} to{' '}
                {new Date(maintenanceData.endTime).toLocaleString()}
              </p>
            )}
          </div>

          {/* Footer message */}
          <p className="text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-white/10">
            Thank you for your patience. We're working hard to bring you an even better experience.
          </p>
        </GlassCard>

        {/* Background decorations */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          {[
            { icon: '🔧', title: 'Improving', desc: 'System optimization' },
            { icon: '🔒', title: 'Securing', desc: 'Enhanced safety' },
            { icon: '⚡', title: 'Upgrading', desc: 'Better performance' },
          ].map((item, i) => (
            <div key={i} className="animate-slideInUp" style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

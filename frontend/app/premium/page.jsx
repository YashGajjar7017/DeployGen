'use client';

import { useState } from 'react';
import { Zap, Crown, CheckCircle, Star, ArrowRight, Zap as ZapIcon, Lock, BarChart3, Clock } from 'lucide-react';
import Header from '@/app/components/Header';
import Link from 'next/link';

export default function PremiumPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'Perfect for beginners',
      features: [
        'Up to 5 projects',
        'Basic app selection',
        'Email support',
        'Community forum access',
        'Monthly updates'
      ],
      icon: Zap,
      highlighted: false
    },
    {
      name: 'Professional',
      price: { monthly: 29.99, yearly: 299.99 },
      description: 'For serious developers',
      features: [
        'Unlimited projects',
        'Advanced app selection',
        'Priority email support',
        'Custom configurations',
        'Team collaboration (up to 5)',
        'Advanced analytics',
        'Weekly updates',
        'API access'
      ],
      icon: Crown,
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: { monthly: 99.99, yearly: 999.99 },
      description: 'For large teams',
      features: [
        'Unlimited everything',
        'Dedicated account manager',
        '24/7 phone & email support',
        'Custom integrations',
        'Unlimited team members',
        'Advanced security features',
        'Real-time analytics',
        'Priority development queue',
        'Annual training sessions'
      ],
      icon: Star,
      highlighted: false
    }
  ];

  const services = [
    {
      title: 'Priority Support',
      description: 'Get faster response times and dedicated support from our expert team',
      icon: Clock
    },
    {
      title: 'Advanced Security',
      description: 'Enterprise-grade encryption and security features for your peace of mind',
      icon: Lock
    },
    {
      title: 'Analytics Dashboard',
      description: 'Detailed insights into your app installations and usage patterns',
      icon: BarChart3
    },
    {
      title: 'Custom Configurations',
      description: 'Create and manage custom app sets tailored to your specific needs',
      icon: ZapIcon
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200 dark:bg-cyan-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-slideInDown">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
              Unlock <span className="text-cyan-600">Premium Features</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              Upgrade to premium and get access to advanced features, priority support, and more
            </p>

            {/* Toggle Billing */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 relative ${
                  billingCycle === 'yearly'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Yearly
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
            const period = billingCycle === 'monthly' ? '/month' : '/year';
            
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-300 animate-slideInUp card-hover ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-2xl transform md:scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg'
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon size={32} className={plan.highlighted ? 'text-cyan-100' : 'text-cyan-600'} />
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>
                  <p className={`mb-6 text-sm ${plan.highlighted ? 'text-cyan-100' : 'text-slate-600 dark:text-slate-400'}`}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-5xl font-bold mb-2">
                      ${price}
                    </div>
                    <p className={plan.highlighted ? 'text-cyan-100' : 'text-slate-600 dark:text-slate-400'}>
                      {period}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 rounded-lg font-semibold mb-8 btn-interactive transition-all duration-300 flex items-center justify-center gap-2 ${
                      plan.highlighted
                        ? 'bg-white text-cyan-600 hover:bg-cyan-50'
                        : 'bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700'
                    }`}
                  >
                    Get Started <ArrowRight size={20} />
                  </button>

                  {/* Features List */}
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex gap-3">
                        <CheckCircle
                          size={20}
                          className={plan.highlighted ? 'text-cyan-100 flex-shrink-0' : 'text-green-600 flex-shrink-0'}
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-slate-50 dark:bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white text-center mb-12">
            Premium Services & Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-700 rounded-xl p-8 card-hover animate-fadeIn"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="bg-cyan-100 dark:bg-cyan-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-cyan-600 dark:text-cyan-400" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white text-center mb-12">
          Feature Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left py-4 px-4 font-bold text-slate-900 dark:text-white">Feature</th>
                <th className="text-center py-4 px-4 font-bold text-slate-900 dark:text-white">Starter</th>
                <th className="text-center py-4 px-4 font-bold text-cyan-600">Professional</th>
                <th className="text-center py-4 px-4 font-bold text-slate-900 dark:text-white">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Projects', starter: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
                { name: 'Support', starter: 'Email', pro: 'Priority Email', enterprise: '24/7 Phone & Email' },
                { name: 'API Access', starter: false, pro: true, enterprise: true },
                { name: 'Team Members', starter: '1', pro: 'Up to 5', enterprise: 'Unlimited' },
                { name: 'Analytics', starter: 'Basic', pro: 'Advanced', enterprise: 'Real-time' },
                { name: 'Custom Integrations', starter: false, pro: false, enterprise: true }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                  <td className="py-4 px-4 text-center">
                    {typeof row.starter === 'boolean' ? (
                      row.starter ? <CheckCircle className="text-green-600 mx-auto" size={20} /> : <span className="text-slate-400">-</span>
                    ) : (
                      row.starter
                    )}
                  </td>
                  <td className="py-4 px-4 text-center bg-cyan-50 dark:bg-cyan-900 bg-opacity-30">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? <CheckCircle className="text-green-600 mx-auto" size={20} /> : <span className="text-slate-400">-</span>
                    ) : (
                      row.pro
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof row.enterprise === 'boolean' ? (
                      row.enterprise ? <CheckCircle className="text-green-600 mx-auto" size={20} /> : <span className="text-slate-400">-</span>
                    ) : (
                      row.enterprise
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 dark:bg-slate-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel your subscription at any time with no penalties or hidden fees. Your access will remain active until the end of your billing period.'
              },
              {
                q: 'Do you offer a free trial?',
                a: 'Yes! All new users get a 14-day free trial of our Professional plan. No credit card required to start.'
              },
              {
                q: 'Can I change my plan later?',
                a: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing date.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-700 rounded-lg p-6 animate-slideInUp"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to go premium?</h2>
          <p className="text-cyan-100 mb-8 text-lg">Start your 14-day free trial today</p>
          <button className="px-8 py-3 bg-white text-cyan-600 rounded-lg hover:bg-cyan-50 font-semibold btn-interactive flex items-center gap-2 mx-auto">
            Start Free Trial <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Mail, Phone, Loader, MapPin, Clock, CheckCircle } from 'lucide-react';
import Header from '@/app/components/Header';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate sending message (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 dark:bg-cyan-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-slideInDown">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
              Get in <span className="text-blue-600">Touch</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Contact us today!
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fadeIn">
          {/* Email */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 card-hover">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Mail className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">Send us an email and we'll respond as soon as possible.</p>
            <a href="mailto:support@appmanager.com" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              support@appmanager.com
            </a>
          </div>

          {/* Phone */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 card-hover" style={{ animation: 'slideInUp 0.5s ease-out 0.1s both' }}>
            <div className="bg-cyan-100 dark:bg-cyan-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Phone className="text-cyan-600 dark:text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Phone</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">Call us during business hours for immediate assistance.</p>
            <a href="tel:+1-800-123-4567" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
              +1 (800) 123-4567
            </a>
          </div>

          {/* Address */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 card-hover" style={{ animation: 'slideInUp 0.5s ease-out 0.2s both' }}>
            <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Office</h3>
            <p className="text-slate-600 dark:text-slate-300">
              123 Tech Street<br />
              San Francisco, CA 94102<br />
              United States
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="animate-slideInLeft">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Send us a Message</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-lg flex items-center gap-2 animate-slideInDown">
                <CheckCircle size={20} />
                <span>Message sent successfully! We'll get back to you soon.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 resize-none"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-400 disabled:to-slate-400 font-semibold btn-interactive flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="animate-slideInRight">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Why Contact Us?</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Clock size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Fast Response</h3>
                  <p className="text-slate-600 dark:text-slate-300">We aim to respond to all inquiries within 24 hours.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-600 text-white">
                    <Mail size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Support & Feedback</h3>
                  <p className="text-slate-600 dark:text-slate-300">Share your thoughts, report issues, or request new features.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                    <Phone size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Direct Support</h3>
                  <p className="text-slate-600 dark:text-slate-300">Get help with technical issues or general questions.</p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12 p-6 bg-blue-50 dark:bg-slate-800 rounded-xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li>• <strong>How do I reset my password?</strong> Visit the login page and click "Forgot password?"</li>
                <li>• <strong>Is my data secure?</strong> Yes, we use industry-standard encryption.</li>
                <li>• <strong>Can I use the service offline?</strong> Yes, with our offline desktop app.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to streamline your setup?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of developers using AppManager</p>
        </div>
      </section>
    </div>
  );
}

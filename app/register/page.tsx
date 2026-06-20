'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0C447C] flex-col items-center justify-center p-12">
        <div className="flex items-center gap-3 mb-6">
          <svg width="48" height="48" viewBox="0 0 52 52">
            <path d="M26 46 C26 46 6 34 6 20 C6 13 11 8 18 8 C21.5 8 24.5 9.5 26 12 C27.5 9.5 30.5 8 34 8 C41 8 46 13 46 20 C46 34 26 46 26 46Z" fill="#fff"/>
            <path d="M12 26 Q15 19 19 22 L22 29 L24 21 L27 26 L40 26" stroke="#0C447C" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="text-3xl font-medium text-[#E6F1FB]">
            Family<span className="text-[#5DCAA5]">Health</span>+
          </div>
        </div>
        <p className="text-[#85B7EB] text-center mb-10 max-w-sm">
          Join thousands of families managing health together
        </p>
        <div className="space-y-3 w-full max-w-xs">
          {[
            'Free forever — no credit card',
            'Unlimited family members',
            'Secure & private data',
            'Works on web & mobile'
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3 text-[#E6F1FB]">
              <span className="text-[#5DCAA5]">✓</span>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 text-sm mb-8">Start tracking your family's health today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Full name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0C447C]"
                placeholder="Divye Kumar"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Email address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0C447C]"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Phone number</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0C447C]"
                placeholder="9876543210"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0C447C]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0C447C] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#0a3a69] transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#185FA5] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
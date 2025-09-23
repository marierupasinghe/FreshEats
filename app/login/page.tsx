"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-red-600">
              FreshEats
            </Link>
            
            <nav className="hidden md:flex space-x-6 lg:space-x-8">
              <Link href="/" className="text-gray-600 hover:text-red-600 text-sm lg:text-base">Home</Link>
              <Link href="/categories" className="text-gray-600 hover:text-red-600 text-sm lg:text-base">Categories</Link>
              <Link href="/foods" className="text-gray-600 hover:text-red-600 text-sm lg:text-base">Foods</Link>
              <Link href="/order" className="text-gray-600 hover:text-red-600 text-sm lg:text-base">Order</Link>
              <Link href="/contact" className="text-gray-600 hover:text-red-600 text-sm lg:text-base">Contact</Link>
              <Link href="/login" className="text-red-600 font-medium text-sm lg:text-base">Login</Link>
            </nav>

            <div className="w-5 h-5 sm:w-6 sm:h-6"> {/* Cart placeholder */}
              <div className="relative">
                <div className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400">🛒</div>
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-[8px] sm:text-[10px]">
                  0
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Sign Up' : 'Login'}
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h3>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium text-sm sm:text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>

              {!isSignUp && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-xs sm:text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  
                  <Link href="#" className="text-xs sm:text-sm text-red-600 hover:text-red-700">
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 py-2 sm:py-3 text-sm sm:text-base"
              >
                {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>

            <div className="mt-4 sm:mt-6 text-center text-xs text-gray-500">
              By logging in, you agree to our{' '}
              <Link href="#" className="text-red-600">Terms of Service</Link>
              {' '}and{' '}
              <Link href="#" className="text-red-600">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
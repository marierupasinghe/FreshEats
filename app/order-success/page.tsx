"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function OrderSuccessPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mx-auto mb-4 sm:mb-6" />
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Order Placed Successfully!
          </h1>
          
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4">
            Thank you for your order. Your delicious and nutritious meal is being prepared.
          </p>
          
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-gray-600">Order Reference Number:</p>
              <p className="text-base sm:text-lg font-mono font-bold text-gray-900">
                {orderId.slice(-8).toUpperCase()}
              </p>
            </div>
          )}
          
          <div className="text-left bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">What happens next?</h3>
            <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Our kitchen team will prepare your meal with care</li>
              <li>• We'll notify you when your order is out for delivery</li>
              <li>• Estimated delivery time: 30-45 minutes</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              onClick={() => router.push('/foods')}
              variant="outline"
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            >
              Order More Food
            </Button>
            <Button
              onClick={() => router.push('/')}
              className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
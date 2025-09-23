"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function OrderPage() {
  const { user, loading } = useAuth();
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    deliveryAddress: '',
    specialInstructions: ''
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleInputChange = (field: string, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (!customerDetails.fullName || !customerDetails.phoneNumber || !customerDetails.emailAddress || !customerDetails.deliveryAddress) {
      alert('Please fill in all required fields');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderData = {
        customerDetails,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        tax,
        total,
        status: 'pending',
        createdAt: new Date(),
        userId: user?.uid
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      clearCart();
      router.push(`/order-success?orderId=${docRef.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 px-4">
            Fill this form to confirm your order.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Order Summary</h2>
            
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-6 sm:py-8">Your cart is empty</p>
            ) : (
              <>
                {items.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-2 sm:space-x-4 py-3 sm:py-4 border-b">
                    <div className="text-sm sm:text-lg font-medium text-gray-600 w-6 sm:w-8">
                      {index + 1}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">${item.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        variant="outline"
                        size="sm"
                        className="w-6 h-6 sm:w-8 sm:h-8 p-0"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity}</span>
                      <Button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        variant="outline"
                        size="sm"
                        className="w-6 h-6 sm:w-8 sm:h-8 p-0"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        onClick={() => removeFromCart(item.id)}
                        variant="outline"
                        size="sm"
                        className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                    
                    <div className="text-sm sm:text-lg font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}

                <div className="mt-4 sm:mt-6 space-y-2">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg sm:text-xl font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Delivery Details</h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-sm sm:text-base">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your name"
                  value={customerDetails.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-sm sm:text-base">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  value={customerDetails.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="emailAddress" className="text-sm sm:text-base">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  placeholder="Enter your email"
                  value={customerDetails.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="deliveryAddress" className="text-sm sm:text-base">Delivery Address</Label>
                <Textarea
                  id="deliveryAddress"
                  placeholder="Enter your complete address"
                  value={customerDetails.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  className="mt-1 text-sm sm:text-base"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="specialInstructions" className="text-sm sm:text-base">Special Instructions (Optional)</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special delivery instructions..."
                  value={customerDetails.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  className="mt-1 text-sm sm:text-base"
                  rows={3}
                />
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || items.length === 0}
                className="w-full bg-red-600 hover:bg-red-700 py-2 sm:py-3 text-sm sm:text-lg mt-4 sm:mt-6"
              >
                {isPlacingOrder ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
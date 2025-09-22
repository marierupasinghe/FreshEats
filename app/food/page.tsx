"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { initializeDatabase } from '@/lib/seed-data';
import { FoodItem } from '@/lib/seed-data';

export default function FoodsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [foods, setFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadFoods();
    }
  }, [user, loading, router]);

  const loadFoods = async () => {
    try {
      await initializeDatabase();
      const q = query(collection(db, 'foodItems'));
      const querySnapshot = await getDocs(q);
      const foodsData: FoodItem[] = [];
      
      querySnapshot.forEach((doc) => {
        foodsData.push({ id: doc.id, ...doc.data() } as FoodItem);
      });
      
      setFoods(foodsData);
    } catch (error) {
      console.error('Error loading foods:', error);
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
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Food Menu
          </h1>
          <div className="w-12 sm:w-16 h-1 bg-red-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-base sm:text-lg px-4">
            Discover our nutritious meal options
          </p>
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {foods.map((food) => (
            <div key={food.id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold">{food.name}</h3>
              <p className="text-gray-600">${food.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
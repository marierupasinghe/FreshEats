"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query } from 'firebase/firestore';
import { Zap, Activity, Heart, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { initializeDatabase } from '@/lib/seed-data';
import { Category } from '@/lib/seed-data';

const iconMap = {
  zap: Zap,
  activity: Activity,
  heart: Heart,
  target: Target
};

export default function CategoriesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadCategories();
    }
  }, [user, loading, router]);

  const loadCategories = async () => {
    try {
      await initializeDatabase();
      const q = query(collection(db, 'categories'));
      const querySnapshot = await getDocs(q);
      const categoriesData: Category[] = [];
      
      querySnapshot.forEach((doc) => {
        categoriesData.push({ id: doc.id, ...doc.data() } as Category);
      });
      
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
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
            Food Categories
          </h1>
          <div className="w-12 sm:w-16 h-1 bg-red-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-base sm:text-lg px-4">
            Choose from our nutritious food categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Zap;
            
            return (
              <div
                key={category.id}
                onClick={() => router.push(`/foods?category=${encodeURIComponent(category.name)}`)}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-red-100 transition-colors">
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-600" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                  {category.description}
                </p>
                
                <div className="text-red-600 font-medium text-sm sm:text-base">
                  {category.itemCount} items
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { initializeDatabase } from '@/lib/seed-data';
import { FoodItem } from '@/lib/seed-data';
import FoodCard from '@/components/FoodCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FoodsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'All Categories');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadFoods();
    }
  }, [user, loading, router]);

  useEffect(() => {
    filterFoods();
  }, [foods, searchTerm, selectedCategory, sortBy]);

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

  const filterFoods = () => {
    let filtered = foods;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All Categories') {
      filtered = filtered.filter(food => food.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'calories':
          return a.calories - b.calories;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredFoods(filtered);
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Pre-Workout">Pre-Workout</SelectItem>
                <SelectItem value="Post-Workout">Post-Workout</SelectItem>
                <SelectItem value="Heart Healthy">Heart Healthy</SelectItem>
                <SelectItem value="Weight Management">Weight Management</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
                <SelectItem value="calories">Sort by Calories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} item={food} />
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-base sm:text-lg">No food items found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
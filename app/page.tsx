"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, orderBy, limit as fsLimit } from 'firebase/firestore';
import { Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { initializeDatabase } from '@/lib/seed-data';
import { FoodItem } from '@/lib/seed-data';
import { Button } from '@/components/ui/button';
import FoodCard from '@/components/FoodCard';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [featuredItems, setFeaturedItems] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentOrders, setRecentOrders] = useState<Array<{
    id: string;
    total: number;
    status: string;
    createdAt: Date;
  }>>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadFeaturedItems();
      loadRecentOrders();
    }
  }, [user, loading, router]);

  const loadFeaturedItems = async () => {
    try {
      await initializeDatabase();
      const q = query(collection(db, 'foodItems'));
      const querySnapshot = await getDocs(q);
      const items: FoodItem[] = [];
      
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as FoodItem);
      });
      
      // Show first 3 items as featured
      setFeaturedItems(items.slice(0, 3));
    } catch (error) {
      console.error('Error loading featured items:', error);
    }
  };

  const loadRecentOrders = async () => {
    try {
      if (!user?.uid) return;

      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(ordersQuery);
      const orders: Array<{ id: string; total: number; status: string; createdAt: Date }> = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as any;
        const createdAt: Date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        orders.push({
          id: doc.id,
          total: Number(data.total) || 0,
          status: String(data.status || 'pending'),
          createdAt
        });
      });
      // Sort by createdAt descending and take first 5
      const sortedOrders = orders
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);
      setRecentOrders(sortedOrders);
    } catch (error) {
      console.error('Error loading recent orders:', error);
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-blue-50 py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200")'
          }}
        ></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6">
            Fuel Your Fitness Journey
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-black mb-6 sm:mb-8 opacity-90 px-2">
            Nutritious meals crafted for athletes and fitness enthusiasts
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2 sm:gap-0">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for nutritious food"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 sm:h-12 pr-4 pl-4 text-base sm:text-lg border-0 shadow-lg w-full"
              />
            </div>
            <Button className="h-10 sm:h-12 px-4 sm:px-6 bg-red-600 hover:bg-red-700 shadow-lg sm:ml-2">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Foods Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Explore Nutritious Foods
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {featuredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button 
              onClick={() => router.push('/foods')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
            >
              View All Foods
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Recent Orders</h2>
            <p className="text-gray-600 text-sm sm:text-base mt-1">Your latest activity</p>
          </div>

          {recentOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
              You don’t have any recent orders yet.
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 sm:p-5">
                    <div>
                      <div className="text-sm text-gray-500">Order</div>
                      <div className="font-medium text-gray-900">#{order.id.slice(-8).toUpperCase()}</div>
                    </div>
                    <div className="hidden sm:block text-sm text-gray-500">
                      {order.createdAt.toLocaleDateString()} {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-900 font-semibold">${order.total.toFixed(2)}</span>
                      <span className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
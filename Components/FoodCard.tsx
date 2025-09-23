"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FoodItem } from '@/lib/seed-data';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';

interface FoodCardProps {
  item: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(item);
    
    // Show success animation
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setIsAdding(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-40 sm:h-48">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {item.name}
        </h3>
        
        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          <span>{item.calories} cal</span>
          <span>{item.protein} protein</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            LKR{item.price}
          </span>
          
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded}
            className={`transition-all duration-300 transform ${
              isAdded 
                ? 'bg-green-600 hover:bg-green-700 scale-110' 
                : isAdding 
                ? 'bg-yellow-600 hover:bg-yellow-700 scale-105' 
                : 'bg-red-600 hover:bg-red-700 hover:scale-105'
            } text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm`}
            size="sm"
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Added!</span>
              </>
            ) : isAdding ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="hidden sm:inline">Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
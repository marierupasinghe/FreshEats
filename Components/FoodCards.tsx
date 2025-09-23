"use client";

import React from 'react';
import Image from 'next/image';
import { FoodItem } from '@/lib/seed-data';

interface FoodCardProps {
  item: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
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
            ${item.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
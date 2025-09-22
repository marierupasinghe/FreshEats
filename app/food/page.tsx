"use client";

import React from 'react';

export default function FoodsPage() {
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
      </div>
    </div>
  );
}
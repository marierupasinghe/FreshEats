"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActive = (path: string) => pathname === path;

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="text-xl sm:text-2xl font-bold text-red-600">
              FreshEats
            </Link>

            {/* Mobile actions (cart + hamburger) */}
            {user && (
              <div className="flex items-center space-x-2 md:hidden">
                <Link href="/order" className="relative p-2">
                  <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-red-600" />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                      {getItemCount()}
                    </span>
                  )}
                </Link>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-3/4 sm:max-w-sm">
                    <nav className="mt-8 space-y-4">
                      <SheetClose asChild>
                        <Link 
                          href="/" 
                          className={`block px-2 py-2 rounded text-gray-700 hover:text-red-600 ${isActive('/') ? 'text-red-600 font-medium' : ''}`}
                        >
                          Home
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link 
                          href="/categories" 
                          className={`block px-2 py-2 rounded text-gray-700 hover:text-red-600 ${isActive('/categories') ? 'text-red-600 font-medium' : ''}`}
                        >
                          Categories
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link 
                          href="/foods" 
                          className={`block px-2 py-2 rounded text-gray-700 hover:text-red-600 ${isActive('/foods') ? 'text-red-600 font-medium' : ''}`}
                        >
                          Foods
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link 
                          href="/order" 
                          className={`block px-2 py-2 rounded text-gray-700 hover:text-red-600 ${isActive('/order') ? 'text-red-600 font-medium' : ''}`}
                        >
                          Order
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link 
                          href="/contact" 
                          className={`block px-2 py-2 rounded text-gray-700 hover:text-red-600 ${isActive('/contact') ? 'text-red-600 font-medium' : ''}`}
                        >
                          Contact
                        </Link>
                      </SheetClose>
                      <div className="pt-4 border-t mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 truncate">{user?.email}</span>
                          <SheetClose asChild>
                            <Button onClick={handleLogout} variant="outline" size="sm">
                              <LogOut className="w-4 h-4 mr-1" />
                              Logout
                            </Button>
                          </SheetClose>
                        </div>
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            )}

            {/* Navigation */}
            {user && (
              <nav className="hidden md:flex space-x-6 lg:space-x-8">
                <Link 
                  href="/" 
                  className={`text-gray-600 hover:text-red-600 transition-colors text-sm lg:text-base ${
                    isActive('/') ? 'text-red-600 font-medium' : ''
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/categories" 
                  className={`text-gray-600 hover:text-red-600 transition-colors text-sm lg:text-base ${
                    isActive('/categories') ? 'text-red-600 font-medium' : ''
                  }`}
                >
                  Categories
                </Link>
                <Link 
                  href="/foods" 
                  className={`text-gray-600 hover:text-red-600 transition-colors text-sm lg:text-base ${
                    isActive('/foods') ? 'text-red-600 font-medium' : ''
                  }`}
                >
                  Foods
                </Link>
                <Link 
                  href="/order" 
                  className={`text-gray-600 hover:text-red-600 transition-colors text-sm lg:text-base ${
                    isActive('/order') ? 'text-red-600 font-medium' : ''
                  }`}
                >
                  Order
                </Link>
                <Link 
                  href="/contact" 
                  className={`text-gray-600 hover:text-red-600 transition-colors text-sm lg:text-base ${
                    isActive('/contact') ? 'text-red-600 font-medium' : ''
                  }`}
                >
                  Contact
                </Link>
              </nav>
            )}

            {/* Right side (desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/order" className="relative p-2">
                    <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-red-600" />
                    {getItemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getItemCount()}
                      </span>
                    )}
                  </Link>
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    size="sm"
                    className="text-gray-600 hover:text-red-600 border-gray-300 hover:border-red-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
import { User, LogOut, LogIn, UserCircle } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  
  // Debug logging
  console.log('Header - Current user:', user);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    
    // ✅ Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('userUpdated'));
    
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

 return (
    <header className="bg-gradient-to-l from-[#FDFBFB] via-[#F1F9FF] to-[#E0F7FA] text-gray-800 shadow-md border-b border-gray-200">
      <div className="relative z-10 px-6 py-4 flex justify-between items-center backdrop-blur-sm">

        {/* Logo Section */}
        <Link href="/dashboard" className="group flex items-center space-x-3">
          <div className="relative">
            <img
              src="/logo/Jayaprada Foundation Logo (1).png"
              alt="Jayaprada Foundation Logo"
              className="h-19 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Navigation Section */}
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              {/* User Welcome */}
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-md rounded-full px-4 py-2 border border-gray-200 shadow-sm hover:bg-gray-100">
                <UserCircle size={20} className="text-[#0284C7]" />
                <span className="text-sm font-medium text-gray-800">
                  Welcome, {user.name || user.username || "User"}
                </span>
              </div>

              {/* Profile Link */}
              <Link
                href="/profile"
                className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-[#B2EBF2] hover:to-[#80DEEA] transition-all duration-300 rounded-full px-4 py-2 border border-gray-200 shadow-md"
              >
                <User size={18} className="text-[#0284C7]" />
                <span className="text-sm font-medium hidden sm:block text-gray-800">Profile</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 hover: bg-gradient-to-r hover:from-[#EF9A9A] hover:to-[#E57373] transition-all duration-300 rounded-full px-4 py-2 border border-gray-200 shadow-md"
              >
                <LogOut size={18} className="text-[#D32F2F]" />
                <span className="text-sm font-medium hidden sm:block text-gray-800">Logout</span>
              </button>
            </>
          ) : (
            /* Login Button */
            <button
              onClick={handleLogin}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#B2EBF2] to-[#80DEEA] hover:from-[#4DD0E1] hover:to-[#26C6DA] transition-all duration-300 rounded-full px-6 py-2 border border-gray-200 shadow-md"
            >
              <LogIn size={18} className="text-[#01579B]" />
              <span className="text-sm font-medium text-gray-900">Login</span>
            </button>
          )}
        </nav>
      </div>

      {/* Decorative subtle border */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#0284C7]/40 to-transparent"></div>
    </header>
  );
};

export default Header;
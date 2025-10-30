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
    <header className="bg-gradient-to-r from-[#0ea5e9] via-[#0284c7] to-[#0369a1] text-white shadow-md">

      {/* Animated background elements */}
      {/* <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full opacity-50"></div>
      </div> */}

      <div className="relative z-10 px-4 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/dashboard" className="group flex items-center space-x-3">
          <div className="relative">
            <img
              src="/logo/Jayaprada Foundation Logo (1).png"
              alt="Jayaprada Foundation Logo"
              className="h-16 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </div>
        </Link>

        {/* Navigation Section */}
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              {/* User Welcome with Avatar */}
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <UserCircle size={20} className="text-white" />
                <span className="text-sm font-medium">
                  Welcome, {user.name || user.username || 'User'}
                </span>
              </div>

              {/* Profile Link */}
              <Link
                href="/profile"
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 rounded-full px-4 py-2 border border-white/20 group"
              >
                <User size={18} className="text-white transition-transform group-hover:scale-110" />
                <span className="text-sm font-medium hidden sm:block">Profile</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-red-500/80 transition-all duration-300 rounded-full px-4 py-2 border border-white/20 group"
              >
                <LogOut size={18} className="text-white transition-transform group-hover:scale-110" />
                <span className="text-sm font-medium hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            /* Login Button */
            <button
              onClick={handleLogin}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 rounded-full px-6 py-2 border border-white/30 group shadow-lg"
            >
              <LogIn size={18} className="text-white transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium">Login</span>
            </button>
          )}
        </nav>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </header>
  );
};

export default Header;
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

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
    <header className="bg-[#00b4d8] text-white px-6 py-4 flex justify-between items-center">
      <img
        src="/logo/Jayaprada Foundation Logo (1).png"
        alt="Logo"
        className="h-19"
      />

      <nav className="flex items-center space-x-6">
        {user ? (
          <>
            <span className="text-sm">Welcome, {user.name || user.username || 'User'}</span>
            <a href="/profile" className="text-sm hover:underline">
              Profile
            </a>
            <button
              onClick={handleLogout}
              className="text-sm hover:underline bg-transparent border-none cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="text-sm hover:underline bg-transparent border-none cursor-pointer"
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;

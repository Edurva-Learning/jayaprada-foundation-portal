'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear stored user info
    localStorage.removeItem('user');
    // Navigate to login page
    router.push('/login');
  };

  return (
    <header className="bg-[#00b4d8] text-white px-6 py-4 flex justify-between items-center">
      <img
        src="/logo/Jayaprada Foundation Logo (1).png"
        alt="Jayaprada Foundation Logo"
        className="h-19"
      />
      <nav className="flex items-center space-x-6">
        <span className="text-sm">Welcome, Administrator</span>
        <a href="/profile" className="text-sm hover:underline">Profile</a>
      
        <button
          onClick={handleLogout}
          className="text-sm hover:underline bg-transparent border-none cursor-pointer"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;

'use client';
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { User as UserIcon, RefreshCw, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, loading, error, refreshUser } = useUser();
  
  // Enhanced debug logging
  console.log('Profile page - Full user context:', { user, loading, error });
  console.log('Profile page - User created_at:', user?.created_at);
  console.log('Profile page - User created_at type:', typeof user?.created_at);

  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
          <RefreshCw className="w-8 h-8 text-[#00b4d8] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
          <p className="text-red-600 mb-4">Error loading user: {error}</p>
          <button 
            onClick={refreshUser}
            className="bg-[#00b4d8] hover:bg-[#0096c7] text-white py-2 px-4 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
          <p className="text-gray-600">No user logged in.</p>
          <a href="/login" className="text-[#00b4d8] hover:underline mt-4 inline-block">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setFeedback('New passwords do not match');
      return;
    }

    setUpdateLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          password: newPassword,
        }),
      });

      if (!res.ok) throw new Error('Failed to update password');

      const updatedUser = await res.json();
      
      // Refresh user data to get the latest from API
      await refreshUser();
      
      // Show success alert
      setShowSuccessAlert(true);
      setFeedback('Password changed successfully!');
      
      // Reset form
      setChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Auto-hide success alert after 5 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
      
    } catch (err: any) {
      setFeedback(err.message || 'Something went wrong');
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    console.log('Formatting date input:', dateStr);
    
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined') {
      console.log('No valid date string provided');
      return 'Member Since: Not available';
    }
    
    // Try multiple date parsing strategies
    let date = new Date(dateStr);
    
    // If first attempt fails, try alternative methods
    if (isNaN(date.getTime())) {
      console.log('First parsing attempt failed, trying alternative methods');
      
      // Try parsing as ISO string
      const isoDate = new Date(dateStr.replace(' ', 'T') + 'Z');
      if (!isNaN(isoDate.getTime())) {
        date = isoDate;
      } else {
        // Try parsing as timestamp
        const timestamp = Date.parse(dateStr);
        if (!isNaN(timestamp)) {
          date = new Date(timestamp);
        }
      }
    }
    
    // Final check if date is valid
    if (isNaN(date.getTime())) {
      console.log('All parsing attempts failed, returning raw string');
      return `Member Since: ${dateStr}`;
    }
    
    const formatted = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    console.log('Successfully formatted date:', formatted);
    return `Member Since: ${formatted}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Success!</p>
                <p className="text-green-600 text-sm">Password updated successfully</p>
              </div>
              <button 
                onClick={() => setShowSuccessAlert(false)}
                className="text-green-400 hover:text-green-600 ml-auto"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <UserIcon className="w-16 h-16 text-[#00b4d8] mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{user.name || user.username || 'User'}</h2>
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Username:</span> {user.username || 'Not available'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Role:</span> {user.role || 'Not specified'}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(user.created_at || '')}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setChangingPassword(!changingPassword)}
            className="w-full bg-[#00b4d8] hover:bg-[#0096c7] text-white py-2 rounded-lg transition"
          >
            {changingPassword ? 'Cancel' : 'Change Password'}
          </button>

          {changingPassword && (
            <div className="mt-4 flex flex-col gap-3">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border rounded-lg p-2 w-full"
              />
              <button
                onClick={handlePasswordChange}
                disabled={updateLoading}
                className="bg-[#00b4d8] hover:bg-[#0096c7] text-white py-2 rounded-lg transition"
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </button>
              {feedback && (
                <p className={`text-center text-sm mt-2 ${
                  feedback.includes('Success') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {feedback}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
'use client';
import React from 'react';
import { Heart, GraduationCap, UserPlus, DollarSign, Calendar, ChevronRight, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, Admin</h1>
        <p className="text-gray-500">Here's what's happening with your foundation today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Active Health Camps</h3>
            <Heart className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
          <div className="text-xs text-green-600 font-medium">+1%</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Sponsorships</h3>
            <GraduationCap className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">156</div>
          <div className="text-xs text-green-600 font-medium">+1%</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">New Participants</h3>
            <UserPlus className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">28</div>
          <div className="text-xs text-green-600 font-medium">+15%</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Funding</h3>
            <DollarSign className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">₹38.5L</div>
          <div className="text-xs text-green-600 font-medium">+1%</div>
        </div>
      </div>

      {/* Main Content - Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-500" />
                Recent Activity
              </h2>
              <a href="#" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">View All</a>
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New health camp registered</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-4" />
              </li>
              <li className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Education sponsorship approved</p>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-4" />
              </li>
              <li className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">25 participants added</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-4" />
              </li>
              <li className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Women empowerment program started</p>
                  <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-4" />
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-cyan-500" />
                  <span className="text-sm font-medium text-gray-900">Add Health Camp</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-cyan-500" />
                  <span className="text-sm font-medium text-gray-900">New Sponsorship</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-cyan-500" />
                  <span className="text-sm font-medium text-gray-900">Add Participant</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-cyan-500" />
                  <span className="text-sm font-medium text-gray-900">Schedule Event</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* March Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Camps Card */}
        <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
          <div className="flex items-start gap-3 mb-4">
            <Heart className="w-8 h-8 text-cyan-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Health Camps</h3>
              <p className="text-sm text-gray-500">March Overview</p>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Camps</span>
              <span className="font-semibold text-gray-900">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Beneficiaries</span>
              <span className="font-semibold text-gray-900">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Services Provided</span>
              <span className="font-semibold text-gray-900">3,892</span>
            </div>
          </div>
          <button className="w-full bg-cyan-500 text-white py-3 rounded-xl font-medium hover:bg-cyan-600 transition-colors">
            View Details
          </button>
        </div>

        {/* Education Program Card */}
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-start gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-emerald-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Education Program</h3>
              <p className="text-sm text-gray-500">March Overview</p>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Sponsorships</span>
              <span className="font-semibold text-gray-900">142</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount Disbursed</span>
              <span className="font-semibold text-gray-900">₹22.5L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Students Helped</span>
              <span className="font-semibold text-gray-900">156</span>
            </div>
          </div>
          <button className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

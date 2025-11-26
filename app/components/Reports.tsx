import React, { useState } from 'react';

const ReportsPage = () => {
  const [filters, setFilters] = useState({
    filterType: '',
    camp: '',
    fromDate: '',
    toDate: ''
  });

  const handleFilterChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    // Handle filter application logic here
    console.log('Applied filters:', filters);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Health Camp Data Filters & Reports
        </h1>
        <p className="text-gray-600">
          Filter and export participant data based on various health parameters
        </p>
      </div>

      {/* Filter Card with Blue Background only for filter section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Blue Header Section */}
        <div className="bg-[#00b4d8] px-6 py-4">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">
              Filter Data
            </h2>
          </div>
        </div>

        {/* Filter Form with Light Blue Background */}
        <div className="bg-blue-50 px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Filter Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Type
              </label>
              <div className="relative">
                <select 
                  name="filterType"
                  value={filters.filterType}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Filter Type</option>
                  <option value="blood-pressure">Blood Pressure</option>
                  <option value="blood-sugar">Blood Sugar</option>
                  <option value="bmi">BMI</option>
                  <option value="cholesterol">Cholesterol</option>
                  <option value="all">All Parameters</option>
                </select>
                <div className="absolute right-3 top-3 text-gray-400">
                </div>
              </div>
            </div>

            {/* Camp Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Camp
              </label>
              <div className="relative">
                <select 
                  name="camp"
                  value={filters.camp}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Camps</option>
                  <option value="eye-checkup">Eye Checkup Camp</option>
                  <option value="general-checkup">General Checkup Camp</option>
                  <option value="dental">Dental Camp</option>
                  <option value="cancer-screening">Cancer Screening Camp</option>
                </select>
                <div className="absolute right-3 top-3 text-gray-400">
                </div>
              </div>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <div className="relative">
                <input 
                  type="date" 
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                </div>
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <div className="relative">
                <input 
                  type="date" 
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="flex items-end">
              <button 
                onClick={handleApplyFilters}
                className="w-full bg-[#00b4d8] hover:bg-[#0099c2] text-white font-medium py-2.5 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex items-center mb-6 border-b pb-2">
          <div className="bg-gray-100 p-2 rounded-lg mr-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2a1 1 0 001 1h12a1 1 0 001-1z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5a3 3 0 013 3v2a3 3 0 01-3 3H5a3 3 0 01-3-3V8a3 3 0 013-3h4z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            Generated Reports
          </h2>
        </div>
        
        {/* Reports content will go here */}
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Reports Generated</h3>
            <p className="text-gray-500">Apply filters above to generate health camp reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
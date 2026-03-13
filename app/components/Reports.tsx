"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Filter, Download, Calendar, Activity, Droplet, Heart } from "lucide-react";

// Sample static data for charts (remains unfiltered for demo)
const campTypeData = [
  { name: "General Camp", participants: 120 },
  { name: "Health Camp", participants: 80 },
  { name: "Lin-Health Camp", participants: 45 },
  { name: "Dental Camp", participants: 200 },
];

const metricsOverTime = [
  { month: "Jan", iron: 12.3, sugar: 110 },
  { month: "Feb", iron: 12.8, sugar: 115 },
  { month: "Mar", iron: 11.9, sugar: 108 },
  { month: "Apr", iron: 13.2, sugar: 120 },
  { month: "May", iron: 12.5, sugar: 112 },
];

const ReportsPage = () => {
  // Filter states – now single‑select dropdowns
  const [selectedCampType, setSelectedCampType] = useState<string>("");
  const [selectedCampCategory, setSelectedCampCategory] = useState<string>("");

  // KPI metrics (will be updated on filter)
  const [kpiData, setKpiData] = useState([
    { label: "Total Camps", value: 24, icon: Calendar, color: "bg-blue-500" },
    { label: "Total Participants", value: 1843, icon: Activity, color: "bg-green-500" },
    { label: "Avg Iron %", value: "12.4%", icon: Droplet, color: "bg-red-500" },
    { label: "Avg Sugar (mg/dL)", value: "112.5", icon: Heart, color: "bg-yellow-500" },
  ]);

  // Options for dropdowns
  const campTypeOptions = ["All", "General Camp", "Health Camp", "Lin-Health Camp", "Dental Camp"];
  const campCategoryOptions = ["All", "Health Checkup", "Oral Checkup", "Blood Test", "Eye CheckUp"];

  // Filter handler – simulates data filtering by updating KPI numbers
  const applyFilters = () => {
    // In a real app, you'd fetch filtered data from an API.
    // Here we just adjust the numbers based on selections.
    let totalCamps = 24;
    let totalParticipants = 1843;
    let avgIron = 12.4;
    let avgSugar = 112.5;

    if (selectedCampType !== "All" && selectedCampType) {
      // Simulate reduced numbers when a specific camp type is selected
      totalCamps = 8;
      totalParticipants = 620;
      avgIron = 11.8;
      avgSugar = 108.2;
    }

    if (selectedCampCategory !== "All" && selectedCampCategory) {
      // Further adjust if a category is also selected
      totalCamps = 5;
      totalParticipants = 410;
      avgIron = 12.1;
      avgSugar = 110.4;
    }

    // If both are "All", reset to original
    if ((selectedCampType === "All" || !selectedCampType) && (selectedCampCategory === "All" || !selectedCampCategory)) {
      totalCamps = 24;
      totalParticipants = 1843;
      avgIron = 12.4;
      avgSugar = 112.5;
    }

    setKpiData([
      { label: "Total Camps", value: totalCamps, icon: Calendar, color: "bg-blue-500" },
      { label: "Total Participants", value: totalParticipants, icon: Activity, color: "bg-green-500" },
      { label: "Avg Iron %", value: `${avgIron.toFixed(1)}%`, icon: Droplet, color: "bg-red-500" },
      { label: "Avg Sugar (mg/dL)", value: avgSugar.toFixed(1), icon: Heart, color: "bg-yellow-500" },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Reports Dashboard</h1>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-700">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Camp Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Camp Type</label>
              <select
                value={selectedCampType}
                onChange={(e) => setSelectedCampType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
              >
                {campTypeOptions.map((option) => (
                  <option key={option} value={option === "All" ? "" : option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Camp Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Camp Category</label>
              <select
                value={selectedCampCategory}
                onChange={(e) => setSelectedCampCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
              >
                {campCategoryOptions.map((option) => (
                  <option key={option} value={option === "All" ? "" : option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0099c3] transition"
            >
              Apply Filters
            </button>
          </div>
        </div>


        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Participants by Camp Type */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Participants by Camp Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="participants" fill="#00b4d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart - Average Metrics Over Time */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Average Metrics Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metricsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="iron" stroke="#8884d8" name="Iron %" />
                <Line yAxisId="right" type="monotone" dataKey="sugar" stroke="#82ca9d" name="Sugar (mg/dL)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
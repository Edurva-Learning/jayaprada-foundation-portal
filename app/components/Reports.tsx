'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LegendProps,
} from 'recharts';
import { MapPin, Filter } from 'lucide-react';

interface Participant {
  id: number;
  name: string;
  aadhar: string;
  age?: number | string;
  gender?: string;
  phone: string;
  address: string;
  state: string;
  assemblyconstituency: string;
  district: string;
  mandal: string;
  village: string;
  pincode: string;
  house_no?: string;
  registration_source: string;
  created_at: string;
  blood_checkup: boolean;
  medicine_required: string;
  medicine_name: string;
  treatment_required: string;
  bp?: string;
  spets?: string;
  operation?: string;
  completed_operation_date?: string;
  post_operation_date?: string;
  dental_examination?: string;
  camp_location?: string;
  cancer_screening?: string;
  hb?: number;
  rbs?: number;
  height?: number;
  weight?: number;
  vision_left?: string;
  vision_right?: string;
  eye_visual_acuity_left?: string;
  eye_visual_acuity_right?: string;
  eye_diagnosis?: string;
  eye_identified_issues?: string;
  eye_spectacles_recommended?: boolean;
  eye_surgery_recommended?: boolean;
  eye_follow_up_date?: string;
  eye_additional_notes?: string;
  eye_had_existing_spectacles?: boolean;
  eye_vision_correction_required?: boolean;
  eye_specify_vision_correction?: boolean;
  eye_spectacles_provided?: boolean;
  eye_spectacles_provided_date?: string;
  eye_surgery_type?: string;
  eye_surgery_prerequisites?: string;
  eye_surgery_scheduled_date?: string;
  eye_surgery_performed?: boolean;
  eye_spectacles_advised_post_surgery?: boolean;
  eye_post_surgery_follow_up?: string;
  dental_oral_hygiene_status?: string;
  dental_caries_present?: boolean;
  dental_gum_disease_present?: boolean;
  dental_tooth_extraction_recommended?: boolean;
  dental_filling_recommended?: boolean;
  dental_tooth_extraction_performed?: boolean;
  dental_filling_performed?: boolean;
  dental_root_canal_recommended?: boolean;
  dental_dentures_recommended?: boolean;
  dental_root_canal_performed?: boolean;
  dental_dentures_provided?: boolean;
  dental_follow_up_date?: string;
  dental_additional_notes?: string;
  dental_auditor?: string;
  general_height?: string;
  general_weight?: string;
  general_bmi?: string;
  general_bsa?: string;
  general_blood_pressure_systolic?: string;
  general_blood_pressure_diastolic?: string;
  general_presenting_complaints?: string;
  general_examination_remarks?: string;
  general_recommendations?: string;
  blood_haemoglobin?: string;
  blood_random_sugar?: string;
  blood_other_information?: string;
  blood_auditor?: string;
  cancer_oral?: boolean;
  cancer_breast?: boolean;
  cancer_cervical?: boolean;
  cancer_prostate?: boolean;
  cancer_other?: boolean;
  cancer_other_details?: string;
  cancer_findings?: string;
  cancer_recommendations?: string;
  cancer_follow_up_date?: string;
  general_medicine_required?: boolean;
  general_medicine_name?: string;
  blood_medicine_required?: boolean;
  blood_medicine_name?: string;
  eye_medicine_required?: boolean;
  eye_medicine_name?: string;
  dental_medicine_required?: boolean;
  dental_medicine_name?: string;
  cancer_medicine_required?: boolean;
  cancer_medicine_name?: string;
  additional_data?: Record<string, any>;
  medicine?: string;
  gynaecology_checkup?: boolean;
  orthopaedic_checkup?: boolean;
  ecg?: boolean;
  echo_2d?: boolean;
  xray_checkup?: boolean;
}

interface LocationWiseData {
  location: string;
  general: number;
  eye: number;
  gynaecology: number;
  cancer: number;
  dental: number;
  orthopaedic: number;
  ecg: number;
  echo_2d: number;
  xray: number;
  others: number;
  total: number;
}

// Category options for filtering
const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'general', label: 'General CheckUps' },
  { value: 'eye', label: 'Eye CheckUps' },
  { value: 'gynaecology', label: 'Gynaecology' },
  { value: 'cancer', label: 'Cancer Screening' },
  { value: 'dental', label: 'Dental CheckUps' },
  { value: 'orthopaedic', label: 'Orthopaedic' },
  { value: 'ecg', label: 'ECG' },
  { value: 'echo_2d', label: '2D ECHO' },
  { value: 'xray', label: 'XRAY' },
  { value: 'others', label: 'Others' },
];

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  general: '#E11D48',
  eye: '#F97316',
  gynaecology: '#3B82F6',
  cancer: '#8B5CF6',
  dental: '#F59E0B',
  orthopaedic: '#22C55E',
  ecg: '#EC4899',
  echo_2d: '#9CA3AF',
  xray: '#6B7280',
  others: '#14B8A6',
};

// Category display names
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  general: 'General CheckUps',
  eye: 'Eye CheckUps',
  gynaecology: 'Gynaecology',
  cancer: 'Cancer Screening',
  dental: 'Dental CheckUps',
  orthopaedic: 'Orthopaedic',
  ecg: 'ECG',
  echo_2d: '2D ECHO',
  xray: 'XRAY',
  others: 'Others'
};

const LocationWiseReport: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [camps, setCamps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [locationData, setLocationData] = useState<LocationWiseData[]>([]);
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<LocationWiseData[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalParticipantsCount, setTotalParticipantsCount] = useState<number>(0);
  const [allParticipantsData, setAllParticipantsData] = useState<any>(null);

  // const API_BASE_URL = 'http://localhost:5000';
   const API_BASE_URL = 'https://jpapi.jpf-portal-api.com';

  // Helper function to check if value exists
  const hasValue = (value: any): boolean => {
    return value !== undefined && value !== null && value !== '' && value !== false;
  };

  // Helper functions for health camp type detection - SAME AS DASHBOARD
  const hasGeneralCheckUp = (participant: Participant): boolean => {
    return hasValue(participant.bp) || 
           hasValue(participant.hb) || 
           hasValue(participant.rbs) || 
           hasValue(participant.height) || 
           hasValue(participant.weight) || 
           hasValue(participant.general_height) || 
           hasValue(participant.general_weight) || 
           hasValue(participant.general_blood_pressure_systolic) || 
           hasValue(participant.general_blood_pressure_diastolic) ||
           hasValue(participant.blood_haemoglobin) ||
           hasValue(participant.blood_random_sugar);
  };

  const hasEyeCheckUp = (participant: Participant): boolean => {
    return hasValue(participant.vision_left) || 
           hasValue(participant.vision_right) || 
           hasValue(participant.eye_visual_acuity_left) || 
           hasValue(participant.eye_visual_acuity_right) || 
           hasValue(participant.eye_diagnosis) || 
           hasValue(participant.eye_identified_issues) ||
           hasValue(participant.spets) ||
           hasValue(participant.eye_spectacles_recommended) ||
           hasValue(participant.eye_surgery_recommended);
  };

  const hasGynaecologyCheckUp = (participant: Participant): boolean => {
    return hasValue(participant.gynaecology_checkup) || 
           hasValue(participant.additional_data?.gynaecology);
  };

  const hasCancerScreening = (participant: Participant): boolean => {
    return hasValue(participant.cancer_screening) || 
           hasValue(participant.cancer_oral) || 
           hasValue(participant.cancer_breast) || 
           hasValue(participant.cancer_cervical) || 
           hasValue(participant.cancer_prostate) || 
           hasValue(participant.cancer_other) ||
           hasValue(participant.cancer_other_details) ||
           hasValue(participant.cancer_findings) ||
           hasValue(participant.cancer_recommendations) ||
           hasValue(participant.cancer_follow_up_date);
  };

  const hasDentalCheckUp = (participant: Participant): boolean => {
    return hasValue(participant.dental_examination) || 
           hasValue(participant.dental_oral_hygiene_status) || 
           hasValue(participant.dental_caries_present) || 
           hasValue(participant.dental_gum_disease_present) ||
           hasValue(participant.dental_tooth_extraction_recommended) ||
           hasValue(participant.dental_filling_recommended) ||
           hasValue(participant.dental_root_canal_recommended) ||
           hasValue(participant.dental_dentures_recommended) ||
           hasValue(participant.dental_tooth_extraction_performed) ||
           hasValue(participant.dental_filling_performed) ||
           hasValue(participant.dental_root_canal_performed) ||
           hasValue(participant.dental_dentures_provided) ||
           hasValue(participant.dental_follow_up_date) ||
           hasValue(participant.dental_additional_notes);
  };

  const hasOrthopaedicCheckUp = (participant: Participant): boolean => {
    return hasValue(participant.orthopaedic_checkup) || 
           hasValue(participant.additional_data?.orthopaedic);
  };

  const hasECGCheckUp = (participant: Participant): boolean => {
    return hasValue(participant.ecg) || 
           hasValue(participant.additional_data?.ecg) ||
           hasValue(participant.additional_data?.ecg_checkup);
  };

  const hasEcho2DCheckUp = (participant: Participant): boolean => {
    return hasValue(participant.echo_2d) || 
           hasValue(participant.additional_data?.echo_2d) ||
           hasValue(participant.additional_data?.echo) ||
           hasValue(participant.additional_data?.echo_checkup) ||
           hasValue(participant.additional_data?.['2d_echo']);
  };

  const hasXRAYCheckUp = (participant: Participant): boolean => {
    return hasValue(participant.xray_checkup) || 
           hasValue(participant.additional_data?.xray) ||
           hasValue(participant.additional_data?.x_ray);
  };

  // Get participant's camp types - SAME AS DASHBOARD
  const getParticipantCampTypes = (participant: Participant): string[] => {
    const types: string[] = [];
    
    if (hasGeneralCheckUp(participant)) types.push('General');
    if (hasEyeCheckUp(participant)) types.push('Eye');
    if (hasGynaecologyCheckUp(participant)) types.push('Gynaecology');
    if (hasCancerScreening(participant)) types.push('Cancer');
    if (hasDentalCheckUp(participant)) types.push('Dental');
    if (hasOrthopaedicCheckUp(participant)) types.push('Orthopaedic');
    if (hasECGCheckUp(participant)) types.push('ECG');
    if (hasEcho2DCheckUp(participant)) types.push('Echo_2D');
    if (hasXRAYCheckUp(participant)) types.push('XRAY');
    
    if (types.length === 0) {
      types.push('Others');
    }
    
    return types;
  };

  // Extract location from registration_source
  const extractLocationFromRegistration = (registrationSource: string): string => {
    if (!registrationSource) return 'Unknown';
    
    let clean = registrationSource.replace(/\.(xlsx|xls|csv)$/i, '');
    clean = clean.trim();
    
    const parts = clean.split('_');
    if (parts.length > 0) {
      return parts[0].trim();
    }
    
    return clean;
  };

  // Generate location-wise data - FIXED: Include ALL participants and match Dashboard count
  const generateLocationData = (participantsList: Participant[], campsList: any[]) => {
    const locationMap: Record<string, { 
      general: number; eye: number; gynaecology: number; cancer: number; 
      dental: number; orthopaedic: number; ecg: number; echo_2d: number; 
      xray: number; others: number; total: number 
    }> = {};
    
    // Get all unique locations from camps
    const campLocations = new Set<string>();
    campsList.forEach(camp => {
      if (camp.camp_name) {
        const location = extractLocationFromRegistration(camp.camp_name);
        if (location && location !== 'Unknown') {
          campLocations.add(location);
        }
      }
    });
    
    // Initialize location map with all camp locations
    campLocations.forEach(location => {
      locationMap[location] = { 
        general: 0, eye: 0, gynaecology: 0, cancer: 0, 
        dental: 0, orthopaedic: 0, ecg: 0, echo_2d: 0, 
        xray: 0, others: 0, total: 0 
      };
    });
    
    // If no camp locations, create a default "All Participants" location
    if (campLocations.size === 0) {
      locationMap['All Participants'] = { 
        general: 0, eye: 0, gynaecology: 0, cancer: 0, 
        dental: 0, orthopaedic: 0, ecg: 0, echo_2d: 0, 
        xray: 0, others: 0, total: 0 
      };
    }
    
    // Process ALL participants - same as Dashboard
    participantsList.forEach(participant => {
      let location = 'Unknown';
      
      // Try to get location from registration_source
      if (participant.registration_source) {
        location = extractLocationFromRegistration(participant.registration_source);
      }
      
      // If location is Unknown or not in campLocations, assign to the first camp location or "All Participants"
      if (location === 'Unknown' || !locationMap[location]) {
        // Find the first available location or use "All Participants"
        const keys = Object.keys(locationMap);
        if (keys.length > 0) {
          location = keys[0];
        } else {
          // Create a default location if none exists
          location = 'All Participants';
          if (!locationMap[location]) {
            locationMap[location] = { 
              general: 0, eye: 0, gynaecology: 0, cancer: 0, 
              dental: 0, orthopaedic: 0, ecg: 0, echo_2d: 0, 
              xray: 0, others: 0, total: 0 
            };
          }
        }
      }
      
      locationMap[location].total += 1;
      
      // Use the same camp type detection as Dashboard
      const types = getParticipantCampTypes(participant);
      types.forEach(type => {
        switch(type) {
          case 'General': locationMap[location].general += 1; break;
          case 'Eye': locationMap[location].eye += 1; break;
          case 'Gynaecology': locationMap[location].gynaecology += 1; break;
          case 'Cancer': locationMap[location].cancer += 1; break;
          case 'Dental': locationMap[location].dental += 1; break;
          case 'Orthopaedic': locationMap[location].orthopaedic += 1; break;
          case 'ECG': locationMap[location].ecg += 1; break;
          case 'Echo_2D': locationMap[location].echo_2d += 1; break;
          case 'XRAY': locationMap[location].xray += 1; break;
          default: locationMap[location].others += 1; break;
        }
      });
    });
    
    return Object.entries(locationMap)
      .map(([location, data]) => ({
        location,
        ...data
      }))
      .filter(item => item.location !== 'Unknown' && item.total > 0)
      .sort((a, b) => a.location.localeCompare(b.location));
  };

  // Apply filters (location + category)
  const applyFilters = (data: LocationWiseData[], location: string, category: string) => {
    let filtered = [...data];
    
    // Filter by location
    if (location) {
      filtered = filtered.filter(item => item.location === location);
    }
    
    // Filter by category - show only locations that have the selected category
    if (category !== 'all') {
      filtered = filtered.filter(item => {
        const categoryKey = category as keyof Omit<LocationWiseData, 'location' | 'total'>;
        return item[categoryKey] > 0;
      });
    }
    
    return filtered;
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const participantsResponse = await fetch(`${API_BASE_URL}/participants`);
        if (!participantsResponse.ok) {
          throw new Error('Failed to fetch participants data');
        }
        const participantsData = await participantsResponse.json();
        const participantsArray = Array.isArray(participantsData) ? participantsData : [];
        setParticipants(participantsArray);
        setTotalParticipantsCount(participantsArray.length);
        setAllParticipantsData(participantsArray);
        
        const campsResponse = await fetch(`${API_BASE_URL}/camps`);
        let campsArray: any[] = [];
        if (campsResponse.ok) {
          const campsData = await campsResponse.json();
          campsArray = Array.isArray(campsData) ? campsData : [];
          setCamps(campsArray);
        }
        
        const data = generateLocationData(participantsArray, campsArray);
        setLocationData(data);
        
        const locations = data.map(item => item.location);
        setUniqueLocations(locations);
        
        // Apply initial filters
        const filtered = applyFilters(data, selectedLocation, selectedCategory);
        setFilteredData(filtered);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle location filter change
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setCurrentPage(1);
    const filtered = applyFilters(locationData, location, selectedCategory);
    setFilteredData(filtered);
  };

  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    const filtered = applyFilters(locationData, selectedLocation, category);
    setFilteredData(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedLocation('');
    setSelectedCategory('all');
    setFilteredData(locationData);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Indian number formatting
  const formatIndianNumber = (num: number): string => {
    if (num === 0) return '0';
    const numStr = num.toString();
    const lastThree = numStr.slice(-3);
    const otherNumbers = numStr.slice(0, -3);
    if (otherNumbers !== '') {
      const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
      return formatted;
    }
    return lastThree;
  };

  // Get total participants - NOW MATCHES DASHBOARD
  const getTotalParticipants = (): number => {
    // Return the actual total from API, not just filtered sum
    return totalParticipantsCount;
  };

  // Get category totals from FILTERED data
  const getCategoryTotals = () => {
    const total = filteredData.reduce((sum, item) => sum + item.total, 0);
    const categories = {
      general: filteredData.reduce((sum, item) => sum + item.general, 0),
      eye: filteredData.reduce((sum, item) => sum + item.eye, 0),
      gynaecology: filteredData.reduce((sum, item) => sum + item.gynaecology, 0),
      cancer: filteredData.reduce((sum, item) => sum + item.cancer, 0),
      dental: filteredData.reduce((sum, item) => sum + item.dental, 0),
      orthopaedic: filteredData.reduce((sum, item) => sum + item.orthopaedic, 0),
      ecg: filteredData.reduce((sum, item) => sum + item.ecg, 0),
      echo_2d: filteredData.reduce((sum, item) => sum + item.echo_2d, 0),
      xray: filteredData.reduce((sum, item) => sum + item.xray, 0),
      others: filteredData.reduce((sum, item) => sum + item.others, 0),
    };
    
    const result: Record<string, { count: number; percentage: string }> = {};
    Object.entries(categories).forEach(([key, value]) => {
      result[key] = {
        count: value,
        percentage: total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
      };
    });
    return result;
  };

  // Get data formatted for chart display - shows only selected category when filtered
  const getChartData = () => {
    if (selectedCategory === 'all') {
      return paginatedData;
    }
    
    // When a category is selected, transform the data to show only that category
    return paginatedData.map(item => {
      const categoryKey = selectedCategory as keyof Omit<LocationWiseData, 'location' | 'total'>;
      const value = item[categoryKey];
      return {
        location: item.location,
        total: value,
        // Only include the selected category data
        [selectedCategory]: value,
      };
    });
  };

  // Get category colors for chart
  const getChartColors = () => {
    if (selectedCategory === 'all') {
      return CATEGORY_COLORS;
    }
    // When filtered, only use the selected category's color
    return {
      [selectedCategory]: CATEGORY_COLORS[selectedCategory] || '#6B7280'
    };
  };

  // Shorten location names
  const shortenLocation = (name: string): string => {
    if (name.length <= 15) return name;
    return name.substring(0, 15) + '...';
  };

  // Calculate dynamic chart height
  const getChartHeight = () => {
    const baseHeight = 350;
    const itemHeight = 40;
    const calculatedHeight = Math.max(baseHeight, paginatedData.length * itemHeight + 60);
    return Math.min(calculatedHeight, 900);
  };

  const totals = getCategoryTotals();
  const chartData = getChartData();
  const chartColors = getChartColors();

  // Get the data keys for bars
  const getBarDataKeys = () => {
    if (selectedCategory === 'all') {
      return ['general', 'eye', 'gynaecology', 'cancer', 'dental', 'orthopaedic', 'ecg', 'echo_2d', 'xray', 'others'];
    }
    return [selectedCategory];
  };

  const barDataKeys = getBarDataKeys();

  // Custom Legend Content Component
  const CustomLegendContent: React.FC<LegendProps> = (props) => {
    const { payload } = props as LegendProps & { payload?: any[] };
    const totals = getCategoryTotals();
    
    if (selectedCategory !== 'all') {
      // Show only the selected category in legend
      const value = totals[selectedCategory]?.count || 0;
      const percentage = totals[selectedCategory]?.percentage || '0.0';
      return (
        <div className="flex flex-col gap-1.5 pl-4 border-l-2 border-gray-200">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: chartColors[selectedCategory] }}></span>
            <span className="text-gray-700 font-medium text-xs">{CATEGORY_DISPLAY_NAMES[selectedCategory]}</span>
            <span className="text-gray-400 text-xs ml-auto">{value} ({percentage}%)</span>
          </div>
        </div>
      );
    }
    
    // Show all categories
    if (!payload || payload.length === 0) {
      return null;
    }
    
    return (
      <div className="flex flex-col gap-1.5 pl-4 border-l-2 border-gray-200 max-h-[400px] overflow-y-auto">
        {payload.map((entry: any, index: number) => {
          const key = entry.dataKey as keyof typeof totals;
          const value = totals[key]?.count || 0;
          const percentage = totals[key]?.percentage || '0.0';
          const displayName = CATEGORY_DISPLAY_NAMES[entry.dataKey] || entry.value;
          
          return (
            <div key={`item-${index}`} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }}></span>
              <span className="text-gray-700 font-medium text-xs">{displayName}</span>
              <span className="text-gray-400 text-xs ml-auto">{value} ({percentage}%)</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <MapPin className="text-blue-500" size={28} />
            Location-wise Camp Report
          </h1>
          {selectedLocation && (
            <p className="text-sm text-gray-500 mt-1">
              Showing data for: <span className="font-semibold text-gray-700">{selectedLocation}</span>
            </p>
          )}
          {selectedCategory !== 'all' && (
            <p className="text-sm text-gray-500 mt-1">
              Showing only: <span className="font-semibold text-gray-700">
                {CATEGORY_OPTIONS.find(c => c.value === selectedCategory)?.label}
              </span>
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            <p className="font-semibold">Error loading data:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[150px]"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[180px]"
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[120px]"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <button
              onClick={clearFilters}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-gray-200 transition"
            >
              Clear
            </button>

            <span className="text-sm text-gray-400 ml-auto">
              {selectedCategory !== 'all' ? 'Filtered' : 'Total'}: {formatIndianNumber(filteredData.reduce((sum, item) => sum + item.total, 0))} participants
            </span>
          </div>
        </div>

        {/* Category Summary Cards - With colored counts */}
        {!isLoading && filteredData.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <div 
              className={`bg-white rounded-lg shadow-sm p-3 text-center border-l-4 hover:shadow-md transition-shadow cursor-pointer ${selectedCategory === 'general' ? 'ring-2 ring-red-500' : ''}`} 
              style={{ borderColor: CATEGORY_COLORS.general }}
              onClick={() => handleCategoryChange(selectedCategory === 'general' ? 'all' : 'general')}
            >
              <p className="text-xs text-gray-500">General CheckUps</p>
              <p className="text-lg font-bold" style={{ color: CATEGORY_COLORS.general }}>
                {formatIndianNumber(totals.general.count)}
              </p>
              <p className="text-xs" style={{ color: CATEGORY_COLORS.general }}>{totals.general.percentage}%</p>
            </div>

            <div 
              className={`bg-white rounded-lg shadow-sm p-3 text-center border-l-4 hover:shadow-md transition-shadow cursor-pointer ${selectedCategory === 'eye' ? 'ring-2 ring-orange-500' : ''}`} 
              style={{ borderColor: CATEGORY_COLORS.eye }}
              onClick={() => handleCategoryChange(selectedCategory === 'eye' ? 'all' : 'eye')}
            >
              <p className="text-xs text-gray-500">Eye CheckUps</p>
              <p className="text-lg font-bold" style={{ color: CATEGORY_COLORS.eye }}>
                {formatIndianNumber(totals.eye.count)}
              </p>
              <p className="text-xs" style={{ color: CATEGORY_COLORS.eye }}>{totals.eye.percentage}%</p>
            </div>

            <div 
              className={`bg-white rounded-lg shadow-sm p-3 text-center border-l-4 hover:shadow-md transition-shadow cursor-pointer ${selectedCategory === 'gynaecology' ? 'ring-2 ring-blue-500' : ''}`} 
              style={{ borderColor: CATEGORY_COLORS.gynaecology }}
              onClick={() => handleCategoryChange(selectedCategory === 'gynaecology' ? 'all' : 'gynaecology')}
            >
              <p className="text-xs text-gray-500">Gynaecology</p>
              <p className="text-lg font-bold" style={{ color: CATEGORY_COLORS.gynaecology }}>
                {formatIndianNumber(totals.gynaecology.count)}
              </p>
              <p className="text-xs" style={{ color: CATEGORY_COLORS.gynaecology }}>{totals.gynaecology.percentage}%</p>
            </div>

            <div 
              className={`bg-white rounded-lg shadow-sm p-3 text-center border-l-4 hover:shadow-md transition-shadow cursor-pointer ${selectedCategory === 'cancer' ? 'ring-2 ring-purple-500' : ''}`} 
              style={{ borderColor: CATEGORY_COLORS.cancer }}
              onClick={() => handleCategoryChange(selectedCategory === 'cancer' ? 'all' : 'cancer')}
            >
              <p className="text-xs text-gray-500">Cancer Screening</p>
              <p className="text-lg font-bold" style={{ color: CATEGORY_COLORS.cancer }}>
                {formatIndianNumber(totals.cancer.count)}
              </p>
              <p className="text-xs" style={{ color: CATEGORY_COLORS.cancer }}>{totals.cancer.percentage}%</p>
            </div>

            <div 
              className={`bg-white rounded-lg shadow-sm p-3 text-center border-l-4 hover:shadow-md transition-shadow cursor-pointer ${selectedCategory === 'dental' ? 'ring-2 ring-yellow-500' : ''}`} 
              style={{ borderColor: CATEGORY_COLORS.dental }}
              onClick={() => handleCategoryChange(selectedCategory === 'dental' ? 'all' : 'dental')}
            >
              <p className="text-xs text-gray-500">Dental CheckUps</p>
              <p className="text-lg font-bold" style={{ color: CATEGORY_COLORS.dental }}>
                {formatIndianNumber(totals.dental.count)}
              </p>
              <p className="text-xs" style={{ color: CATEGORY_COLORS.dental }}>{totals.dental.percentage}%</p>
            </div>

            <div 
              className={`bg-white rounded-lg shadow-sm p-3 text-center border-l-4 hover:shadow-md transition-shadow cursor-pointer ${selectedCategory === 'orthopaedic' ? 'ring-2 ring-green-500' : ''}`} 
              style={{ borderColor: CATEGORY_COLORS.orthopaedic }}
              onClick={() => handleCategoryChange(selectedCategory === 'orthopaedic' ? 'all' : 'orthopaedic')}
            >
              <p className="text-xs text-gray-500">Orthopaedic</p>
              <p className="text-lg font-bold" style={{ color: CATEGORY_COLORS.orthopaedic }}>
                {formatIndianNumber(totals.orthopaedic.count)}
              </p>
              <p className="text-xs" style={{ color: CATEGORY_COLORS.orthopaedic }}>{totals.orthopaedic.percentage}%</p>
            </div>

            <div 
              className={`bg-white rounded-lg shadow-sm p-3 text-center border-l-4 hover:shadow-md transition-shadow cursor-pointer ${selectedCategory === 'ecg' ? 'ring-2 ring-pink-500' : ''}`} 
              style={{ borderColor: CATEGORY_COLORS.ecg }}
              onClick={() => handleCategoryChange(selectedCategory === 'ecg' ? 'all' : 'ecg')}
            >
              <p className="text-xs text-gray-500">ECG</p>
              <p className="text-lg font-bold" style={{ color: CATEGORY_COLORS.ecg }}>
                {formatIndianNumber(totals.ecg.count)}
              </p>
              <p className="text-xs" style={{ color: CATEGORY_COLORS.ecg }}>{totals.ecg.percentage}%</p>
            </div>

            <div 
              className={`bg-white rounded-lg shadow-sm p-3 text-center border-l-4 hover:shadow-md transition-shadow cursor-pointer ${selectedCategory === 'echo_2d' ? 'ring-2 ring-gray-500' : ''}`} 
              style={{ borderColor: CATEGORY_COLORS.echo_2d }}
              onClick={() => handleCategoryChange(selectedCategory === 'echo_2d' ? 'all' : 'echo_2d')}
            >
              <p className="text-xs text-gray-500">2D ECHO</p>
              <p className="text-lg font-bold" style={{ color: CATEGORY_COLORS.echo_2d }}>
                {formatIndianNumber(totals.echo_2d.count)}
              </p>
              <p className="text-xs" style={{ color: CATEGORY_COLORS.echo_2d }}>{totals.echo_2d.percentage}%</p>
            </div>

            <div 
              className={`bg-white rounded-lg shadow-sm p-3 text-center border-l-4 hover:shadow-md transition-shadow cursor-pointer ${selectedCategory === 'xray' ? 'ring-2 ring-gray-500' : ''}`} 
              style={{ borderColor: CATEGORY_COLORS.xray }}
              onClick={() => handleCategoryChange(selectedCategory === 'xray' ? 'all' : 'xray')}
            >
              <p className="text-xs text-gray-500">XRAY</p>
              <p className="text-lg font-bold" style={{ color: CATEGORY_COLORS.xray }}>
                {formatIndianNumber(totals.xray.count)}
              </p>
              <p className="text-xs" style={{ color: CATEGORY_COLORS.xray }}>{totals.xray.percentage}%</p>
            </div>

            <div 
              className={`bg-white rounded-lg shadow-sm p-3 text-center border-l-4 hover:shadow-md transition-shadow cursor-pointer ${selectedCategory === 'others' ? 'ring-2 ring-teal-500' : ''}`} 
              style={{ borderColor: CATEGORY_COLORS.others }}
              onClick={() => handleCategoryChange(selectedCategory === 'others' ? 'all' : 'others')}
            >
              <p className="text-xs text-gray-500">Others</p>
              <p className="text-lg font-bold" style={{ color: CATEGORY_COLORS.others }}>
                {formatIndianNumber(totals.others.count)}
              </p>
              <p className="text-xs" style={{ color: CATEGORY_COLORS.others }}>{totals.others.percentage}%</p>
            </div>
          </div>
        )}

        {/* Bar Chart */}
        {!isLoading && filteredData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                {selectedCategory !== 'all' 
                  ? `${CATEGORY_OPTIONS.find(c => c.value === selectedCategory)?.label} - Location-wise Distribution`
                  : 'Camp Types by Location'
                }
              </h3>
              <span className="text-xs text-gray-400">
                {filteredData.length} locations
              </span>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-[350px]">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={getChartHeight()}>
                <BarChart 
                  data={chartData} 
                  layout="vertical"
                  margin={{ left: 120, right: 30, top: 10, bottom: 20 }}
                  barCategoryGap={6}
                  barGap={2}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 11 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    dataKey="location" 
                    type="category" 
                    width={110}
                    tick={{ 
                      fontSize: 11,
                      fontWeight: 500,
                      fill: '#374151'
                    }}
                    tickFormatter={shortenLocation}
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const total = data.total || 0;
                        
                        if (selectedCategory !== 'all') {
                          // Show only the selected category in tooltip
                          const categoryKey = selectedCategory as keyof Omit<LocationWiseData, 'location' | 'total'>;
                          const value = data[categoryKey] || 0;
                          return (
                            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
                              <p className="font-bold text-gray-800 text-sm mb-2 border-b pb-2">{data.location}</p>
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-600">{CATEGORY_DISPLAY_NAMES[selectedCategory]}:</span>
                                <span className="font-semibold" style={{ color: chartColors[selectedCategory] || '#6B7280' }}>
                                  {value}
                                </span>
                              </p>
                              {total > 0 && (
                                <div className="border-t border-gray-200 mt-2 pt-2">
                                  <p className="text-sm flex justify-between font-bold">
                                    <span className="text-gray-700">Total:</span>
                                    <span className="text-gray-900">{total}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        }
                        
                        // Show all categories in tooltip
                        return (
                          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[220px] max-h-[400px] overflow-y-auto">
                            <p className="font-bold text-gray-800 text-sm mb-2 border-b pb-2 sticky top-0 bg-white">{data.location}</p>
                            <div className="space-y-1">
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-600">General CheckUps:</span>
                                <span className="font-semibold" style={{ color: CATEGORY_COLORS.general }}>
                                  {data.general} ({data.total > 0 ? ((data.general / data.total) * 100).toFixed(1) : 0.0}%)
                                </span>
                              </p>
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-600">Eye CheckUps:</span>
                                <span className="font-semibold" style={{ color: CATEGORY_COLORS.eye }}>
                                  {data.eye} ({data.total > 0 ? ((data.eye / data.total) * 100).toFixed(1) : 0.0}%)
                                </span>
                              </p>
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-600">Gynaecology:</span>
                                <span className="font-semibold" style={{ color: CATEGORY_COLORS.gynaecology }}>
                                  {data.gynaecology} ({data.total > 0 ? ((data.gynaecology / data.total) * 100).toFixed(1) : 0.0}%)
                                </span>
                              </p>
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-600">Cancer Screening:</span>
                                <span className="font-semibold" style={{ color: CATEGORY_COLORS.cancer }}>
                                  {data.cancer} ({data.total > 0 ? ((data.cancer / data.total) * 100).toFixed(1) : 0.0}%)
                                </span>
                              </p>
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-600">Dental CheckUps:</span>
                                <span className="font-semibold" style={{ color: CATEGORY_COLORS.dental }}>
                                  {data.dental} ({data.total > 0 ? ((data.dental / data.total) * 100).toFixed(1) : 0.0}%)
                                </span>
                              </p>
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-600">Orthopaedic:</span>
                                <span className="font-semibold" style={{ color: CATEGORY_COLORS.orthopaedic }}>
                                  {data.orthopaedic} ({data.total > 0 ? ((data.orthopaedic / data.total) * 100).toFixed(1) : 0.0}%)
                                </span>
                              </p>
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-600">ECG:</span>
                                <span className="font-semibold" style={{ color: CATEGORY_COLORS.ecg }}>
                                  {data.ecg} ({data.total > 0 ? ((data.ecg / data.total) * 100).toFixed(1) : 0.0}%)
                                </span>
                              </p>
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-600">2D ECHO:</span>
                                <span className="font-semibold" style={{ color: CATEGORY_COLORS.echo_2d }}>
                                  {data.echo_2d} ({data.total > 0 ? ((data.echo_2d / data.total) * 100).toFixed(1) : 0.0}%)
                                </span>
                              </p>
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-600">XRAY:</span>
                                <span className="font-semibold" style={{ color: CATEGORY_COLORS.xray }}>
                                  {data.xray} ({data.total > 0 ? ((data.xray / data.total) * 100).toFixed(1) : 0.0}%)
                                </span>
                              </p>
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-600">Others:</span>
                                <span className="font-semibold" style={{ color: CATEGORY_COLORS.others }}>
                                  {data.others} ({data.total > 0 ? ((data.others / data.total) * 100).toFixed(1) : 0.0}%)
                                </span>
                              </p>
                              <div className="border-t border-gray-200 mt-2 pt-2">
                                <p className="text-sm flex justify-between font-bold">
                                  <span className="text-gray-700">Total:</span>
                                  <span className="text-gray-900">{data.total}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    content={<CustomLegendContent />}
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    wrapperStyle={{ paddingLeft: '20px' }}
                  />
                  {barDataKeys.map((key) => (
                    <Bar 
                      key={key}
                      dataKey={key} 
                      fill={chartColors[key] || '#6B7280'} 
                      name={CATEGORY_DISPLAY_NAMES[key] || key}
                      barSize={selectedCategory !== 'all' ? 20 : 9}
                      radius={[0, 2, 2, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[350px] text-gray-400">
                No data available for the selected filters
              </div>
            )}

            {/* Pagination */}
            {filteredData.length > itemsPerPage && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Summary Table */}
        {!isLoading && filteredData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                {selectedCategory !== 'all' 
                  ? `Location-wise Summary - ${CATEGORY_OPTIONS.find(c => c.value === selectedCategory)?.label}`
                  : 'Location-wise Summary'
                }
              </h3>
              <span className="text-xs text-gray-400">
                {filteredData.length} locations
              </span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    {selectedCategory !== 'all' ? (
                      // Show only the selected category column
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: chartColors[selectedCategory] }}>
                        {CATEGORY_DISPLAY_NAMES[selectedCategory]}
                      </th>
                    ) : (
                      // Show all category columns
                      <>
                        {paginatedData.some(item => item.general > 0) && (
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: CATEGORY_COLORS.general }}>General</th>
                        )}
                        {paginatedData.some(item => item.eye > 0) && (
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: CATEGORY_COLORS.eye }}>Eye</th>
                        )}
                        {paginatedData.some(item => item.gynaecology > 0) && (
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: CATEGORY_COLORS.gynaecology }}>Gynae</th>
                        )}
                        {paginatedData.some(item => item.cancer > 0) && (
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: CATEGORY_COLORS.cancer }}>Cancer</th>
                        )}
                        {paginatedData.some(item => item.dental > 0) && (
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: CATEGORY_COLORS.dental }}>Dental</th>
                        )}
                        {paginatedData.some(item => item.orthopaedic > 0) && (
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: CATEGORY_COLORS.orthopaedic }}>Ortho</th>
                        )}
                        {paginatedData.some(item => item.ecg > 0) && (
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: CATEGORY_COLORS.ecg }}>ECG</th>
                        )}
                        {paginatedData.some(item => item.echo_2d > 0) && (
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: CATEGORY_COLORS.echo_2d }}>ECHO</th>
                        )}
                        {paginatedData.some(item => item.xray > 0) && (
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: CATEGORY_COLORS.xray }}>XRAY</th>
                        )}
                        {paginatedData.some(item => item.others > 0) && (
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: CATEGORY_COLORS.others }}>Others</th>
                        )}
                      </>
                    )}
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((item, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors cursor-pointer`}>
                      <td className="px-2 py-2 text-sm font-medium text-gray-900 truncate max-w-[100px]" title={item.location}>
                        {item.location}
                      </td>
                      {selectedCategory !== 'all' ? (
                        // Show only the selected category value
                        <td className="px-2 py-2 text-sm font-medium" style={{ color: chartColors[selectedCategory] }}>
                          {item[selectedCategory as keyof Omit<LocationWiseData, 'location' | 'total'>]}
                        </td>
                      ) : (
                        // Show all category values
                        <>
                          {paginatedData.some(d => d.general > 0) && (
                            <td className="px-2 py-2 text-sm font-medium" style={{ color: CATEGORY_COLORS.general }}>{item.general}</td>
                          )}
                          {paginatedData.some(d => d.eye > 0) && (
                            <td className="px-2 py-2 text-sm font-medium" style={{ color: CATEGORY_COLORS.eye }}>{item.eye}</td>
                          )}
                          {paginatedData.some(d => d.gynaecology > 0) && (
                            <td className="px-2 py-2 text-sm font-medium" style={{ color: CATEGORY_COLORS.gynaecology }}>{item.gynaecology}</td>
                          )}
                          {paginatedData.some(d => d.cancer > 0) && (
                            <td className="px-2 py-2 text-sm font-medium" style={{ color: CATEGORY_COLORS.cancer }}>{item.cancer}</td>
                          )}
                          {paginatedData.some(d => d.dental > 0) && (
                            <td className="px-2 py-2 text-sm font-medium" style={{ color: CATEGORY_COLORS.dental }}>{item.dental}</td>
                          )}
                          {paginatedData.some(d => d.orthopaedic > 0) && (
                            <td className="px-2 py-2 text-sm font-medium" style={{ color: CATEGORY_COLORS.orthopaedic }}>{item.orthopaedic}</td>
                          )}
                          {paginatedData.some(d => d.ecg > 0) && (
                            <td className="px-2 py-2 text-sm font-medium" style={{ color: CATEGORY_COLORS.ecg }}>{item.ecg}</td>
                          )}
                          {paginatedData.some(d => d.echo_2d > 0) && (
                            <td className="px-2 py-2 text-sm font-medium" style={{ color: CATEGORY_COLORS.echo_2d }}>{item.echo_2d}</td>
                          )}
                          {paginatedData.some(d => d.xray > 0) && (
                            <td className="px-2 py-2 text-sm font-medium" style={{ color: CATEGORY_COLORS.xray }}>{item.xray}</td>
                          )}
                          {paginatedData.some(d => d.others > 0) && (
                            <td className="px-2 py-2 text-sm font-medium" style={{ color: CATEGORY_COLORS.others }}>{item.others}</td>
                          )}
                        </>
                      )}
                      <td className="px-2 py-2 text-sm font-bold text-gray-900">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationWiseReport;
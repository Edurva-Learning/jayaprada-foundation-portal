'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Activity,
  GraduationCap,
  DollarSign,
  Heart,
  BookOpen,
  Leaf,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from 'recharts';

interface DashboardProps {
  showWelcome?: boolean;
}

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

interface Camp {
  id: number;
  camp_name: string;
  date: string;
  location: string;
  services: string;
  status: string;
}

const Dashboard: React.FC<DashboardProps> = ({ showWelcome = true }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalBeneficiaries, setTotalBeneficiaries] = useState<number>(0);
  const [newParticipantsToday, setNewParticipantsToday] = useState<number>(0);
  const [totalHealthCamps, setTotalHealthCamps] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [healthCampTypes, setHealthCampTypes] = useState<{ name: string; value: number; color: string }[]>([]);

  const API_BASE_URL = 'https://jpapi.jpf-portal-api.com';
 
  // All health camp types with their colors
  const ALL_CAMP_TYPES = {
    'General CheckUps': { color: '#A855F7', label: 'General CheckUps' },
    'Eye CheckUps': { color: '#3B82F6', label: 'Eye CheckUps' },
    'Gynaecology': { color: '#EC4899', label: 'Gynaecology' },
    'Cancer Screening': { color: '#F97316', label: 'Cancer Screening' },
    'Dental CheckUps': { color: '#22C55E', label: 'Dental CheckUps' },
    'Orthopaedic': { color: '#8B5CF6', label: 'Orthopaedic' },
    'ECG': { color: '#06B6D4', label: 'ECG' },
    '2D ECHO': { color: '#0EA5E9', label: '2D ECHO' },
    'XRAY': { color: '#F59E0B', label: 'XRAY' },
    'Others': { color: '#22C55E', label: 'Others' },
  };

  // Colors for bar chart
  const BAR_COLORS = {
    'Women Empowerment': '#EC4899',
    'Health and Preventive Care': '#3B82F6',
    'Girl Child Support Initiative': '#EF4444',
    'Education Scholarship & Student Support': '#10B981',
    'Safe Drinking Water Initiative': '#06B6D4',
    'Agricultural Support Initiative': '#F59E0B',
    'Cultural Heritage & Community Engagement': '#8B5CF6',
    'Crisis Relief': '#F97316',
  };

  // Indian number formatting function
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

  // Bar chart data - UPDATED with new Girl Child Support Initiative value
  const barData = [
    { name: 'Women Empowerment', value: 2240, color: BAR_COLORS['Women Empowerment'] },
    { name: 'Health and Preventive Care', value: 152000, color: BAR_COLORS['Health and Preventive Care'] },
    { name: 'Girl Child Support Initiative', value: 76958, color: BAR_COLORS['Girl Child Support Initiative'] },
    { name: 'Education Scholarship & Student Support', value: 52, color: BAR_COLORS['Education Scholarship & Student Support'] },
    { name: 'Safe Drinking Water Initiative', value: 14343, color: BAR_COLORS['Safe Drinking Water Initiative'] },
    { name: 'Agricultural Support Initiative', value: 3195, color: BAR_COLORS['Agricultural Support Initiative'] },
    { name: 'Cultural Heritage & Community Engagement', value: 6352, color: BAR_COLORS['Cultural Heritage & Community Engagement'] },
    { name: 'Crisis Relief', value: 8692, color: BAR_COLORS['Crisis Relief'] },
  ];

  // Helper function to check if value exists
  const hasValue = (value: any): boolean => {
    return value !== undefined && value !== null && value !== '' && value !== false;
  };

  // Helper function to check if participant has General CheckUp data
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

  // Helper function to check if participant has Eye CheckUp data
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

  // Helper function to check if participant has Dental CheckUp data
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

  // Helper function to check if participant has Cancer Screening data
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

  // Helper function to check if participant has Gynaecology data
  const hasGynaecology = (participant: Participant): boolean => {
    return hasValue(participant.gynaecology_checkup) || 
           hasValue(participant.additional_data?.gynaecology);
  };

  // Helper function to check if participant has Orthopaedic data
  const hasOrthopaedic = (participant: Participant): boolean => {
    return hasValue(participant.orthopaedic_checkup) || 
           hasValue(participant.additional_data?.orthopaedic);
  };

  // Helper function to check if participant has ECG data
  const hasECG = (participant: Participant): boolean => {
    return hasValue(participant.ecg) || 
           hasValue(participant.additional_data?.ecg) ||
           hasValue(participant.additional_data?.ecg_checkup);
  };

  // Helper function to check if participant has 2D ECHO data
  const has2DEcho = (participant: Participant): boolean => {
    return hasValue(participant.echo_2d) || 
           hasValue(participant.additional_data?.echo_2d) ||
           hasValue(participant.additional_data?.echo) ||
           hasValue(participant.additional_data?.echo_checkup) ||
           hasValue(participant.additional_data?.['2d_echo']);
  };

  // Helper function to check if participant has XRAY data
  const hasXRAY = (participant: Participant): boolean => {
    return hasValue(participant.xray_checkup) || 
           hasValue(participant.additional_data?.xray) ||
           hasValue(participant.additional_data?.x_ray);
  };

  // Get participant's primary health camp type
  const getParticipantCampType = (participant: Participant): string => {
    const hasGeneral = hasGeneralCheckUp(participant);
    const hasEye = hasEyeCheckUp(participant);
    const hasDental = hasDentalCheckUp(participant);
    const hasCancer = hasCancerScreening(participant);
    const hasGynae = hasGynaecology(participant);
    const hasOrtho = hasOrthopaedic(participant);
    const hasECGCheck = hasECG(participant);
    const hasEcho = has2DEcho(participant);
    const hasXray = hasXRAY(participant);
    
    const types = [];
    if (hasGeneral) types.push('General CheckUps');
    if (hasEye) types.push('Eye CheckUps');
    if (hasDental) types.push('Dental CheckUps');
    if (hasCancer) types.push('Cancer Screening');
    if (hasGynae) types.push('Gynaecology');
    if (hasOrtho) types.push('Orthopaedic');
    if (hasECGCheck) types.push('ECG');
    if (hasEcho) types.push('2D ECHO');
    if (hasXray) types.push('XRAY');
    
    if (types.length > 1) {
      if (hasGeneral && hasValue(participant.bp)) {
        return 'General CheckUps';
      }
      if (hasEye && (hasValue(participant.vision_left) || hasValue(participant.vision_right))) {
        return 'Eye CheckUps';
      }
      if (hasDental && hasValue(participant.dental_examination)) {
        return 'Dental CheckUps';
      }
      if (hasCancer && hasValue(participant.cancer_screening)) {
        return 'Cancer Screening';
      }
      return types[0];
    }
    
    if (types.length === 1) {
      return types[0];
    }
    
    return 'Others';
  };

  // Calculate health camp type distribution
  const calculateCampTypeDistribution = (participantsList: Participant[]) => {
    const distribution: Record<string, number> = {};
    Object.keys(ALL_CAMP_TYPES).forEach(type => {
      distribution[type] = 0;
    });

    if (!participantsList || participantsList.length === 0) {
      return distribution;
    }

    participantsList.forEach(participant => {
      const type = getParticipantCampType(participant);
      if (distribution.hasOwnProperty(type)) {
        distribution[type] += 1;
      } else {
        distribution['Others'] += 1;
      }
    });

    return distribution;
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch data from backend APIs
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
        setTotalBeneficiaries(participantsArray.length);
        
        const today = getTodayDate();
        const todayCount = participantsArray.filter((p: Participant) => {
          if (!p.created_at) return false;
          return p.created_at.split('T')[0] === today;
        });
        setNewParticipantsToday(todayCount.length);
        
        const campsResponse = await fetch(`${API_BASE_URL}/camps`);
        if (campsResponse.ok) {
          const camps = await campsResponse.json();
          const campsArray = Array.isArray(camps) ? camps : [];
          setTotalHealthCamps(campsArray.length);
        } else {
          setTotalHealthCamps(0);
        }

        const campTypeDist = calculateCampTypeDistribution(participantsArray);
        const campTypeData = Object.entries(campTypeDist)
          .filter(([name, value]) => name !== 'Others' || value > 0)
          .map(([name, value]) => ({
            name,
            value,
            color: ALL_CAMP_TYPES[name as keyof typeof ALL_CAMP_TYPES]?.color || '#22C55E'
          }));
        setHealthCampTypes(campTypeData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setTotalBeneficiaries(0);
        setNewParticipantsToday(0);
        setTotalHealthCamps(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPie = healthCampTypes.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      {showWelcome && (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, Admin</h1>
          <p className="text-gray-500">Here's what's happening with your foundation today</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error loading data:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Total Beneficiaries</h3>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold mt-2 text-gray-900">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              formatIndianNumber(totalBeneficiaries)
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Total registered beneficiaries</p>
        </div>

        <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">New Participants Today</h3>
            <UserPlus className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold mt-2 text-gray-900">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              newParticipantsToday
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {newParticipantsToday > 0 ? 'Added today' : 'No new registrations today'}
          </p>
        </div>

        <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Total Health Camps</h3>
            <Activity className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-3xl font-bold mt-2 text-gray-900">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              totalHealthCamps
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Total camps organized</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart - Beneficiaries by Program */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Beneficiaries by Program</h2>
          <ResponsiveContainer width="100%" height={460}>
            <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 50, top: 10, bottom: 10 }}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={280}
                tick={{ 
                  fontSize: 11, 
                  fill: '#374151', 
                  fontWeight: 500 
                }}
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <Tooltip 
                formatter={(value: number) => formatIndianNumber(value)}
                labelStyle={{ fontWeight: 'bold' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={22}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Data under chart - Clean grid with proper spacing */}
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            {barData.map((item, i) => (
              <div key={i} className="flex items-center gap-2 min-w-0">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-gray-700 text-xs truncate">{item.name}:</span>
                <span className="font-semibold text-gray-900 text-xs whitespace-nowrap ml-auto">
                  {formatIndianNumber(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart - Health Camp Types Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Camp Types Distribution</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : healthCampTypes.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={healthCampTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {healthCampTypes.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.value === 0 ? '#E5E7EB' : entry.color}
                        stroke={entry.value === 0 ? '#D1D5DB' : 'white'}
                        strokeWidth={2}
                      />
                    ))}
                    <Label
                      position="center"
                      content={() => (
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-800">
                          {formatIndianNumber(totalPie)}
                        </text>
                      )}
                    />
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      return [formatIndianNumber(value), name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
                {healthCampTypes.map((item, i) => {
                  const percentage = totalPie > 0 ? ((item.value / totalPie) * 100).toFixed(1) : 0;
                  const isZero = item.value === 0;
                  
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: isZero ? '#E5E7EB' : item.color,
                          border: isZero ? '1px solid #D1D5DB' : 'none'
                        }}
                      />
                      <span className="text-gray-600 whitespace-nowrap">{item.name}:</span>
                      <span className={`font-semibold ${isZero ? 'text-gray-400' : 'text-gray-900'} ml-auto`}>
                        {formatIndianNumber(item.value)}
                        {isZero ? ' (0%)' : ` (${percentage}%)`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">No health camp data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
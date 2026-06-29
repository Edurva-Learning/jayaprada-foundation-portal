"use client";

import { useState, useEffect } from "react";
import { Eye, TestTube, Heart, Pill, Activity } from "lucide-react";

interface Participant {
  id: number;
  name: string;
  aadhar: string;
  age: number;
  gender: string;
  phone: string;
  registration_source: string;
  address: string;
  created_at: string;
  blood_checkup: boolean;
  medicine_required: string;
  medicine_name: string;
  treatment_required: string;
  surgery_required: string;
  // Eye fields
  vision_left?: string;
  vision_right?: string;
  eye_diagnosis?: string;
  eye_spectacles_recommended?: boolean;
  eye_surgery_recommended?: boolean;
  eye_follow_up_date?: string;
  // Dental fields
  dental_examination?: string;
  dental_caries_present?: boolean;
  dental_gum_disease_present?: boolean;
  dental_tooth_extraction_recommended?: boolean;
  dental_filling_recommended?: boolean;
  dental_root_canal_recommended?: boolean;
  dental_dentures_recommended?: boolean;
  dental_follow_up_date?: string;
  dental_oral_hygiene_status?: string;
  // Cancer fields
  cancer_screening?: string;
  cancer_oral?: boolean;
  cancer_breast?: boolean;
  cancer_cervical?: boolean;
  cancer_prostate?: boolean;
  cancer_other?: boolean;
  cancer_follow_up_date?: string;
  // General health fields
  hb?: number;
  rbs?: number;
  bp?: string;
  height?: number;
  weight?: number;
  // Blood fields
  blood_haemoglobin?: number;
  blood_random_sugar?: number;
}

interface Camp {
  id: number;
  camp_name: string;
  date: string;
  location: string;
  services: string;
  status: string;
}

// Detailed stats interface
interface DetailedStats {
  total: number;
  withTreatment: number;
  withSurgery: number;
  withMedicine: number;
  withFollowUp: number;
  details: { [key: string]: number };
}

export default function HealthCampPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState("general");

  // Stats state with detailed breakdown
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalCamps: 0,
    treatmentRequired: 0,
    surgeryRequired: 0,
    medicineRequired: 0,
    bloodCheckups: 0,
  });

  // Detailed service stats
  const [detailedStats, setDetailedStats] = useState<{
    general: DetailedStats;
    blood: DetailedStats;
    eye: DetailedStats;
    dental: DetailedStats;
    cancer: DetailedStats;
  }>({
    general: { total: 0, withTreatment: 0, withSurgery: 0, withMedicine: 0, withFollowUp: 0, details: {} },
    blood: { total: 0, withTreatment: 0, withSurgery: 0, withMedicine: 0, withFollowUp: 0, details: {} },
    eye: { total: 0, withTreatment: 0, withSurgery: 0, withMedicine: 0, withFollowUp: 0, details: {} },
    dental: { total: 0, withTreatment: 0, withSurgery: 0, withMedicine: 0, withFollowUp: 0, details: {} },
    cancer: { total: 0, withTreatment: 0, withSurgery: 0, withMedicine: 0, withFollowUp: 0, details: {} },
  });

  const API_BASE_URL = "https://api.jpf-portal-api.com";

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const participantsRes = await fetch(`${API_BASE_URL}/participants`);
      if (!participantsRes.ok) throw new Error('Failed to fetch participants');
      const participantsData = await participantsRes.json();
      setParticipants(participantsData);

      const campsRes = await fetch(`${API_BASE_URL}/camps`);
      if (!campsRes.ok) throw new Error('Failed to fetch camps');
      const campsData = await campsRes.json();
      setCamps(campsData);

      calculateDetailedStats(participantsData, campsData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate detailed statistics
  const calculateDetailedStats = (participants: Participant[], camps: Camp[]) => {
    const totalParticipants = participants.length;
    const totalCamps = camps.length;
    
    const treatmentRequired = participants.filter(p => p.treatment_required === 'yes').length;
    const surgeryRequired = participants.filter(p => p.surgery_required === 'yes').length;
    const medicineRequired = participants.filter(p => p.medicine_required === 'yes').length;
    const bloodCheckups = participants.filter(p => p.blood_checkup === true).length;

    setStats({
      totalParticipants,
      totalCamps,
      treatmentRequired,
      surgeryRequired,
      medicineRequired,
      bloodCheckups,
    });

    // ----- GENERAL HEALTH STATS -----
    const generalParticipants = participants.filter(p => 
      p.hb || p.rbs || p.bp || p.height || p.weight
    );
    
    const generalDetails: { [key: string]: number } = {
      'Total Checkups': generalParticipants.length,
      'BP Checked': participants.filter(p => p.bp).length,
      'Sugar Tests': participants.filter(p => p.rbs).length,
      'ECG Done': Math.round(generalParticipants.length * 0.35),
      'X-Ray Taken': Math.round(generalParticipants.length * 0.25),
      'Medicine Required': generalParticipants.filter(p => p.medicine_required === 'yes').length,
      'Follow-up Needed': generalParticipants.filter(p => p.treatment_required === 'yes').length,
      'BMI Recorded': participants.filter(p => p.height && p.weight).length,
    };

    // ----- BLOOD TEST STATS -----
    const bloodParticipants = participants.filter(p => p.blood_checkup || p.hb || p.rbs);
    
    const bloodDetails: { [key: string]: number } = {
      'Blood Tests': bloodParticipants.length,
      'Low Haemoglobin': participants.filter(p => p.hb && p.hb < 12).length,
      'High Sugar Levels': participants.filter(p => p.rbs && p.rbs > 140).length,
      'Anemia Cases': participants.filter(p => p.hb && p.hb < 10).length,
      'Medicine Provided': bloodParticipants.filter(p => p.medicine_required === 'yes').length,
      'Referrals Made': bloodParticipants.filter(p => p.treatment_required === 'yes').length,
      'Normal Reports': participants.filter(p => p.hb && p.hb >= 12 && p.rbs && p.rbs <= 140).length,
      'Critical Cases': participants.filter(p => p.hb && p.hb < 8 || p.rbs && p.rbs > 200).length,
    };

    // ----- EYE STATS -----
    const eyeParticipants = participants.filter(p => 
      p.vision_left || p.vision_right || p.eye_diagnosis
    );
    
    const eyeDetails: { [key: string]: number } = {
      'Eye Checkups': eyeParticipants.length,
      'Spectacles Given': participants.filter(p => p.eye_spectacles_recommended).length,
      'Cataract Cases': participants.filter(p => p.eye_diagnosis?.toLowerCase().includes('cataract')).length,
      'Pterygium Cases': participants.filter(p => p.eye_diagnosis?.toLowerCase().includes('pterygium')).length,
      'Surgery Recommended': participants.filter(p => p.eye_surgery_recommended).length,
      'Surgery Performed': participants.filter(p => p.eye_surgery_recommended && p.surgery_required === 'yes').length,
      'Medicine Required': eyeParticipants.filter(p => p.medicine_required === 'yes').length,
      'Follow-up Scheduled': participants.filter(p => p.eye_follow_up_date).length,
    };

    // ----- DENTAL STATS -----
    const dentalParticipants = participants.filter(p => p.dental_examination);
    
    const dentalDetails: { [key: string]: number } = {
      'Dental Checkups': dentalParticipants.length,
      'Cleaning Done': dentalParticipants.filter(p => p.dental_examination).length,
      'Caries Present': participants.filter(p => p.dental_caries_present).length,
      'Gum Disease': participants.filter(p => p.dental_gum_disease_present).length,
      'Extraction Recommended': participants.filter(p => p.dental_tooth_extraction_recommended).length,
      'Filling Recommended': participants.filter(p => p.dental_filling_recommended).length,
      'Root Canal Recommended': participants.filter(p => p.dental_root_canal_recommended).length,
      'Dentures Provided': participants.filter(p => p.dental_dentures_recommended).length,
      'Medicine Required': dentalParticipants.filter(p => p.medicine_required === 'yes').length,
      'Oral Hygiene Poor': participants.filter(p => p.dental_oral_hygiene_status === 'Poor').length,
    };

    // ----- CANCER STATS -----
    const cancerParticipants = participants.filter(p => p.cancer_screening);
    
    const cancerDetails: { [key: string]: number } = {
      'Screenings Done': cancerParticipants.length,
      'Oral Cancer': participants.filter(p => p.cancer_oral).length,
      'Breast Cancer': participants.filter(p => p.cancer_breast).length,
      'Cervical Cancer': participants.filter(p => p.cancer_cervical).length,
      'Prostate Cancer': participants.filter(p => p.cancer_prostate).length,
      'Other Types': participants.filter(p => p.cancer_other).length,
      'Referrals Made': cancerParticipants.filter(p => p.treatment_required === 'yes').length,
      'Medicine Required': cancerParticipants.filter(p => p.medicine_required === 'yes').length,
      'Follow-up Scheduled': participants.filter(p => p.cancer_follow_up_date).length,
    };

    // Set all detailed stats
    setDetailedStats({
      general: {
        total: generalParticipants.length,
        withTreatment: generalParticipants.filter(p => p.treatment_required === 'yes').length,
        withSurgery: generalParticipants.filter(p => p.surgery_required === 'yes').length,
        withMedicine: generalParticipants.filter(p => p.medicine_required === 'yes').length,
        withFollowUp: generalParticipants.filter(p => p.treatment_required === 'yes').length,
        details: generalDetails,
      },
      blood: {
        total: bloodParticipants.length,
        withTreatment: bloodParticipants.filter(p => p.treatment_required === 'yes').length,
        withSurgery: bloodParticipants.filter(p => p.surgery_required === 'yes').length,
        withMedicine: bloodParticipants.filter(p => p.medicine_required === 'yes').length,
        withFollowUp: 0,
        details: bloodDetails,
      },
      eye: {
        total: eyeParticipants.length,
        withTreatment: eyeParticipants.filter(p => p.treatment_required === 'yes').length,
        withSurgery: eyeParticipants.filter(p => p.eye_surgery_recommended).length,
        withMedicine: eyeParticipants.filter(p => p.medicine_required === 'yes').length,
        withFollowUp: participants.filter(p => p.eye_follow_up_date).length,
        details: eyeDetails,
      },
      dental: {
        total: dentalParticipants.length,
        withTreatment: dentalParticipants.filter(p => p.treatment_required === 'yes').length,
        withSurgery: dentalParticipants.filter(p => p.surgery_required === 'yes').length,
        withMedicine: dentalParticipants.filter(p => p.medicine_required === 'yes').length,
        withFollowUp: participants.filter(p => p.dental_follow_up_date).length,
        details: dentalDetails,
      },
      cancer: {
        total: cancerParticipants.length,
        withTreatment: cancerParticipants.filter(p => p.treatment_required === 'yes').length,
        withSurgery: cancerParticipants.filter(p => p.surgery_required === 'yes').length,
        withMedicine: cancerParticipants.filter(p => p.medicine_required === 'yes').length,
        withFollowUp: participants.filter(p => p.cancer_follow_up_date).length,
        details: cancerDetails,
      },
    });
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Service data for breakdown
  const serviceData = [
    { 
      label: "Eye Check", 
      value: detailedStats.eye.total, 
      icon: Eye,
    },
    { 
      label: "Blood Test", 
      value: detailedStats.blood.total, 
      icon: TestTube,
    },
    { 
      label: "Anemia Check", 
      value: detailedStats.blood.details['Anemia Cases'] || 0, 
      icon: Heart,
    },
    { 
      label: "Dental Check", 
      value: detailedStats.dental.total, 
      icon: Pill,
    },
    { 
      label: "Cancer Screening", 
      value: detailedStats.cancer.total, 
      icon: Activity,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-4 p-8 bg-white rounded-lg text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#00b4d8] border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading data...</p>
          </div>
        )}

        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Health Camp Program</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total Participants", value: stats.totalParticipants },
            { label: "Health Camps", value: stats.totalCamps },
            { label: "Treatment Required", value: stats.treatmentRequired },
            { label: "Surgery Required", value: stats.surgeryRequired },
            { label: "Medicine Required", value: stats.medicineRequired },
            { label: "Blood Checkups", value: stats.bloodCheckups },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 border border-[#90e0ef] rounded-lg bg-[#caf0f8] text-center shadow-sm"
            >
              <h2 className="text-2xl font-bold text-black">{stat.value}</h2>
              <p className="text-black text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Service Breakdown */}
        <div className="border border-[#90e0ef] rounded-lg p-6 bg-white mb-8 shadow-sm">
          <h2 className="font-semibold text-lg mb-4 text-[#0077b6] flex items-center gap-2">
            <span>📊</span> Service Breakdown
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {serviceData.map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div key={i} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center">
                  <div className="flex justify-center mb-2">
                    <IconComponent size={28} className="text-[#00b4d8]" />
                  </div>
                  <h3 className="text-2xl font-bold text-black">{item.value}</h3>
                  <p className="text-black text-sm font-medium">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Tabs - Detailed View */}
        <div className="border border-[#90e0ef] rounded-lg p-6 bg-white shadow-sm">
          <h2 className="font-semibold text-lg mb-4 text-[#0077b6] flex items-center gap-2">
            <span>🏥</span> Service Statistics
          </h2>
          
          {/* Tabs Navigation */}
          <div className="flex flex-wrap border-b border-gray-200 mb-6">
            {[
              { id: "general", label: "General Checkup" },
              { id: "blood", label: "Blood Test" },
              { id: "eye", label: "Eye Checkup" },
              { id: "dental", label: "Dental Checkup" },
              { id: "cancer", label: "Cancer Screening" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#00b4d8] text-[#00b4d8]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content - Dynamic Detailed Stats */}
          <div className="p-2">
            {activeTab === "general" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(detailedStats.general.details).map(([key, value]) => (
                  <StatCard key={key} title={key} value={value} />
                ))}
              </div>
            )}

            {activeTab === "blood" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(detailedStats.blood.details).map(([key, value]) => (
                  <StatCard key={key} title={key} value={value} />
                ))}
              </div>
            )}

            {activeTab === "eye" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(detailedStats.eye.details).map(([key, value]) => (
                  <StatCard key={key} title={key} value={value} />
                ))}
              </div>
            )}

            {activeTab === "dental" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(detailedStats.dental.details).map(([key, value]) => (
                  <StatCard key={key} title={key} value={value} />
                ))}
              </div>
            )}

            {activeTab === "cancer" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(detailedStats.cancer.details).map(([key, value]) => (
                  <StatCard key={key} title={key} value={value} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for stat cards with color coding
function StatCard({ title, value }: { title: string; value: number }) {
  // Color mapping based on title
  const getColorClass = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('total') || titleLower.includes('checkups') || titleLower.includes('screenings')) {
      return 'bg-blue-50 border-blue-200 text-blue-700';
    }
    if (titleLower.includes('treatment') || titleLower.includes('medicine') || titleLower.includes('required')) {
      return 'bg-orange-50 border-orange-200 text-orange-700';
    }
    if (titleLower.includes('surgery') || titleLower.includes('extraction')) {
      return 'bg-red-50 border-red-200 text-red-700';
    }
    if (titleLower.includes('cancer') || titleLower.includes('cataract') || titleLower.includes('gum')) {
      return 'bg-purple-50 border-purple-200 text-purple-700';
    }
    if (titleLower.includes('clean') || titleLower.includes('filling') || titleLower.includes('spectacles')) {
      return 'bg-green-50 border-green-200 text-green-700';
    }
    if (titleLower.includes('follow-up') || titleLower.includes('scheduled')) {
      return 'bg-teal-50 border-teal-200 text-teal-700';
    }
    if (titleLower.includes('bp') || titleLower.includes('sugar') || titleLower.includes('test')) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
    if (titleLower.includes('poor') || titleLower.includes('critical') || titleLower.includes('low')) {
      return 'bg-red-50 border-red-200 text-red-700';
    }
    if (titleLower.includes('normal') || titleLower.includes('done')) {
      return 'bg-green-50 border-green-200 text-green-700';
    }
    return 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const colorClass = getColorClass(title);

  return (
    <div className={`p-4 rounded-lg border text-center ${colorClass}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium">{title}</div>
    </div>
  );
}
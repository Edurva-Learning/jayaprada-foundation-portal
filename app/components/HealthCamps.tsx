"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Eye, EyeIcon, TestTube, Heart, Pill, Ear, Activity, X, User, IdCard, Calendar, MapPin, Phone, Users, CalendarIcon, Stethoscope, Filter, Download } from "lucide-react";

type View = 'participants' | 'campParticipants';

interface Participant {
  participant_id: number;
  full_name: string;
  aadhar_number: string;
  age: number;
  gender: string;
  phone_number: string;
  registration_source: string;
  address: string;
  created_at: string;
}

export default function HealthCampPage() {
  const [currentView, setCurrentView] = useState<View>('participants');
  
  // Participants Page State
  const [searchName, setSearchName] = useState("");
  const [searchAadhar, setSearchAadhar] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [showCampForm, setShowCampForm] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const participantsRef = useRef<HTMLDivElement>(null);

  // Participant Form state
  const [formData, setFormData] = useState({
    full_name: "",
    aadhar_number: "",
    age: "",
    gender: "",
    phone_number: "",
    registration_source: "",
    address: ""
  });

  // Camp Form state
  const [campFormData, setCampFormData] = useState({
    participant: "",
    surgerySuggested: "",
    campName: "",
    remarks: "",
    servicesPerformed: [] as string[],
    followUpNeeded: "",
    treatmentRequired: "",
    followUpDate: "",
    surgeryRequired: ""
  });

  // Camp Participants State
  const [campParticipants, setCampParticipants] = useState<any[]>([]);
  const [campFilters, setCampFilters] = useState({
    camp: "",
    treatmentRequired: "",
    surgeryRequired: "",
    followUpNeeded: "",
    allCamps: "",
    surgeryDateFrom: "",
    followUpDateFrom: "",
    surgerySuggested: "",
    servicesPerformed: ""
  });

  const campOptions = [
    "Cancer Screening",
    "Eye Camp",
    "Dental Check Up"
  ];

  const serviceOptions = [
    "Eye Check",
    "Hemoglobin Test",
    "Anemia Test",
    "Dental Check",
    "Ear Check",
    "Cancer Screening"
  ];

  // API Calls for Participants
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.jpf-portal-api.com/camp-participants');
      if (!response.ok) {
        throw new Error('Failed to fetch participants');
      }
      const data = await response.json();
      setParticipants(data);
      setFilteredParticipants(data);
    } catch (error) {
      console.error('Error fetching participants:', error);
      alert('Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };

  const createParticipant = async (participantData: any) => {
    try {
      const response = await fetch('https://api.jpf-portal-api.com/camp-participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participantData)
      });

      if (!response.ok) {
        throw new Error('Failed to create participant');
      }

      const newParticipant = await response.json();
      return newParticipant;
    } catch (error) {
      console.error('Error creating participant:', error);
      throw error;
    }
  };

  // API Calls for Camp Details
  const fetchCampDetails = async () => {
    try {
      const response = await fetch('https://api.jpf-portal-api.com/campdetails');
      if (!response.ok) {
        throw new Error('Failed to fetch camp details');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching camp details:', error);
      throw error;
    }
  };

  const createCampDetail = async (campData: any) => {
    try {
      const response = await fetch('https://api.jpf-portal-api.com/campdetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campData)
      });

      if (!response.ok) {
        throw new Error('Failed to create camp detail');
      }

      const newCampDetail = await response.json();
      return newCampDetail;
    } catch (error) {
      console.error('Error creating camp detail:', error);
      throw error;
    }
  };

  // Load participants and camp details on component mount
  useEffect(() => {
    fetchParticipants();
    loadCampDetails();
  }, []);

  const loadCampDetails = async () => {
    try {
      const data = await fetchCampDetails();
      setCampParticipants(data);
    } catch (error) {
      console.error('Error loading camp details:', error);
    }
  };

  // Participants Page Functions
  const handleSearch = () => {
    if (searchName === "" && searchAadhar === "" && searchPhone === "") {
      setFilteredParticipants(participants);
      setIsSearching(false);
      return;
    }

    const filtered = participants.filter(participant => {
      const nameMatch = participant.full_name.toLowerCase().includes(searchName.toLowerCase());
      const aadharMatch = participant.aadhar_number.includes(searchAadhar);
      const phoneMatch = participant.phone_number.includes(searchPhone);
      
      return (searchName === "" || nameMatch) && 
             (searchAadhar === "" || aadharMatch) && 
             (searchPhone === "" || phoneMatch);
    });
    setFilteredParticipants(filtered);
    setIsSearching(true);
  };

  const handleResetSearch = () => {
    setSearchName("");
    setSearchAadhar("");
    setSearchPhone("");
    setFilteredParticipants(participants);
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCampInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceCheckboxChange = (service: string) => {
    setCampFormData(prev => ({
      ...prev,
      servicesPerformed: prev.servicesPerformed.includes(service)
        ? prev.servicesPerformed.filter(s => s !== service)
        : [...prev.servicesPerformed, service]
    }));
  };

  const handleSaveParticipant = async () => {
    try {
      // Validate required fields
      if (!formData.full_name || !formData.aadhar_number || !formData.age || !formData.gender || !formData.phone_number || !formData.registration_source || !formData.address) {
        alert("Please fill in all required fields");
        return;
      }

      // Validate Aadhar number (12 digits)
      if (formData.aadhar_number.length !== 12 || !/^\d+$/.test(formData.aadhar_number)) {
        alert("Please enter a valid 12-digit Aadhar number");
        return;
      }

      // Validate phone number (10 digits)
      if (formData.phone_number.length !== 10 || !/^\d+$/.test(formData.phone_number)) {
        alert("Please enter a valid 10-digit phone number");
        return;
      }

      // Validate age
      const age = parseInt(formData.age);
      if (age < 1 || age > 120) {
        alert("Please enter a valid age");
        return;
      }

      const newParticipant = await createParticipant(formData);
      
      // Update the participants list with the new participant
      setParticipants(prev => [newParticipant, ...prev]);
      setFilteredParticipants(prev => [newParticipant, ...prev]);
      
      // Reset form and close modal
      setFormData({
        full_name: "",
        aadhar_number: "",
        age: "",
        gender: "",
        phone_number: "",
        registration_source: "",
        address: ""
      });
      setShowParticipantForm(false);
      
      alert("Participant added successfully!");
    } catch (error) {
      console.error("Error saving participant:", error);
      alert("Failed to save participant. Please try again.");
    }
  };

  const handleSaveCamp = async () => {
  try {
    // Validate required fields
    if (!campFormData.participant || !campFormData.campName || !campFormData.followUpNeeded || 
        !campFormData.treatmentRequired || !campFormData.surgeryRequired || 
        campFormData.servicesPerformed.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

    // Prepare data for backend - send services_performed as array
    const campData = {
      participant_id: parseInt(campFormData.participant),
      surgery_suggested: campFormData.surgerySuggested,
      camp_name: campFormData.campName,
      followup_needed: campFormData.followUpNeeded,
      treatment_required: campFormData.treatmentRequired,
      surgery_required: campFormData.surgeryRequired,
      followup_date: campFormData.followUpDate,
      services_performed: campFormData.servicesPerformed, // Send as array, not string
      remarks: campFormData.remarks,
    };

    console.log("Sending camp data:", campData);

    const newCampDetail = await createCampDetail(campData);
    
    // Update camp participants list
    setCampParticipants(prev => [newCampDetail, ...prev]);
    
    // Reset form and close modal
    setCampFormData({
      participant: "",
      surgerySuggested: "",
      campName: "",
      remarks: "",
      servicesPerformed: [],
      followUpNeeded: "",
      treatmentRequired: "",
      followUpDate: "",
      surgeryRequired: ""
    });
    setShowCampForm(false);
    
    alert("Camp details saved successfully!");
  } catch (error) {
    console.error("Error saving camp details:", error);
    alert("Failed to save camp details. Please try again.");
  }
};

  const handleCloseForm = () => {
    setFormData({
      full_name: "",
      aadhar_number: "",
      age: "",
      gender: "",
      phone_number: "",
      registration_source: "",
      address: ""
    });
    setShowParticipantForm(false);
  };

  const handleCloseCampForm = () => {
    setCampFormData({
      participant: "",
      surgerySuggested: "",
      campName: "",
      remarks: "",
      servicesPerformed: [],
      followUpNeeded: "",
      treatmentRequired: "",
      followUpDate: "",
      surgeryRequired: ""
    });
    setShowCampForm(false);
  };

  // Camp Participants Functions
  const handleCampFilterChange = (name: string, value: string) => {
    setCampFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetCampFilters = () => {
    setCampFilters({
      camp: "",
      treatmentRequired: "",
      surgeryRequired: "",
      followUpNeeded: "",
      allCamps: "",
      surgeryDateFrom: "",
      followUpDateFrom: "",
      surgerySuggested: "",
      servicesPerformed: ""
    });
  };

  const serviceData = [
    { label: "Eye Check", value: 0, icon: EyeIcon },
    { label: "Hemoglobin Test", value: 0, icon: TestTube },
    { label: "Anemia Test", value: 0, icon: Heart },
    { label: "Dental Check", value: 0, icon: Pill },
    { label: "Ear Check", value: 0, icon: Ear },
    { label: "Cancer Screening", value: 0, icon: Activity },
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Render Camp Participants View
  const renderCampParticipants = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Health Camp Program</h1>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button 
            onClick={() => setCurrentView('participants')}
            className="px-6 py-3 text-gray-600 bg-gray-100 font-medium mr-2 rounded-t-lg hover:bg-[#00b4d8] hover:text-white transition-colors"
          >
            Participants
          </button>
          <button className="px-6 py-3 text-white bg-[#00b4d8] font-medium rounded-t-lg">
            Camp Participants
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0077b6] flex items-center gap-2">
              <Filter size={20} />
              Filter Camp Participants
            </h2>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Camp */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Camp</label>
              <select
                value={campFilters.camp}
                onChange={(e) => handleCampFilterChange("camp", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
              >
                <option value="">Select Camp</option>
                <option value="eye-camp">Cancer Screening</option>
                <option value="eye-camp">Eye Camp</option>
                <option value="dental">Dental Check-up</option>
              </select>
            </div>

            {/* Treatment Required */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Treatment Required</label>
              <select
                value={campFilters.treatmentRequired}
                onChange={(e) => handleCampFilterChange("treatmentRequired", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="not applicable">Not Applicable</option>
              </select>
            </div>

            {/* Surgery Required */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Surgery Required</label>
              <select
                value={campFilters.surgeryRequired}
                onChange={(e) => handleCampFilterChange("surgeryRequired", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="not applicable">Not Applicable</option>
              </select>
            </div>

            {/* Follow-up Needed */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Follow-up Needed</label>
              <select
                value={campFilters.followUpNeeded}
                onChange={(e) => handleCampFilterChange("followUpNeeded", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          {/* Second Row Filters */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Surgery Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Surgery Date From</label>
              <div className="relative">
                <input
                  type="text"
                  value={campFilters.surgeryDateFrom}
                  onChange={(e) => handleCampFilterChange("surgeryDateFrom", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="dd-mm-yyyy"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            {/* Follow-up Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Follow-up Date From</label>
              <div className="relative">
                <input
                  type="text"
                  value={campFilters.followUpDateFrom}
                  onChange={(e) => handleCampFilterChange("followUpDateFrom", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  placeholder="dd-mm-yyyy"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            {/* Surgery Suggested */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Surgery Suggested</label>
              <input
                type="text"
                placeholder="Search surgery suggestions"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
              />
            </div>
          </div>

          {/* Third Row Filters */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Services Performed */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Services Performed</label>
              <select
                value={campFilters.servicesPerformed}
                onChange={(e) => handleCampFilterChange("servicesPerformed", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
              >
                <option value="">All Services</option>
                <option value="eye-check">Eye Check</option>
                <option value="dental-check">Hemoglobin Test</option>
                <option value="dental-check">Anemia Test</option>
                <option value="dental-check">Dental Check</option>
                <option value="dental-check">Ear Check</option>
                <option value="dental-check">Cancer Screening</option>
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-6"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Filter size={18} />
              Apply Filters
            </button>
            <button 
              onClick={handleResetCampFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Participant</th>
                <th className="p-3 font-semibold">Camp</th>
                <th className="p-3 font-semibold">Services</th>
                <th className="p-3 font-semibold">Treatment</th>
                <th className="p-3 font-semibold">Surgery</th>
                <th className="p-3 font-semibold">Follow-up</th>
                <th className="p-3 font-semibold">Created At</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campParticipants.map((participant) => (
                <tr key={participant.participant_id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3">{participant.id}</td>
                  <td className="p-3">{participant.participant_id}</td>
                  <td className="p-3">{participant.camp_name}</td>
                  <td className="p-3">{participant.services_performed}</td>
                  <td className="p-3">{participant.treatment_required}</td>
                  <td className="p-3">{participant.surgery_required}</td>
                  <td className="p-3">{participant.followup_needed}</td>
                  <td className="p-3">{formatDate(participant.created_at)}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="text-green-600 hover:text-green-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Participants View
  const renderParticipants = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Health Camp Program</h1>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button className="px-6 py-3 text-white bg-[#00b4d8] font-medium mr-2 rounded-t-lg">
            Participants
          </button>
          <button 
            onClick={() => setCurrentView('campParticipants')}
            className="px-6 py-3 text-gray-600 bg-gray-100 font-medium rounded-t-lg hover:bg-[#00b4d8] hover:text-white transition-colors"
          >
            Camp Participants
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Participants", value: participants.length },
            { label: "Health Camps Conducted", value: 0 },
            { label: "Total Health Checks", value: 0 },
            { label: "Treatment Required", value: 0 },
            { label: "Surgery Required", value: 0 },
            { label: "Follow-up Required", value: 0 },
            { label: "Services Performed", value: 0 },
            { label: "Participants with Surgery", value: 0 },
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
          <div className="grid grid-cols-6 text-center">
            {serviceData.map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div key={i} className="p-3">
                  <div className="flex justify-center mb-2">
                    <IconComponent size={24} className="text-[#0077b6]" />
                  </div>
                  <h3 className="text-2xl font-bold text-black">{item.value}</h3>
                  <p className="text-black text-sm font-medium">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search Section */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border border-gray-300 rounded-lg px-4 py-2.5 w-1/4 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Search by Aadhar"
            value={searchAadhar}
            onChange={(e) => setSearchAadhar(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border border-gray-300 rounded-lg px-4 py-2.5 w-1/4 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Search by Phone"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border border-gray-300 rounded-lg px-4 py-2.5 w-1/4 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
          />
          <button 
            onClick={handleSearch}
            className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <Search size={18} /> Search
          </button>
          {isSearching && (
            <button 
              onClick={handleResetSearch}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
          )}
          <button 
            onClick={() => setShowParticipantForm(true)}
            className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-6 py-2.5 rounded-lg font-medium transition-colors ml-auto flex items-center gap-2"
          >
            <User size={18} />
            Add Participant
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm mb-6 text-center">
            <p className="text-gray-600">Loading participants...</p>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div ref={participantsRef} className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4 text-[#0077b6]">Health Camp Participants</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
                  <th className="p-3 font-semibold">ID</th>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Age</th>
                  <th className="p-3 font-semibold">Gender</th>
                  <th className="p-3 font-semibold">Phone</th>
                  <th className="p-3 font-semibold">Aadhar</th>
                  <th className="p-3 font-semibold">Created At</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((participant) => (
                    <tr key={participant.participant_id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">{participant.participant_id}</td>
                      <td className="p-3">{participant.full_name}</td>
                      <td className="p-3">{participant.age}</td>
                      <td className="p-3">{participant.gender}</td>
                      <td className="p-3">{participant.phone_number}</td>
                      <td className="p-3">{participant.aadhar_number}</td>
                      <td className="p-3">{formatDate(participant.created_at)}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setShowCampForm(true)}
                            className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            + Add Camp
                          </button>
                          <button className="bg-orange-300 hover:bg-[#0096c7] text-black p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-3 text-center text-gray-500">
                      No participants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Participant Form Modal */}
      {showParticipantForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
            {/* Header */}
            <div className="bg-[#00b4d8] rounded-t-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User size={24} />
                  <h2 className="text-2xl font-bold">Add New Participant</h2>
                </div>
                <button 
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-[#0096c7] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-blue-100 mt-2">Fill in the participant details below</p>
            </div>

            {/* Form */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User size={16} className="text-[#00b4d8]" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Aadhar */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <IdCard size={16} className="text-[#00b4d8]" />
                    Aadhar Number *
                  </label>
                  <input
                    type="text"
                    name="aadhar_number"
                    value={formData.aadhar_number}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    placeholder="Enter 12-digit Aadhar"
                    maxLength={12}
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar size={16} className="text-[#00b4d8]" />
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    placeholder="Enter age"
                    min="1"
                    max="120"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Users size={16} className="text-[#00b4d8]" />
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone size={16} className="text-[#00b4d8]" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    placeholder="Enter phone number"
                    maxLength={10}
                  />
                </div>

                {/* Registration Source */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Users size={16} className="text-[#00b4d8]" />
                    Registration Source *
                  </label>
                  <select
                    name="registration_source"
                    value={formData.registration_source}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                  >
                    <option value="">Select Source</option>
                    <option value="walk-in">Walk-in</option>
                    <option value="referral">Referral</option>
                    <option value="campaign">Campaign</option>
                    <option value="government">Government</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Address - Full Width */}
                <div className="col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin size={16} className="text-[#00b4d8]" />
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all resize-none"
                    placeholder="Enter complete address"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={handleCloseForm}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSaveParticipant}
                className="flex-1 px-6 py-3 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center justify-center gap-2"
              >
                <User size={18} />
                Save Participant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Camp Form Modal */}
      {showCampForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all">
            {/* Header */}
            <div className="bg-[#00b4d8] rounded-t-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Stethoscope size={24} />
                  <h2 className="text-2xl font-bold">Add New Camp</h2>
                </div>
                <button 
                  onClick={handleCloseCampForm}
                  className="p-2 hover:bg-[#0096c7] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-blue-100 mt-2">Fill in the camp details below</p>
            </div>

            {/* Form */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                {/* Participant */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User size={16} className="text-[#00b4d8]" />
                    Participant *
                  </label>
                  <select
                    name="participant"
                    value={campFormData.participant}
                    onChange={handleCampInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                  >
                    <option value="">Select Participant</option>
                    {participants.map((participant) => (
                      <option key={participant.participant_id} value={participant.participant_id}>
                        {participant.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Surgery Suggested */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Stethoscope size={16} className="text-[#00b4d8]" />
                    Surgery Suggested
                  </label>
                  <input
                    type="text"
                    name="surgerySuggested"
                    value={campFormData.surgerySuggested}
                    onChange={handleCampInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    placeholder="Enter surgery suggestions"
                  />
                </div>

                {/* Camp Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Stethoscope size={16} className="text-[#00b4d8]" />
                    Camp Name *
                  </label>
                  <select
                    name="campName"
                    value={campFormData.campName}
                    onChange={handleCampInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                  >
                    <option value="">Select Camp</option>
                    <option value="cancer-screening">Cancer Screening</option>
                    <option value="eye-camp">Eye Camp</option>
                    <option value="dental-check-up">Dental Check Up</option>
                  </select>
                </div>

                {/* Follow-up Needed */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Users size={16} className="text-[#00b4d8]" />
                    Follow-up Needed *
                  </label>
                  <select
                    name="followUpNeeded"
                    value={campFormData.followUpNeeded}
                    onChange={handleCampInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Treatment Required */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Stethoscope size={16} className="text-[#00b4d8]" />
                    Treatment Required *
                  </label>
                  <select
                    name="treatmentRequired"
                    value={campFormData.treatmentRequired}
                    onChange={handleCampInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="not-applicable">Not Applicable</option>
                  </select>
                </div>

                {/* Surgery Required */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Stethoscope size={16} className="text-[#00b4d8]" />
                    Surgery Required *
                  </label>
                  <select
                    name="surgeryRequired"
                    value={campFormData.surgeryRequired}
                    onChange={handleCampInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="not-applicable">Not Applicable</option>
                  </select>
                </div>

                {/* Follow-up Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CalendarIcon size={16} className="text-[#00b4d8]" />
                    Follow-up Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="followUpDate"
                      value={campFormData.followUpDate}
                      onChange={handleCampInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      placeholder="dd-mm-yyyy"
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {/* Services Performed - Full Width */}
                <div className="col-span-2 space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Stethoscope size={16} className="text-[#00b4d8]" />
                    Services Performed *
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    {serviceOptions.map((service) => (
                      <label key={service} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={campFormData.servicesPerformed.includes(service)}
                          onChange={() => handleServiceCheckboxChange(service)}
                          className="w-4 h-4 text-[#00b4d8] bg-gray-100 border-gray-300 rounded focus:ring-[#00b4d8] focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Remarks - Full Width */}
                <div className="col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Stethoscope size={16} className="text-[#00b4d8]" />
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={campFormData.remarks}
                    onChange={handleCampInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all resize-none"
                    placeholder="Enter any additional remarks"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={handleCloseCampForm}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSaveCamp}
                className="flex-1 px-6 py-3 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center justify-center gap-2"
              >
                <Stethoscope size={18} />
                Save Camp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Return the appropriate view
  if (currentView === 'campParticipants') {
    return renderCampParticipants();
  }

  return renderParticipants();
}
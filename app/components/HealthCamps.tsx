


"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Eye, EyeIcon, TestTube, Heart, Pill, Ear, Activity, X, User, IdCard, Calendar, MapPin, Phone, Users, CalendarIcon, Stethoscope, Filter, Download, Edit, Trash2 } from "lucide-react";

type View = 'participants' | 'campParticipants';

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
  // New fields from participant table
  blood_checkup: boolean;
  medicine_required: string;
  medicine_name: string;
  treatment_required: string;
  surgery_required: string;
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
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const participantsRef = useRef<HTMLDivElement>(null);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

   const campTypes = ["Eye Camps", "Dental Camps", "General Health", "Cancer Screening"];

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

  // Edit Form state - Updated to include fields from participant table
  const [editFormData, setEditFormData] = useState({
    name: "",
    id: 0, 
    campName: "",
    campServices: [] as string[],
    treatmentRequired: "",
    treatmentDetails: {
      spectacles: false,
      cataract: false,
      other: false,
      otherText: ""
    },
    surgeryRequired: "",
    surgeryDetails: {
      surgeryDone: false,
      followUpDate: ""
    },
    bloodCheckup: false,
    medicineRequired: "",
    medicineName: "",
    // New fields from participant table
    blood_checkup: false,
    medicine_required: "",
    medicine_name: "",
    treatment_required: "",
    surgery_required: ""
  });

  // View Form state - Updated to include fields from participant table
  const [viewFormData, setViewFormData] = useState({
    name: "",
    campName: "",
    campServices: [] as string[],
    treatmentRequired: "",
    treatmentDetails: {
      spectacles: false,
      cataract: false,
      other: false,
      otherText: ""
    },
    surgeryRequired: "",
    surgeryDetails: {
      surgeryDone: false,
      followUpDate: ""
    },
    bloodCheckup: false,
    medicineRequired: "",
    medicineName: "",
    // New fields from participant table
    blood_checkup: false,
    medicine_required: "",
    medicine_name: "",
    treatment_required: "",
    surgery_required: ""
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

  const API_BASE_URL = "https://api.jpf-portal-api.com";
  // const API_BASE_URL = "http://localhost:5000";

  // API Calls for Participants
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/participants`);
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
      const response = await fetch(`${API_BASE_URL}/camp-participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participantData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create participant: ${errorText}`);
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
      const response = await fetch(`${API_BASE_URL}/campdetails`);
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
      const response = await fetch(`${API_BASE_URL}/campdetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create camp detail: ${errorText}`);
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
      const nameMatch = participant.name.toLowerCase().includes(searchName.toLowerCase());
      const aadharMatch = participant.aadhar.includes(searchAadhar);
      const phoneMatch = participant.phone.includes(searchPhone);
      
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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      if (name.startsWith('treatmentDetails.')) {
        const field = name.split('.')[1];
        setEditFormData(prev => ({
          ...prev,
          treatmentDetails: {
            ...prev.treatmentDetails,
            [field]: checked
          }
        }));
      } else if (name.startsWith('surgeryDetails.')) {
        const field = name.split('.')[1];
        setEditFormData(prev => ({
          ...prev,
          surgeryDetails: {
            ...prev.surgeryDetails,
            [field]: checked
          }
        }));
      } else {
        setEditFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      if (name.startsWith('treatmentDetails.')) {
        const field = name.split('.')[1];
        setEditFormData(prev => ({
          ...prev,
          treatmentDetails: {
            ...prev.treatmentDetails,
            [field]: value
          }
        }));
      } else if (name.startsWith('surgeryDetails.')) {
        const field = name.split('.')[1];
        setEditFormData(prev => ({
          ...prev,
          surgeryDetails: {
            ...prev.surgeryDetails,
            [field]: value
          }
        }));
      } else {
        setEditFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const handleServiceCheckboxChange = (service: string) => {
    setCampFormData(prev => ({
      ...prev,
      servicesPerformed: prev.servicesPerformed.includes(service)
        ? prev.servicesPerformed.filter(s => s !== service)
        : [...prev.servicesPerformed, service]
    }));
  };

  const handleUpdateParticipant = async ( editFormData: any) => {
  try {
    const updateData = {
      blood_checkup: editFormData.bloodCheckup,
      medicine_required: editFormData.medicineRequired,
      medicine_name: editFormData.medicineName,
      treatment_required: editFormData.treatmentRequired,
      surgery_required: editFormData.surgeryRequired,
    };
    const id = editFormData.id;

    console.log("Updating participant with data:", updateData);

    const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update participant: ${errorText}`);
    }

    const updatedParticipant = await response.json();
    
    // Update the participants list with the updated participant
    setParticipants(prev => 
      prev.map(p => p.id === id ? { ...p, ...updateData } : p)
    );
    setFilteredParticipants(prev => 
      prev.map(p => p.id === id ? { ...p, ...updateData } : p)
    );

    return updatedParticipant;
  } catch (error) {
    console.error('Error updating participant:', error);
    throw error;
  }
};




  const handleSaveParticipant = async () => {
    try {
      // Validate required fields
      if (!formData.full_name || !formData.aadhar_number || !formData.age || !formData.gender || !formData.phone_number || !formData.registration_source || !formData.address ) {
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

  const handleSaveEditForm = async () => {
    try {
      // Validate required fields
      if (!editFormData.treatmentRequired || !editFormData.surgeryRequired || !editFormData.medicineRequired) {
        alert("Please fill in all required fields");
        return;
      }

      // If treatment required is yes, validate at least one treatment detail is selected
      if (editFormData.treatmentRequired === "yes" && 
          !editFormData.treatmentDetails.spectacles && 
          !editFormData.treatmentDetails.cataract && 
          !editFormData.treatmentDetails.other) {
        alert("Please select at least one treatment detail");
        return;
      }

      // If treatment other is selected, validate other text
      if (editFormData.treatmentDetails.other && !editFormData.treatmentDetails.otherText) {
        alert("Please specify the other treatment");
        return;
      }

      // If medicine required is yes, validate medicine name
      if (editFormData.medicineRequired === "yes" && !editFormData.medicineName) {
        alert("Please enter medicine name");
        return;
      }

      // If surgery done is checked, validate follow-up date
      if (editFormData.surgeryDetails.surgeryDone && !editFormData.surgeryDetails.followUpDate) {
        alert("Please enter surgery follow-up date");
        return;
      }

      // Save the data to view form state
      setViewFormData(editFormData);

      const updateParticipant = await handleUpdateParticipant( editFormData );
      
      // For now, just close the form and show success message
      setShowEditForm(false);
      alert("Camp details updated successfully!");
      
    } catch (error) {
      console.error("Error saving edit form:", error);
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

  const handleCloseEditForm = () => {
    setEditFormData({
      name: "",
      id:0,
      campName: "",
      campServices: [],
      treatmentRequired: "",
      treatmentDetails: {
        spectacles: false,
        cataract: false,
        other: false,
        otherText: ""
      },
      surgeryRequired: "",
      surgeryDetails: {
        surgeryDone: false,
        followUpDate: ""
      },
      bloodCheckup: false,
      medicineRequired: "",
      medicineName: "",
      // New fields
      blood_checkup: false,
      medicine_required: "",
      medicine_name: "",
      treatment_required: "",
      surgery_required: ""
    });
    setShowEditForm(false);
  };

  const handleCloseViewForm = () => {
    setShowViewForm(false);
  };

  const handleOpenEditForm = (participant: Participant) => {
    // Pre-fill the form with participant data including new fields
    setEditFormData({
      name: participant.name,
      id:participant.id,
      campName: "Health Camp",
      campServices: ["General Checkup"],
      treatmentRequired: participant.treatment_required || "",
      treatmentDetails: {
        spectacles: false,
        cataract: false,
        other: false,
        otherText: ""
      },
      surgeryRequired: participant.surgery_required || "",
      surgeryDetails: {
        surgeryDone: false,
        followUpDate: ""
      },
      bloodCheckup: participant.blood_checkup || false,
      medicineRequired: participant.medicine_required || "",
      medicineName: participant.medicine_name || "",
      // New fields from participant table
      blood_checkup: participant.blood_checkup || false,
      medicine_required: participant.medicine_required || "",
      medicine_name: participant.medicine_name || "",
      treatment_required: participant.treatment_required || "",
      surgery_required: participant.surgery_required || ""
    });
    setShowEditForm(true);
  };

  const handleOpenViewForm = (participant: Participant) => {
    // Set view form data with the saved edit form data and participant data
    setViewFormData({
      name: participant.name,
      campName: "Health Camp",
      campServices: ["General Checkup"],
      treatmentRequired: editFormData.treatmentRequired || participant.treatment_required || "no",
      treatmentDetails: editFormData.treatmentDetails,
      surgeryRequired: editFormData.surgeryRequired || participant.surgery_required || "no",
      surgeryDetails: editFormData.surgeryDetails,
      bloodCheckup: editFormData.bloodCheckup || participant.blood_checkup || false,
      medicineRequired: editFormData.medicineRequired || participant.medicine_required || "no",
      medicineName: editFormData.medicineName || participant.medicine_name || "",
      // New fields from participant table
      blood_checkup: participant.blood_checkup || false,
      medicine_required: participant.medicine_required || "",
      medicine_name: participant.medicine_name || "",
      treatment_required: participant.treatment_required || "",
      surgery_required: participant.surgery_required || ""
    });
    setShowViewForm(true);
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
                  {/* <th className="p-3 font-semibold">Treatment</th>
                  <th className="p-3 font-semibold">Surgery</th> */}
                  <th className="p-3 font-semibold">Created At</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((participant) => (
                    <tr key={participant.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">{participant.id}</td>
                      <td className="p-3">{participant.name}</td>
                      <td className="p-3">{participant.age}</td>
                      <td className="p-3">{participant.gender}</td>
                      <td className="p-3">{participant.phone}</td>
                      <td className="p-3">{participant.aadhar}</td>
                      {/* <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          participant.treatment_required === 'yes' 
                            ? 'bg-orange-100 text-orange-800' 
                            : participant.treatment_required === 'no'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {participant.treatment_required || 'Not specified'}
                        </span>
                      </td> */}
                      {/* <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          participant.surgery_required === 'yes' 
                            ? 'bg-orange-100 text-orange-800' 
                            : participant.surgery_required === 'no'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {participant.surgery_required || 'Not specified'}
                        </span>
                      </td> */}
                      <td className="p-3">{formatDate(participant.created_at)}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleOpenViewForm(participant)}
                            className="bg-blue-300 hover:bg-blue-500 text-black p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleOpenEditForm(participant)}
                            className="bg-orange-300 hover:bg-orange-500 text-black p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="p-3 text-center text-gray-500">
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

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all">
            {/* Header */}
            <div className="bg-[#00b4d8] rounded-t-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Edit size={24} />
                  <h2 className="text-2xl font-bold">Edit Camp Details</h2>
                </div>
                <button 
                  onClick={handleCloseEditForm}
                  className="p-2 hover:bg-[#0096c7] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-blue-100 mt-2">Update camp details for participant</p>
            </div>

            {/* Form */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                {/* Name - Non Editable */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User size={16} className="text-[#00b4d8]" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                {/* Camp Name - Non Editable */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Stethoscope size={16} className="text-[#00b4d8]" />
                    Camp Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.campName}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                {/* Camp Services - Non Editable */}
                <div className="col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Activity size={16} className="text-[#00b4d8]" />
                    Camp Services
                  </label>
                  <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed">
                    {editFormData.campServices.join(", ")}
                  </div>
                </div>
                

                {/* Camp-specific Medical Information */}
                <div className="col-span-2 border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Camp-specific Medical Information</h3>
                </div>

                {/* Treatment Required */}
                <div className="col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Stethoscope size={16} className="text-[#00b4d8]" />
                    Treatment Required *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="treatmentRequired"
                        value="yes"
                        checked={editFormData.treatmentRequired === "yes"}
                        onChange={handleEditInputChange}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="treatmentRequired"
                        value="no"
                        checked={editFormData.treatmentRequired === "no"}
                        onChange={handleEditInputChange}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>

                  {/* Treatment Details - Show only if treatment required is yes */}
                  {editFormData.treatmentRequired === "yes" && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Treatment Details:</label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="treatmentDetails.spectacles"
                            checked={editFormData.treatmentDetails.spectacles}
                            onChange={handleEditInputChange}
                            className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                          />
                          <span className="text-sm text-gray-700">Spectacles</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="treatmentDetails.cataract"
                            checked={editFormData.treatmentDetails.cataract}
                            onChange={handleEditInputChange}
                            className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                          />
                          <span className="text-sm text-gray-700">Cataract</span>
                        </label>
                        <label className="flex items-center gap-2 col-span-2">
                          <input
                            type="checkbox"
                            name="treatmentDetails.other"
                            checked={editFormData.treatmentDetails.other}
                            onChange={handleEditInputChange}
                            className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                          />
                          <span className="text-sm text-gray-700 mr-2">Other:</span>
                          <input
                            type="text"
                            name="treatmentDetails.otherText"
                            value={editFormData.treatmentDetails.otherText}
                            onChange={handleEditInputChange}
                            disabled={!editFormData.treatmentDetails.other}
                            className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#00b4d8] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                            placeholder="Specify other treatment"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Surgery Required */}
                <div className="col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Stethoscope size={16} className="text-[#00b4d8]" />
                    Surgery Required *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="surgeryRequired"
                        value="yes"
                        checked={editFormData.surgeryRequired === "yes"}
                        onChange={handleEditInputChange}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="surgeryRequired"
                        value="no"
                        checked={editFormData.surgeryRequired === "no"}
                        onChange={handleEditInputChange}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>

                  {/* Surgery Details - Show only if surgery required is yes */}
                  {editFormData.surgeryRequired === "yes" && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="space-y-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="surgeryDetails.surgeryDone"
                            checked={editFormData.surgeryDetails.surgeryDone}
                            onChange={handleEditInputChange}
                            className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                          />
                          <span className="text-sm font-medium text-gray-700">Surgery Done</span>
                        </label>

                        {/* Surgery Follow-up Date - Show only if surgery done is checked */}
                        {editFormData.surgeryDetails.surgeryDone && (
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <CalendarIcon size={16} className="text-[#00b4d8]" />
                              Surgery Follow-up Date
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="surgeryDetails.followUpDate"
                                value={editFormData.surgeryDetails.followUpDate}
                                onChange={handleEditInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                                placeholder="dd-mm-yyyy"
                              />
                              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Blood Checkup */}
                <div className="col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Activity size={16} className="text-[#00b4d8]" />
                    Blood Checkup
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="bloodCheckup"
                      checked={editFormData.bloodCheckup === true}
                      onChange={handleEditInputChange}
                      className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                    />
                    <span className="text-sm text-gray-700">Blood Checkup Required</span>
                  </label>
                </div>

                {/* Medicine Required */}
                <div className="col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Pill size={16} className="text-[#00b4d8]" />
                    Medicine Required *
                  </label>
                  <div className="flex gap-6 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="medicineRequired"
                        value="yes"
                        checked={editFormData.medicineRequired === "yes"}
                        onChange={handleEditInputChange}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="medicineRequired"
                        value="no"
                        checked={editFormData.medicineRequired === "no"}
                        onChange={handleEditInputChange}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>

                  {/* Medicine Name - Show only if medicine required is yes */}
                  {editFormData.medicineRequired === "yes" && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        Medicine Name *
                      </label>
                      <input
                        type="text"
                        name="medicineName"
                        value={editFormData.medicineName}
                        onChange={handleEditInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                        placeholder="Enter medicine name"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={handleCloseEditForm}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSaveEditForm}
                className="flex-1 px-6 py-3 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center justify-center gap-2"
              >
                <Edit size={18} />
                Update Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Form Modal */}
      {showViewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all">
            {/* Header */}
            <div className="bg-[#00b4d8] rounded-t-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye size={24} />
                  <h2 className="text-2xl font-bold">Participant Details</h2>
                </div>
                <button 
                  onClick={handleCloseViewForm}
                  className="p-2 hover:bg-[#0096c7] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-blue-100 mt-2">View complete details for {viewFormData.name}</p>
            </div>

            {/* Details */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <User size={16} className="text-[#00b4d8]" />
                      Name
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mt-1">
                      {viewFormData.name}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Stethoscope size={16} className="text-[#00b4d8]" />
                      Camp Name
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mt-1">
                      {viewFormData.campName}
                    </div>
                  </div>
                </div>

                {/* Camp Services */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <Activity size={16} className="text-[#00b4d8]" />
                    Camp Services
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {viewFormData.campServices.map((service, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Medical Information from Participant Record */}
                {/* <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Information from Participant Record</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Activity size={16} className="text-[#00b4d8]" />
                        Blood Checkup
                      </div>
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-semibold mt-1 ${
                        viewFormData.blood_checkup 
                          ? "bg-orange-100 text-orange-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {viewFormData.blood_checkup ? "Yes" : "No"}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Stethoscope size={16} className="text-[#00b4d8]" />
                        Treatment Required
                      </div>
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-semibold mt-1 ${
                        viewFormData.treatment_required === "yes" 
                          ? "bg-orange-100 text-orange-800" 
                          : viewFormData.treatment_required === "no"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {viewFormData.treatment_required || "Not specified"}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Stethoscope size={16} className="text-[#00b4d8]" />
                        Surgery Required
                      </div>
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-semibold mt-1 ${
                        viewFormData.surgery_required === "yes" 
                          ? "bg-orange-100 text-orange-800" 
                          : viewFormData.surgery_required === "no"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {viewFormData.surgery_required || "Not specified"}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Pill size={16} className="text-[#00b4d8]" />
                        Medicine Required
                      </div>
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-semibold mt-1 ${
                        viewFormData.medicine_required === "yes" 
                          ? "bg-orange-100 text-orange-800" 
                          : viewFormData.medicine_required === "no"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {viewFormData.medicine_required || "Not specified"}
                      </div>
                    </div>
                  </div> */}

                  {/* {viewFormData.medicine_name && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-sm font-medium text-gray-700 mb-2">Medicine Details from Participant Record:</div>
                      <div className="flex items-center gap-2">
                        <Pill size={16} className="text-[#00b4d8]" />
                        <span className="text-sm text-gray-600">Medicine Name:</span>
                        <span className="text-sm text-gray-800 font-medium ml-1">
                          {viewFormData.medicine_name}
                        </span>
                      </div>
                    </div>
                  )}
                </div> */}

                {/* Camp-specific Medical Information */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Camp-specific Medical Information</h3>

                  {/* Treatment Required */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Stethoscope size={16} className="text-[#00b4d8]" />
                      Treatment Required
                    </div>
                    <div className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-semibold mt-1 ${
                      viewFormData.treatmentRequired === "yes" 
                        ? "bg-orange-100 text-orange-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {viewFormData.treatmentRequired === "yes" ? "Yes" : "No"}
                    </div>

                    {viewFormData.treatmentRequired === "yes" && viewFormData.treatmentDetails && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm font-medium text-gray-700 mb-3">Treatment Details:</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${viewFormData.treatmentDetails.spectacles ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className="text-sm text-gray-600">Spectacles</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${viewFormData.treatmentDetails.cataract ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className="text-sm text-gray-600">Cataract</span>
                          </div>
                          {viewFormData.treatmentDetails.other && (
                            <div className="flex items-center gap-2 col-span-2">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              <span className="text-sm text-gray-600 mr-2">Other:</span>
                              <span className="text-sm text-gray-800 font-medium">
                                {viewFormData.treatmentDetails.otherText || "Not specified"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Surgery Required */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Stethoscope size={16} className="text-[#00b4d8]" />
                      Surgery Required
                    </div>
                    <div className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-semibold mt-1 ${
                      viewFormData.surgeryRequired === "yes" 
                        ? "bg-orange-100 text-orange-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {viewFormData.surgeryRequired === "yes" ? "Yes" : "No"}
                    </div>

                    {viewFormData.surgeryRequired === "yes" && viewFormData.surgeryDetails && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm font-medium text-gray-700 mb-3">Surgery Details:</div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${viewFormData.surgeryDetails.surgeryDone ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className="text-sm text-gray-600">Surgery Completed</span>
                          </div>
                          {viewFormData.surgeryDetails.followUpDate && (
                            <div className="flex items-center gap-2">
                              <CalendarIcon size={16} className="text-[#00b4d8]" />
                              <span className="text-sm text-gray-600">Follow-up Date:</span>
                              <span className="text-sm text-gray-800 font-medium ml-1">
                                {viewFormData.surgeryDetails.followUpDate}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Blood Checkup */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Activity size={16} className="text-[#00b4d8]" />
                      Blood Checkup
                    </div>
                    <div className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-semibold mt-1 ${
                      viewFormData.bloodCheckup 
                        ? "bg-orange-100 text-orange-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {viewFormData.bloodCheckup ? "Required" : "Not Required"}
                    </div>
                  </div>

                  {/* Medicine Required */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Pill size={16} className="text-[#00b4d8]" />
                      Medicine Required
                    </div>
                    <div className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-semibold mt-1 ${
                      viewFormData.medicineRequired === "yes" 
                        ? "bg-orange-100 text-orange-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {viewFormData.medicineRequired === "yes" ? "Yes" : "No"}
                    </div>

                    {viewFormData.medicineRequired === "yes" && viewFormData.medicineName && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm font-medium text-gray-700 mb-2">Medicine Details:</div>
                        <div className="flex items-center gap-2">
                          <Pill size={16} className="text-[#00b4d8]" />
                          <span className="text-sm text-gray-600">Medicine Name:</span>
                          <span className="text-sm text-gray-800 font-medium ml-1">
                            {viewFormData.medicineName}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Button */}
            <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={handleCloseViewForm}
                className="flex-1 px-6 py-3 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors"
              >
                Close
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
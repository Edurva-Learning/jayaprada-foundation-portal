"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Eye, TestTube, Heart, Pill, Ear, Activity, X, User, IdCard, Calendar, MapPin, Phone, Users, CalendarIcon, Stethoscope, Edit } from "lucide-react";

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
}

// Separate interfaces for each checkup type's treatment details
interface EyeTreatmentDetails {
  spectacles: boolean;
  cataract: boolean;
  pterygium: boolean;
  other: boolean;
  otherText: string;
}

interface DentalTreatmentDetails {
  cleaning: boolean;
  filling: boolean;
  extraction: boolean;
  rootCanal: boolean;
  other: boolean;
  otherText: string;
}

interface CancerTreatmentDetails {
  oral: boolean;
  breast: boolean;
  cervical: boolean;
  prostate: boolean;
  other: boolean;
  otherText: string;
}

interface GeneralTreatmentDetails {
  bp: boolean;
  sugar: boolean;
  ecg: boolean;
  xray: boolean;
  other: boolean;
  otherText: string;
}

// Base checkup data interface
interface BaseCheckupData {
  treatmentRequired: string;
  surgeryRequired: string;
  surgeryDetails: {
    surgeryDone: boolean;
    followUpDate: string;
  };
  bloodCheckup: boolean;
  medicineRequired: string;
  medicineName: string;
}

// Specific checkup data interfaces
interface EyeCheckupData extends BaseCheckupData {
  treatmentDetails: EyeTreatmentDetails;
}

interface DentalCheckupData extends BaseCheckupData {
  treatmentDetails: DentalTreatmentDetails;
}

interface CancerCheckupData extends BaseCheckupData {
  treatmentDetails: CancerTreatmentDetails;
}

interface GeneralCheckupData extends BaseCheckupData {
  treatmentDetails: GeneralTreatmentDetails;
}

interface EditFormData {
  name: string;
  id: number;
  campName: string;
  activeTab: "eye" | "dental" | "cancer" | "general";
  eyeCheckup: EyeCheckupData;
  dentalCheckup: DentalCheckupData;
  cancerCheckup: CancerCheckupData;
  generalCheckup: GeneralCheckupData;
}

export default function HealthCampPage() {
  // Participants Page State
  const [searchName, setSearchName] = useState("");
  const [searchAadhar, setSearchAadhar] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const participantsRef = useRef<HTMLDivElement>(null);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  // Initial checkup data templates for each type
  const initialEyeCheckupData: EyeCheckupData = {
    treatmentRequired: "",
    treatmentDetails: {
      spectacles: false,
      cataract: false,
      pterygium: false,
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
    medicineName: ""
  };

  const initialDentalCheckupData: DentalCheckupData = {
    treatmentRequired: "",
    treatmentDetails: {
      cleaning: false,
      filling: false,
      extraction: false,
      rootCanal: false,
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
    medicineName: ""
  };

  const initialCancerCheckupData: CancerCheckupData = {
    treatmentRequired: "",
    treatmentDetails: {
      oral: false,
      breast: false,
      cervical: false,
      prostate: false,
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
    medicineName: ""
  };

  const initialGeneralCheckupData: GeneralCheckupData = {
    treatmentRequired: "",
    treatmentDetails: {
      bp: false,
      sugar: false,
      ecg: false,
      xray: false,
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
    medicineName: ""
  };

  // Edit Form state
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: "",
    id: 0,
    campName: "",
    activeTab: "eye",
    eyeCheckup: { ...initialEyeCheckupData },
    dentalCheckup: { ...initialDentalCheckupData },
    cancerCheckup: { ...initialCancerCheckupData },
    generalCheckup: { ...initialGeneralCheckupData }
  });

  // View Form state
  const [viewFormData, setViewFormData] = useState({
    name: "",
    campName: "",
    activeTab: "eye",
    eyeCheckup: { ...initialEyeCheckupData },
    dentalCheckup: { ...initialDentalCheckupData },
    cancerCheckup: { ...initialCancerCheckupData },
    generalCheckup: { ...initialGeneralCheckupData },
    blood_checkup: false,
    medicine_required: "",
    medicine_name: "",
    treatment_required: "",
    surgery_required: ""
  });

  const API_BASE_URL = "https://api.jpf-portal-api.com";

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
      setErrorMessage('Failed to fetch participants');
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

  // Load participants on component mount
  useEffect(() => {
    fetchParticipants();
  }, []);

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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const activeTab = editFormData.activeTab;

    setEditFormData(prev => {
      const updated = { ...prev };
      
      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        
        if (name.includes('.')) {
          const [parent, child] = name.split('.');
          const currentTab = updated[`${activeTab}Checkup` as keyof EditFormData] as any;
          if (currentTab && parent in currentTab && child in currentTab[parent]) {
            currentTab[parent][child] = checked;
          }
        } else {
          const currentTab = updated[`${activeTab}Checkup` as keyof EditFormData] as any;
          if (currentTab && name in currentTab) {
            currentTab[name] = checked;
          }
        }
      } else {
        if (name.includes('.')) {
          const [parent, child] = name.split('.');
          const currentTab = updated[`${activeTab}Checkup` as keyof EditFormData] as any;
          if (currentTab && parent in currentTab && child in currentTab[parent]) {
            currentTab[parent][child] = value;
          }
        } else if (name === 'activeTab') {
          updated.activeTab = value as "eye" | "dental" | "cancer" | "general";
        } else {
          const currentTab = updated[`${activeTab}Checkup` as keyof EditFormData] as any;
          if (currentTab && name in currentTab) {
            currentTab[name] = value;
          }
        }
      }
      
      return updated;
    });
  };

  const handleUpdateParticipant = async (formData: EditFormData) => {
    try {
      const activeTab = formData.activeTab;
      const currentTabData = formData[`${activeTab}Checkup` as keyof EditFormData] as any;

      const updateData = {
        blood_checkup: currentTabData.bloodCheckup,
        medicine_required: currentTabData.medicineRequired,
        medicine_name: currentTabData.medicineName,
        treatment_required: currentTabData.treatmentRequired,
        surgery_required: currentTabData.surgeryRequired,
      };
      const id = formData.id;

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
      if (!formData.full_name || !formData.aadhar_number || !formData.age || !formData.gender || !formData.phone_number || !formData.registration_source || !formData.address ) {
        setErrorMessage("Please fill in all required fields");
        return;
      }

      if (formData.aadhar_number.length !== 12 || !/^\d+$/.test(formData.aadhar_number)) {
        setErrorMessage("Please enter a valid 12-digit Aadhar number");
        return;
      }

      if (formData.phone_number.length !== 10 || !/^\d+$/.test(formData.phone_number)) {
        setErrorMessage("Please enter a valid 10-digit phone number");
        return;
      }

      const age = parseInt(formData.age);
      if (age < 1 || age > 120) {
        setErrorMessage("Please enter a valid age");
        return;
      }

      const newParticipant = await createParticipant(formData);
      
      setParticipants(prev => [newParticipant, ...prev]);
      setFilteredParticipants(prev => [newParticipant, ...prev]);
      
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
      
      setSuccessMessage("Participant added successfully!");
    } catch (error) {
      console.error("Error saving participant:", error);
      setErrorMessage("Failed to save participant. Please try again.");
    }
  };

  const handleSaveEditForm = async () => {
    try {
      const activeTab = editFormData.activeTab;
      const currentTabData = editFormData[`${activeTab}Checkup` as keyof EditFormData] as any;

      // Validation
      if (!currentTabData.treatmentRequired || !currentTabData.surgeryRequired || !currentTabData.medicineRequired) {
        setErrorMessage("Please fill in all required fields");
        return;
      }

      if (currentTabData.medicineRequired === "yes" && !currentTabData.medicineName) {
        setErrorMessage("Please enter medicine name");
        return;
      }

      if (currentTabData.surgeryDetails.surgeryDone && !currentTabData.surgeryDetails.followUpDate) {
        setErrorMessage("Please enter surgery follow-up date");
        return;
      }

      await handleUpdateParticipant(editFormData);
      
      setShowEditForm(false);
      setSuccessMessage("Camp details updated successfully!");
      
    } catch (error) {
      console.error("Error saving edit form:", error);
      setErrorMessage("Failed to save camp details. Please try again.");
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

  const handleCloseEditForm = () => {
    setEditFormData({
      name: "",
      id: 0,
      campName: "",
      activeTab: "eye",
      eyeCheckup: { ...initialEyeCheckupData },
      dentalCheckup: { ...initialDentalCheckupData },
      cancerCheckup: { ...initialCancerCheckupData },
      generalCheckup: { ...initialGeneralCheckupData }
    });
    setShowEditForm(false);
  };

  const handleCloseViewForm = () => {
    setShowViewForm(false);
  };

  const handleOpenEditForm = (participant: Participant) => {
    setEditFormData({
      name: participant.name,
      id: participant.id,
      campName: "Health Camp",
      activeTab: "eye",
      eyeCheckup: {
        treatmentRequired: participant.treatment_required || "",
        treatmentDetails: {
          spectacles: false,
          cataract: false,
          pterygium: false,
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
        medicineName: participant.medicine_name || ""
      },
      dentalCheckup: {
        treatmentRequired: participant.treatment_required || "",
        treatmentDetails: {
          cleaning: false,
          filling: false,
          extraction: false,
          rootCanal: false,
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
        medicineName: participant.medicine_name || ""
      },
      cancerCheckup: {
        treatmentRequired: participant.treatment_required || "",
        treatmentDetails: {
          oral: false,
          breast: false,
          cervical: false,
          prostate: false,
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
        medicineName: participant.medicine_name || ""
      },
      generalCheckup: {
        treatmentRequired: participant.treatment_required || "",
        treatmentDetails: {
          bp: false,
          sugar: false,
          ecg: false,
          xray: false,
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
        medicineName: participant.medicine_name || ""
      }
    });
    setShowEditForm(true);
  };

  const handleOpenViewForm = (participant: Participant) => {
    setViewFormData({
      name: participant.name,
      campName: "Health Camp",
      activeTab: "eye",
      eyeCheckup: {
        treatmentRequired: participant.treatment_required || "",
        treatmentDetails: {
          spectacles: false,
          cataract: false,
          pterygium: false,
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
        medicineName: participant.medicine_name || ""
      },
      dentalCheckup: {
        treatmentRequired: participant.treatment_required || "",
        treatmentDetails: {
          cleaning: false,
          filling: false,
          extraction: false,
          rootCanal: false,
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
        medicineName: participant.medicine_name || ""
      },
      cancerCheckup: {
        treatmentRequired: participant.treatment_required || "",
        treatmentDetails: {
          oral: false,
          breast: false,
          cervical: false,
          prostate: false,
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
        medicineName: participant.medicine_name || ""
      },
      generalCheckup: {
        treatmentRequired: participant.treatment_required || "",
        treatmentDetails: {
          bp: false,
          sugar: false,
          ecg: false,
          xray: false,
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
        medicineName: participant.medicine_name || ""
      },
      blood_checkup: participant.blood_checkup || false,
      medicine_required: participant.medicine_required || "",
      medicine_name: participant.medicine_name || "",
      treatment_required: participant.treatment_required || "",
      surgery_required: participant.surgery_required || ""
    });
    setShowViewForm(true);
  };

  const serviceData = [
    { label: "Eye Check", value: 0, icon: Eye },
    { label: "Hemoglobin Test", value: 0, icon: TestTube },
    { label: "Anemia Test", value: 0, icon: Heart },
    { label: "Dental Check", value: 0, icon: Pill },
    { label: "Ear Check", value: 0, icon: Ear },
    { label: "Cancer Screening", value: 0, icon: Activity },
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Type-safe helper functions to get treatment details
  const getEyeTreatmentDetails = (data: any): EyeTreatmentDetails => {
    return data.treatmentDetails as EyeTreatmentDetails;
  };

  const getDentalTreatmentDetails = (data: any): DentalTreatmentDetails => {
    return data.treatmentDetails as DentalTreatmentDetails;
  };

  const getCancerTreatmentDetails = (data: any): CancerTreatmentDetails => {
    return data.treatmentDetails as CancerTreatmentDetails;
  };

  const getGeneralTreatmentDetails = (data: any): GeneralTreatmentDetails => {
    return data.treatmentDetails as GeneralTreatmentDetails;
  };

  // Fixed radio button handler
  const handleRadioChange = (field: string, value: string) => {
    setEditFormData(prev => {
      const updated = { ...prev };
      const activeTab = updated.activeTab;
      const currentTab = updated[`${activeTab}Checkup` as keyof EditFormData] as any;
      
      if (currentTab && field in currentTab) {
        currentTab[field] = value;
      }
      
      return updated;
    });
  };

  // Fixed checkbox handler for treatment details
  const handleTreatmentDetailChange = (field: string, checked: boolean) => {
    setEditFormData(prev => {
      const updated = { ...prev };
      const activeTab = updated.activeTab;
      const currentTab = updated[`${activeTab}Checkup` as keyof EditFormData] as any;
      
      if (currentTab && currentTab.treatmentDetails && field in currentTab.treatmentDetails) {
        currentTab.treatmentDetails[field] = checked;
      }
      
      return updated;
    });
  };

  // Fixed text input handler for treatment details
  const handleTreatmentDetailTextChange = (field: string, value: string) => {
    setEditFormData(prev => {
      const updated = { ...prev };
      const activeTab = updated.activeTab;
      const currentTab = updated[`${activeTab}Checkup` as keyof EditFormData] as any;
      
      if (currentTab && currentTab.treatmentDetails && field in currentTab.treatmentDetails) {
        currentTab.treatmentDetails[field] = value;
      }
      
      return updated;
    });
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    const activeTab = editFormData.activeTab;
    
    let currentTabData;
    switch (activeTab) {
      case "eye":
        currentTabData = editFormData.eyeCheckup;
        break;
      case "dental":
        currentTabData = editFormData.dentalCheckup;
        break;
      case "cancer":
        currentTabData = editFormData.cancerCheckup;
        break;
      case "general":
        currentTabData = editFormData.generalCheckup;
        break;
      default:
        currentTabData = null;
    }

    if (!currentTabData) {
      return <div className="text-red-500 p-4">Error: Tab data not found for {activeTab} checkup</div>;
    }

    return (
      <div className="space-y-6">
        {/* Treatment Required */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Stethoscope size={16} className="text-[#00b4d8]" />
            Treatment Required *
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`treatmentRequired-${activeTab}`}
                value="yes"
                checked={currentTabData.treatmentRequired === "yes"}
                onChange={(e) => handleRadioChange('treatmentRequired', e.target.value)}
                className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`treatmentRequired-${activeTab}`}
                value="no"
                checked={currentTabData.treatmentRequired === "no"}
                onChange={(e) => handleRadioChange('treatmentRequired', e.target.value)}
                className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>

          {/* Treatment Details - Show only if treatment required is yes */}
          {currentTabData.treatmentRequired === "yes" && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {activeTab === "eye" && "Eye Treatment Details:"}
                {activeTab === "dental" && "Dental Treatment Details:"}
                {activeTab === "cancer" && "Cancer Screening Details:"}
                {activeTab === "general" && "General Checkup Details:"}
              </label>
              <div className="grid grid-cols-2 gap-4">
                {activeTab === "eye" && (
                  <>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getEyeTreatmentDetails(currentTabData).spectacles}
                        onChange={(e) => handleTreatmentDetailChange('spectacles', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Spectacles</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getEyeTreatmentDetails(currentTabData).cataract}
                        onChange={(e) => handleTreatmentDetailChange('cataract', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Cataract</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getEyeTreatmentDetails(currentTabData).pterygium}
                        onChange={(e) => handleTreatmentDetailChange('pterygium', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Pterygium</span>
                    </label>
                  </>
                )}
                {activeTab === "dental" && (
                  <>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getDentalTreatmentDetails(currentTabData).cleaning}
                        onChange={(e) => handleTreatmentDetailChange('cleaning', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Cleaning</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getDentalTreatmentDetails(currentTabData).filling}
                        onChange={(e) => handleTreatmentDetailChange('filling', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Filling</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getDentalTreatmentDetails(currentTabData).extraction}
                        onChange={(e) => handleTreatmentDetailChange('extraction', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Extraction</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getDentalTreatmentDetails(currentTabData).rootCanal}
                        onChange={(e) => handleTreatmentDetailChange('rootCanal', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Root Canal</span>
                    </label>
                  </>
                )}

                {activeTab === "cancer" && (
                  <>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getCancerTreatmentDetails(currentTabData).oral}
                        onChange={(e) => handleTreatmentDetailChange('oral', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Oral Cancer</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getCancerTreatmentDetails(currentTabData).breast}
                        onChange={(e) => handleTreatmentDetailChange('breast', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Breast Cancer</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getCancerTreatmentDetails(currentTabData).cervical}
                        onChange={(e) => handleTreatmentDetailChange('cervical', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Cervical Cancer</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getCancerTreatmentDetails(currentTabData).prostate}
                        onChange={(e) => handleTreatmentDetailChange('prostate', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Prostate Cancer</span>
                    </label>
                  </>
                )}
                {activeTab === "general" && (
                  <>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getGeneralTreatmentDetails(currentTabData).bp}
                        onChange={(e) => handleTreatmentDetailChange('bp', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Blood Pressure</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getGeneralTreatmentDetails(currentTabData).sugar}
                        onChange={(e) => handleTreatmentDetailChange('sugar', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">Sugar Test</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getGeneralTreatmentDetails(currentTabData).ecg}
                        onChange={(e) => handleTreatmentDetailChange('ecg', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">ECG</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getGeneralTreatmentDetails(currentTabData).xray}
                        onChange={(e) => handleTreatmentDetailChange('xray', e.target.checked)}
                        className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm text-gray-700">X-Ray</span>
                    </label>
                  </>
                )}
                <label className="flex items-center gap-2 col-span-2">
                  <input
                    type="checkbox"
                    checked={currentTabData.treatmentDetails.other}
                    onChange={(e) => handleTreatmentDetailChange('other', e.target.checked)}
                    className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                  />
                  <span className="text-sm text-gray-700 mr-2">Other:</span>
                  <input
                    type="text"
                    value={currentTabData.treatmentDetails.otherText}
                    onChange={(e) => handleTreatmentDetailTextChange('otherText', e.target.value)}
                    disabled={!currentTabData.treatmentDetails.other}
                    className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#00b4d8] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                    placeholder="Specify other treatment"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Surgery Required */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Stethoscope size={16} className="text-[#00b4d8]" />
            Surgery Required *
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`surgeryRequired-${activeTab}`}
                value="yes"
                checked={currentTabData.surgeryRequired === "yes"}
                onChange={(e) => handleRadioChange('surgeryRequired', e.target.value)}
                className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`surgeryRequired-${activeTab}`}
                value="no"
                checked={currentTabData.surgeryRequired === "no"}
                onChange={(e) => handleRadioChange('surgeryRequired', e.target.value)}
                className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>

          {/* Surgery Details - Show only if surgery required is yes */}
          {currentTabData.surgeryRequired === "yes" && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="surgeryDetails.surgeryDone"
                    checked={currentTabData.surgeryDetails.surgeryDone}
                    onChange={handleEditInputChange}
                    className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
                  />
                  <span className="text-sm font-medium text-gray-700">Surgery Done</span>
                </label>

                {/* Surgery Follow-up Date - Show only if surgery done is checked */}
                {currentTabData.surgeryDetails.surgeryDone && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <CalendarIcon size={16} className="text-[#00b4d8]" />
                      Surgery Follow-up Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="surgeryDetails.followUpDate"
                        value={currentTabData.surgeryDetails.followUpDate}
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
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Activity size={16} className="text-[#00b4d8]" />
            Blood Checkup
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="bloodCheckup"
              checked={currentTabData.bloodCheckup == true}
              onChange={handleEditInputChange}
              className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
            />
            <span className="text-sm text-gray-700">Blood Checkup Required</span>
          </label>
        </div>

        {/* Medicine Required */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Pill size={16} className="text-[#00b4d8]" />
            Medicine Required *
          </label>
          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`medicineRequired-${activeTab}`}
                value="yes"
                checked={currentTabData.medicineRequired === "yes"}
                onChange={(e) => handleRadioChange('medicineRequired', e.target.value)}
                className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`medicineRequired-${activeTab}`}
                value="no"
                checked={currentTabData.medicineRequired === "no"}
                onChange={(e) => handleRadioChange('medicineRequired', e.target.value)}
                className="w-4 h-4 text-[#00b4d8] focus:ring-[#00b4d8]"
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>

          {/* Medicine Name - Show only if medicine required is yes */}
          {currentTabData.medicineRequired === "yes" && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                Medicine Name *
              </label>
              <input
                type="text"
                name="medicineName"
                value={currentTabData.medicineName}
                onChange={handleEditInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                placeholder="Enter medicine name"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Health Camp Program</h1>

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
                    <tr key={participant.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">{participant.id}</td>
                      <td className="p-3">{participant.name}</td>
                      <td className="p-3">{participant.age}</td>
                      <td className="p-3">{participant.gender}</td>
                      <td className="p-3">{participant.phone}</td>
                      <td className="p-3">{participant.aadhar}</td>
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

                {/* Tabs */}
                <div className="col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Activity size={16} className="text-[#00b4d8]" />
                    Checkup Type
                  </label>
                  <div className="flex border-b border-gray-200">
                    {[
                      { id: "eye", label: "Eye Checkup" },
                      { id: "dental", label: "Dental Checkup" },
                      { id: "cancer", label: "Cancer Screening" },
                      { id: "general", label: "General Checkup" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setEditFormData(prev => ({ ...prev, activeTab: tab.id as any }))}
                        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                          editFormData.activeTab === tab.id
                            ? "border-b-2 border-[#00b4d8] text-[#00b4d8]"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Tab Content */}
                <div className="col-span-2 border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {editFormData.activeTab === "eye" && "Eye Checkup Details"}
                    {editFormData.activeTab === "dental" && "Dental Checkup Details"}
                    {editFormData.activeTab === "cancer" && "Cancer Screening Details"}
                    {editFormData.activeTab === "general" && "General Checkup Details"}
                  </h3>
                  {renderTabContent()}
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

                {/* Camp-specific Medical Information */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Camp-specific Medical Information</h3>

                  {/* Blood Checkup */}
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
                      {viewFormData.blood_checkup ? "Required" : "Not Required"}
                    </div>
                  </div>

                  {/* Display basic medical information */}
                  <div className="mt-6 space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Stethoscope size={16} className="text-[#00b4d8]" />
                        Treatment Required
                      </div>
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-semibold mt-1 ${
                        viewFormData.treatment_required === "yes" 
                          ? "bg-orange-100 text-orange-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {viewFormData.treatment_required === "yes" ? "Yes" : "No"}
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
                          : "bg-green-100 text-green-800"
                      }`}>
                        {viewFormData.surgery_required === "yes" ? "Yes" : "No"}
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
                          : "bg-green-100 text-green-800"
                      }`}>
                        {viewFormData.medicine_required === "yes" ? "Yes" : "No"}
                      </div>
                    </div>

                    {viewFormData.medicine_required === "yes" && viewFormData.medicine_name && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                          <Pill size={16} className="text-[#00b4d8]" />
                          Medicine Name
                        </div>
                        <div className="text-lg font-semibold text-gray-800 mt-1">
                          {viewFormData.medicine_name}
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
}
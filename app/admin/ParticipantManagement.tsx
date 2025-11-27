'use client'; 
import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Trash2, Plus, X, Eye, Search, User, Pill } from 'lucide-react';

interface Participant {
  id: number;
  name: string;
  aadhar: string;
  age: number;
  gender: string;
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
}

interface Camp {
  id: number;
  camp_name: string;
  date: string;
  location: string;
  services: string;
  status: string;
}

const ParticipantManagement: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchAadhar, setSearchAadhar] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<string>('');
  const [aadharSuggestions, setAadharSuggestions] = useState<Participant[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const aadharInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    aadhar: '',
    age: '',
    gender: 'Male',
    phone: '',
    address: '',
    state: '',
    district: '',
    assemblyconstituency: '',
    mandal: '',
    village: '',
    pincode: '',
    house_no: '',
    registration_source: '',
    blood_checkup: false,
    medicine_required: '',
    medicine_name: '',
    treatment_required: '',
    camp_category: '',
    eye_services: [] as string[],
    dental_services: [] as string[],
    cancer_services: [] as string[],
    general_services: [] as string[],
    // Eye examination fields
    eye_visual_acuity_left: '',
    eye_visual_acuity_right: '',
    eye_diagnosis: '',
    eye_identified_issues: '',
    eye_spectacles_recommended: false,
    eye_surgery_recommended: false,
    eye_follow_up_date: '',
    eye_additional_notes: '',
    eye_had_existing_spectacles: false,
    eye_vision_correction_required: false,
    eye_specify_vision_correction: false,
    eye_spectacles_provided: false,
    eye_spectacles_provided_date: '',
    eye_surgery_type: '',
    eye_surgery_prerequisites: '',
    eye_surgery_scheduled_date: '',
    eye_surgery_performed: false,
    eye_spectacles_advised_post_surgery: false,
    eye_post_surgery_follow_up: '',
    // Dental examination fields
    dental_oral_hygiene_status: '',
    dental_caries_present: false,
    dental_gum_disease_present: false,
    dental_tooth_extraction_recommended: false,
    dental_filling_recommended: false,
    dental_tooth_extraction_performed: false,
    dental_filling_performed: false,
    dental_root_canal_recommended: false,
    dental_dentures_recommended: false,
    dental_root_canal_performed: false,
    dental_dentures_provided: false,
    dental_follow_up_date: '',
    dental_additional_notes: '',
    dental_auditor: '',
    camp_id: '',
    // General Health Examination fields
    general_height: '',
    general_weight: '',
    general_bmi: '',
    general_bsa: '',
    general_blood_pressure_systolic: '',
    general_blood_pressure_diastolic: '',
    general_presenting_complaints: '',
    general_examination_remarks: '',
    general_recommendations: '',
    // Blood Test fields
    blood_haemoglobin: '',
    blood_random_sugar: '',
    blood_other_information: '',
    blood_auditor: '',
    // Cancer Screening fields
    cancer_oral: false,
    cancer_breast: false,
    cancer_cervical: false,
    cancer_prostate: false,
    cancer_other: false,
    cancer_other_details: '',
    cancer_findings: '',
    cancer_recommendations: '',
    cancer_follow_up_date: '',
    // Medicine fields for each tab
    general_medicine_required: false,
    general_medicine_name: '',
    blood_medicine_required: false,
    blood_medicine_name: '',
    eye_medicine_required: false,
    eye_medicine_name: '',
    dental_medicine_required: false,
    dental_medicine_name: '',
    cancer_medicine_required: false,
    cancer_medicine_name: ''
  });

  const API_BASE_URL = 'https://api.jpf-portal-api.com';

  const eyeServices = ['Spectacles', 'Cataract', 'Pterygium', 'Other'];
  const dentalServices = ['Cleaning', 'Filling', 'Extraction', 'Root Canal', 'Other'];
  const cancerServices = ['Oral Cancer', 'Breast Cancer', 'Cervical Cancer', 'Prostate Cancer', 'Other'];
  const generalServices = ['Blood Pressure', 'Sugar Test', 'ECG', 'X-Ray', 'Other'];
  const surgeryTypes = ['Cataract Surgery', 'LASIK', 'Glaucoma Surgery', 'Retinal Surgery', 'Other'];

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          aadharInputRef.current && !aadharInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate BMI and BSA when height or weight changes
  useEffect(() => {
    if (formData.general_height && formData.general_weight) {
      const heightInMeters = parseFloat(formData.general_height) / 100;
      const weight = parseFloat(formData.general_weight);
      
      // Calculate BMI
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      
      // Calculate BSA (Mosteller formula)
      const bsa = Math.sqrt((parseFloat(formData.general_height) * weight) / 3600).toFixed(2);
      
      setFormData(prev => ({
        ...prev,
        general_bmi: bmi,
        general_bsa: bsa
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        general_bmi: '',
        general_bsa: ''
      }));
    }
  }, [formData.general_height, formData.general_weight]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/participants`);
      const data = await res.json();
      setParticipants(data);
      setFilteredParticipants(data);
    } catch (err) {
      console.error('Error fetching participants:', err);
      showError('Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };

  const fetchCamps = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/camps`);
      const data = await res.json();
      setCamps(data);
    } catch (err) {
      console.error('Error fetching camps:', err);
    }
  };

  useEffect(() => {
    fetchParticipants();
    fetchCamps();
  }, []);

  useEffect(() => {
    const addressParts = [];
    
    if (formData.house_no) addressParts.push(`H.No: ${formData.house_no}`);
    if (formData.village) addressParts.push(`Village: ${formData.village}`);
    if (formData.mandal) addressParts.push(`Mandal: ${formData.mandal}`);
    if (formData.district) addressParts.push(`District: ${formData.district}`);
    if (formData.assemblyconstituency) addressParts.push(`Constituency: ${formData.assemblyconstituency}`);
    if (formData.state) addressParts.push(`State: ${formData.state}`);
    if (formData.pincode) addressParts.push(`Pincode: ${formData.pincode}`);
    
    const generatedAddress = addressParts.join(', ');
    
    if (generatedAddress) {
      setFormData(prev => ({
        ...prev,
        address: generatedAddress
      }));
    }
  }, [
    formData.house_no,
    formData.village,
    formData.mandal,
    formData.district,
    formData.assemblyconstituency,
    formData.state,
    formData.pincode
  ]);

  // Handle Aadhar input change for suggestions
  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, aadhar: value }));

    if (value.length >= 4) {
      const filtered = participants.filter(participant =>
        participant.aadhar.includes(value)
      );
      setAadharSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setAadharSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (participant: Participant) => {
    setFormData({
      ...formData,
      name: participant.name,
      aadhar: participant.aadhar,
      age: participant.age.toString(),
      gender: participant.gender,
      phone: participant.phone,
      address: participant.address,
      state: participant.state,
      district: participant.district,
      assemblyconstituency: participant.assemblyconstituency,
      mandal: participant.mandal,
      village: participant.village,
      pincode: participant.pincode,
      house_no: participant.house_no || '',
      registration_source: participant.registration_source,
      blood_checkup: participant.blood_checkup,
      medicine_required: participant.medicine_required,
      medicine_name: participant.medicine_name,
      treatment_required: participant.treatment_required
    });
    setAadharSuggestions([]);
    setShowSuggestions(false);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setFormData(prev => ({
      ...prev,
      camp_category: tab
    }));
  };

  const handleSearch = () => {
    if (searchName === '' && searchAadhar === '' && searchPhone === '') {
      setFilteredParticipants(participants);
      return;
    }

    const filtered = participants.filter(participant => {
      const nameMatch = participant.name.toLowerCase().includes(searchName.toLowerCase());
      const aadharMatch = participant.aadhar.includes(searchAadhar);
      const phoneMatch = participant.phone.includes(searchPhone);
      
      return (searchName === '' || nameMatch) && 
             (searchAadhar === '' || aadharMatch) && 
             (searchPhone === '' || phoneMatch);
    });
    setFilteredParticipants(filtered);
  };

  const handleResetSearch = () => {
    setSearchName('');
    setSearchAadhar('');
    setSearchPhone('');
    setFilteredParticipants(participants);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceCheckboxChange = (serviceType: string, service: string, checked: boolean) => {
    if (serviceType === 'eye') {
      setFormData(prev => ({
        ...prev,
        eye_services: checked 
          ? [...prev.eye_services, service]
          : prev.eye_services.filter(s => s !== service)
      }));
    } else if (serviceType === 'dental') {
      setFormData(prev => ({
        ...prev,
        dental_services: checked 
          ? [...prev.dental_services, service]
          : prev.dental_services.filter(s => s !== service)
      }));
    } else if (serviceType === 'cancer') {
      setFormData(prev => ({
        ...prev,
        cancer_services: checked 
          ? [...prev.cancer_services, service]
          : prev.cancer_services.filter(s => s !== service)
      }));
    } else if (serviceType === 'general') {
      setFormData(prev => ({
        ...prev,
        general_services: checked 
          ? [...prev.general_services, service]
          : prev.general_services.filter(s => s !== service)
      }));
    }
  };

  // Medicine Required Component for each tab
  const MedicineRequiredSection = ({ tabName }: { tabName: string }) => {
    const medicineRequiredField = `${tabName.toLowerCase().replace(' ', '_')}_medicine_required` as keyof typeof formData;
    const medicineNameField = `${tabName.toLowerCase().replace(' ', '_')}_medicine_name` as keyof typeof formData;

    return (
      <div className="mb-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5" />
          Medicine Information
        </h4>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              name={medicineRequiredField as string}
              checked={formData[medicineRequiredField] as boolean}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Medicine Required for {tabName}</span>
          </label>
          
          {(formData[medicineRequiredField] as boolean) && (
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Medicine Name
              </label>
              <input
                type="text"
                name={medicineNameField as string}
                value={formData[medicineNameField] as string}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter medicine name for ${tabName}`}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Updated Eye Examination Form Component with all fields
  const EyeExaminationForm = () => (
    <div className="bg-white p-6 rounded-lg border border-blue-200">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Eye Examination Form</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700"><strong>Camp:</strong> {formData.registration_source || 'Not selected'} | <strong>Participant:</strong> {formData.name || 'Not provided'}</p>
        </div>
      </div>

      {/* Medicine Required Section for Eye */}
      <MedicineRequiredSection tabName="Eye" />

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Basic Examination</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visual Acuity (Left)</label>
            <input
              type="text"
              name="eye_visual_acuity_left"
              value={formData.eye_visual_acuity_left}
              onChange={handleInputChange}
              placeholder="e.g., 6/6, 6/12"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visual Acuity (Right)</label>
            <input
              type="text"
              name="eye_visual_acuity_right"
              value={formData.eye_visual_acuity_right}
              onChange={handleInputChange}
              placeholder="e.g., 6/6, 6/12"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
            <input
              type="text"
              name="eye_diagnosis"
              value={formData.eye_diagnosis}
              onChange={handleInputChange}
              placeholder="Primary diagnosis"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Identified Vision Issues</label>
        <textarea
          name="eye_identified_issues"
          value={formData.eye_identified_issues}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
          placeholder="Describe any identified vision issues..."
        />
      </div>

      {/* Updated Spectacles Recommendation Section */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Spectacles Recommendation</h4>
        
        <div className="space-y-3 mb-4">
          <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
            <input
              type="checkbox"
              name="eye_spectacles_recommended"
              checked={formData.eye_spectacles_recommended}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Spectacles Recommended</span>
          </label>
          
          {formData.eye_spectacles_recommended && (
            <>
              <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="eye_had_existing_spectacles"
                  checked={formData.eye_had_existing_spectacles}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Had Existing Spectacles</span>
              </label>
              
              <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="eye_vision_correction_required"
                  checked={formData.eye_vision_correction_required}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Vision Correction Required</span>
              </label>

              {/* Vision Correction Details - Only show when spectacles are recommended */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-4 transition-all duration-300">
                <h5 className="text-md font-semibold text-blue-800 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Vision Correction Details
                </h5>
                
                <div className="space-y-3 mb-4">
                  <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="eye_specify_vision_correction"
                      checked={formData.eye_specify_vision_correction}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Specify vision correction requirements</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="eye_spectacles_provided"
                      checked={formData.eye_spectacles_provided}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Spectacles Provided</span>
                  </label>
                </div>
                
                {formData.eye_spectacles_provided && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Provided</label>
                      <input
                        type="date"
                        name="eye_spectacles_provided_date"
                        value={formData.eye_spectacles_provided_date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Updated Surgery Recommendation Section */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Surgery Recommendation</h4>
        
        <div className="space-y-3 mb-4">
          <label className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">
            <input
              type="checkbox"
              name="eye_surgery_recommended"
              checked={formData.eye_surgery_recommended}
              onChange={handleInputChange}
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">Surgery Recommended</span>
          </label>

          {formData.eye_surgery_recommended && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-200 mb-4 transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Type</label>
                  <select
                    name="eye_surgery_type"
                    value={formData.eye_surgery_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    <option value="">Select Surgery Type</option>
                    {surgeryTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Scheduled Date</label>
                  <input
                    type="date"
                    name="eye_surgery_scheduled_date"
                    value={formData.eye_surgery_scheduled_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Pre-requisites</label>
                <textarea
                  name="eye_surgery_prerequisites"
                  value={formData.eye_surgery_prerequisites}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  placeholder="Any pre-requisites for surgery"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="eye_surgery_performed"
                    checked={formData.eye_surgery_performed}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Surgery Performed</span>
                </label>
                
                <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="eye_spectacles_advised_post_surgery"
                    checked={formData.eye_spectacles_advised_post_surgery}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Spectacles Advised Post Surgery</span>
                </label>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Post-Surgery Follow-up</label>
                <input
                  type="date"
                  name="eye_post_surgery_follow_up"
                  value={formData.eye_post_surgery_follow_up}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Follow-up Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">General Follow-up Date</label>
            <input
              type="date"
              name="eye_follow_up_date"
              value={formData.eye_follow_up_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              name="eye_additional_notes"
              value={formData.eye_additional_notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              placeholder="Any additional observations or notes"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Dental Examination Form Component with Medicine Section
  const DentalExaminationForm = () => (
    <div className="bg-white p-6 rounded-lg border border-blue-200">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Dental Examination Form</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700">
            <strong>Camp:</strong> {formData.registration_source || 'Not selected'} |{' '}
            <strong>Participant:</strong> {formData.name || 'Not provided'} |{' '}
            <strong>Camp ID:</strong> {formData.camp_id || 'Not provided'}
          </p>
        </div>
      </div>

      {/* Medicine Required Section for Dental */}
      <MedicineRequiredSection tabName="Dental" />

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Basic Dental Examination</h4>
        
        {/* Oral Hygiene Status with Good, Fair, Poor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Oral Hygiene Status</label>
          <div className="flex gap-6">
            <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
              <input
                type="radio"
                name="dental_oral_hygiene_status"
                value="Good"
                checked={formData.dental_oral_hygiene_status === 'Good'}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Good</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors cursor-pointer">
              <input
                type="radio"
                name="dental_oral_hygiene_status"
                value="Fair"
                checked={formData.dental_oral_hygiene_status === 'Fair'}
                onChange={handleInputChange}
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <span className="text-sm font-medium text-gray-700">Fair</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">
              <input
                type="radio"
                name="dental_oral_hygiene_status"
                value="Poor"
                checked={formData.dental_oral_hygiene_status === 'Poor'}
                onChange={handleInputChange}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">Poor</span>
            </label>
          </div>
        </div>

        {/* Dental Conditions */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
            <input
              type="checkbox"
              name="dental_caries_present"
              checked={formData.dental_caries_present || false}
              onChange={handleInputChange}
              className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
            />
            <span className="text-sm font-medium text-gray-700">Dental Caries Present</span>
          </label>
          
          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
            <input
              type="checkbox"
              name="dental_gum_disease_present"
              checked={formData.dental_gum_disease_present || false}
              onChange={handleInputChange}
              className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
            />
            <span className="text-sm font-medium text-gray-700">Gum Disease Present</span>
          </label>
        </div>
      </div>

      {/* Treatment Recommendations */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Treatment Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="dental_tooth_extraction_recommended"
                checked={formData.dental_tooth_extraction_recommended || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Tooth Extraction Recommended</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="dental_filling_recommended"
                checked={formData.dental_filling_recommended || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Filling Recommended</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="dental_root_canal_recommended"
                checked={formData.dental_root_canal_recommended || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Root Canal Recommended</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="dental_dentures_recommended"
                checked={formData.dental_dentures_recommended || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Dentures Recommended</span>
            </label>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="dental_tooth_extraction_performed"
                checked={formData.dental_tooth_extraction_performed || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Tooth Extraction Performed</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="dental_filling_performed"
                checked={formData.dental_filling_performed || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Filling Performed</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="dental_root_canal_performed"
                checked={formData.dental_root_canal_performed || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Root Canal Performed</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="dental_dentures_provided"
                checked={formData.dental_dentures_provided || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Dentures Provided</span>
            </label>
          </div>
        </div>
      </div>

      {/* Follow-up Information */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Follow-up Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
            <input
              type="date"
              name="dental_follow_up_date"
              value={formData.dental_follow_up_date || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Additional Notes</h4>
        <textarea
          name="dental_additional_notes"
          value={formData.dental_additional_notes || ''}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
          placeholder="Any additional observations or notes"
        />
      </div>

      {/* Dental Auditor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Dental Auditor</label>
        <input
          type="text"
          name="dental_auditor"
          value={formData.dental_auditor || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
          placeholder="Enter dental auditor name"
        />
      </div>
    </div>
  );

  // General Health Examination Form with Medicine Section
  const GeneralHealthExaminationForm = () => (
    <div className="bg-white p-6 rounded-lg border border-blue-200">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">General Health Examination</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700">
            <strong>Camp:</strong> {formData.registration_source || 'Not selected'} |{' '}
            <strong>Participant:</strong> {formData.name || 'Not provided'} |{' '}
            <strong>Camp ID:</strong> {formData.camp_id || 'Not provided'}
          </p>
        </div>
      </div>

      {/* Medicine Required Section for General Checkup */}
      <MedicineRequiredSection tabName="General Checkup" />

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Physical Measurements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                name="general_height"
                value={formData.general_height}
                onChange={handleInputChange}
                placeholder="Enter height"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure - Systolic (mm/Hg)</label>
              <input
                type="number"
                name="general_blood_pressure_systolic"
                value={formData.general_blood_pressure_systolic}
                onChange={handleInputChange}
                placeholder="Systolic pressure"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BMI (Calculated)</label>
              <input
                type="text"
                name="general_bmi"
                value={formData.general_bmi}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                placeholder="Auto-calculated"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                name="general_weight"
                value={formData.general_weight}
                onChange={handleInputChange}
                placeholder="Enter weight"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure - Diastolic (mm/Hg)</label>
              <input
                type="number"
                name="general_blood_pressure_diastolic"
                value={formData.general_blood_pressure_diastolic}
                onChange={handleInputChange}
                placeholder="Diastolic pressure"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BSA (Calculated)</label>
              <input
                type="text"
                name="general_bsa"
                value={formData.general_bsa}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                placeholder="Body Surface Area (m²)"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Clinical Assessment</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Presenting Complaints</label>
            <textarea
              name="general_presenting_complaints"
              value={formData.general_presenting_complaints}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              placeholder="Describe the participant's main complaints"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Examination Remarks</label>
            <textarea
              name="general_examination_remarks"
              value={formData.general_examination_remarks}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              placeholder="Enter examination findings and observations"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
            <textarea
              name="general_recommendations"
              value={formData.general_recommendations}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              placeholder="Enter any recommendations or follow-up advice"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Blood Test Examination Form with Medicine Section
  const BloodTestExaminationForm = () => (
    <div className="bg-white p-6 rounded-lg border border-blue-200">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Blood Test Examination</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700">
            <strong>Camp:</strong> {formData.registration_source || 'Not selected'} |{' '}
            <strong>Participant:</strong> {formData.name || 'Not provided'} |{' '}
            <strong>Camp ID:</strong> {formData.camp_id || 'Not provided'}
          </p>
        </div>
      </div>

      {/* Medicine Required Section for Blood Test */}
      <MedicineRequiredSection tabName="Blood Test" />

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Blood Test Parameters</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Haemoglobin (g/dL)</label>
              <input
                type="number"
                name="blood_haemoglobin"
                value={formData.blood_haemoglobin}
                onChange={handleInputChange}
                placeholder="Enter haemoglobin value"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                Normal range: 12-16 g/dL for women, 13-17 g/dL for men
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Random Blood Sugar (mg/dL)</label>
              <input
                type="number"
                name="blood_random_sugar"
                value={formData.blood_random_sugar}
                onChange={handleInputChange}
                placeholder="Enter random blood sugar"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                Random capillary glucose measured anytime (not fasting)
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Other Information / Additional Tests</label>
            <textarea
              name="blood_other_information"
              value={formData.blood_other_information}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              placeholder="Enter any other blood test findings or information"
            />
          </div>
        </div>
      </div>

      {/* Blood Auditor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Blood Test Auditor</label>
        <input
          type="text"
          name="blood_auditor"
          value={formData.blood_auditor || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
          placeholder="Enter blood test auditor name"
        />
      </div>
    </div>
  );

  // Cancer Screening Form with Medicine Section
  const CancerScreeningForm = () => (
    <div className="bg-white p-6 rounded-lg border border-blue-200">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Cancer Screening</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700">
            <strong>Camp:</strong> {formData.registration_source || 'Not selected'} |{' '}
            <strong>Participant:</strong> {formData.name || 'Not provided'} |{' '}
            <strong>Camp ID:</strong> {formData.camp_id || 'Not provided'}
          </p>
        </div>
      </div>

      {/* Medicine Required Section for Cancer Screening */}
      <MedicineRequiredSection tabName="Cancer Screening" />

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Cancer Screening Types</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="cancer_oral"
                checked={formData.cancer_oral || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Oral Cancer</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="cancer_breast"
                checked={formData.cancer_breast || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-sm font-medium text-gray-700">Breast Cancer</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="cancer_cervical"
                checked={formData.cancer_cervical || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Cervical Cancer</span>
            </label>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="cancer_prostate"
                checked={formData.cancer_prostate || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Prostate Cancer</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="cancer_other"
                checked={formData.cancer_other || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">Other</span>
            </label>
            
            {formData.cancer_other && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Specify Other Cancer Type</label>
                <input
                  type="text"
                  name="cancer_other_details"
                  value={formData.cancer_other_details || ''}
                  onChange={handleInputChange}
                  placeholder="Enter other cancer type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Screening Findings</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Findings</label>
            <textarea
              name="cancer_findings"
              value={formData.cancer_findings || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              placeholder="Enter screening findings and observations"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
            <textarea
              name="cancer_recommendations"
              value={formData.cancer_recommendations || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
              placeholder="Enter recommendations and follow-up advice"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Follow-up Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
            <input
              type="date"
              name="cancer_follow_up_date"
              value={formData.cancer_follow_up_date || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      console.log('Form data being sent:', formData);
      
      // Updated validation with Aadhar and Phone as mandatory
      if (!formData.name || !formData.registration_source || !formData.aadhar || !formData.phone) {
        showError('Please fill in all required fields including Aadhar and Phone number');
        return;
      }

      // Aadhar validation (12 digits)
      if (formData.aadhar.length !== 12 || !/^\d+$/.test(formData.aadhar)) {
        showError('Please enter a valid 12-digit Aadhar number');
        return;
      }

      // Phone validation (10 digits)
      if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
        showError('Please enter a valid 10-digit phone number');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create participant');
      }

      await fetchParticipants();
      // Reset form data
      setFormData({
        name: '',
        aadhar: '',
        age: '',
        gender: 'Male',
        phone: '',
        address: '',
        state: '',
        district: '',
        assemblyconstituency: '',
        mandal: '',
        village: '',
        pincode: '',
        house_no: '',
        registration_source: '',
        blood_checkup: false,
        medicine_required: '',
        medicine_name: '',
        treatment_required: '',
        camp_category: '',
        eye_services: [],
        dental_services: [],
        cancer_services: [],
        general_services: [],
        eye_visual_acuity_left: '',
        eye_visual_acuity_right: '',
        eye_diagnosis: '',
        eye_identified_issues: '',
        eye_spectacles_recommended: false,
        eye_surgery_recommended: false,
        eye_follow_up_date: '',
        eye_additional_notes: '',
        eye_had_existing_spectacles: false,
        eye_vision_correction_required: false,
        eye_specify_vision_correction: false,
        eye_spectacles_provided: false,
        eye_spectacles_provided_date: '',
        eye_surgery_type: '',
        eye_surgery_prerequisites: '',
        eye_surgery_scheduled_date: '',
        eye_surgery_performed: false,
        eye_spectacles_advised_post_surgery: false,
        eye_post_surgery_follow_up: '',
        dental_oral_hygiene_status: '',
        dental_caries_present: false,
        dental_gum_disease_present: false,
        dental_tooth_extraction_recommended: false,
        dental_filling_recommended: false,
        dental_tooth_extraction_performed: false,
        dental_filling_performed: false,
        dental_root_canal_recommended: false,
        dental_dentures_recommended: false,
        dental_root_canal_performed: false,
        dental_dentures_provided: false,
        dental_follow_up_date: '',
        dental_additional_notes: '',
        dental_auditor: '',
        camp_id: '',
        general_height: '',
        general_weight: '',
        general_bmi: '',
        general_bsa: '',
        general_blood_pressure_systolic: '',
        general_blood_pressure_diastolic: '',
        general_presenting_complaints: '',
        general_examination_remarks: '',
        general_recommendations: '',
        blood_haemoglobin: '',
        blood_random_sugar: '',
        blood_other_information: '',
        blood_auditor: '',
        cancer_oral: false,
        cancer_breast: false,
        cancer_cervical: false,
        cancer_prostate: false,
        cancer_other: false,
        cancer_other_details: '',
        cancer_findings: '',
        cancer_recommendations: '',
        cancer_follow_up_date: '',
        general_medicine_required: false,
        general_medicine_name: '',
        blood_medicine_required: false,
        blood_medicine_name: '',
        eye_medicine_required: false,
        eye_medicine_name: '',
        dental_medicine_required: false,
        dental_medicine_name: '',
        cancer_medicine_required: false,
        cancer_medicine_name: ''
      });
      setActiveTab('');
      setIsModalOpen(false);
      showSuccess('Participant added successfully!');
    } catch (err) {
      console.error('Error saving participant:', err);
      showError('Failed to save participant');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (participant: Participant) => {
    setSelectedParticipant(participant);
    setFormData({
      ...formData,
      name: participant.name,
      aadhar: participant.aadhar,
      age: participant.age.toString(),
      gender: participant.gender,
      phone: participant.phone,
      address: participant.address,
      state: participant.state,
      district: participant.district,
      assemblyconstituency: participant.assemblyconstituency,
      mandal: participant.mandal,
      village: participant.village,
      pincode: participant.pincode,
      house_no: participant.house_no || '',
      registration_source: participant.registration_source,
      blood_checkup: participant.blood_checkup,
      medicine_required: participant.medicine_required,
      medicine_name: participant.medicine_name,
      treatment_required: participant.treatment_required
    });
    setActiveTab('');
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant) return;

    try {
      setLoading(true);
      
      // Updated validation with Aadhar and Phone as mandatory
      if (!formData.name || !formData.registration_source || !formData.aadhar || !formData.phone) {
        showError('Please fill in all required fields including Aadhar and Phone number');
        return;
      }

      // Aadhar validation (12 digits)
      if (formData.aadhar.length !== 12 || !/^\d+$/.test(formData.aadhar)) {
        showError('Please enter a valid 12-digit Aadhar number');
        return;
      }

      // Phone validation (10 digits)
      if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
        showError('Please enter a valid 10-digit phone number');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/participants/${selectedParticipant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('Update API Response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update participant');
      }

      await fetchParticipants();
      setIsEditModalOpen(false);
      setSelectedParticipant(null);
      setActiveTab('');
      showSuccess('Participant updated successfully!');
    } catch (err) {
      console.error('Error updating participant:', err);
      showError('Failed to update participant');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this participant?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete participant');
      }

      await fetchParticipants();
      showSuccess('Participant deleted successfully!');
    } catch (err) {
      console.error('Error deleting participant:', err);
      showError('Failed to delete participant');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      aadhar: '',
      age: '',
      gender: 'Male',
      phone: '',
      address: '',
      state: '',
      district: '',
      assemblyconstituency: '',
      mandal: '',
      village: '',
      pincode: '',
      house_no: '',
      registration_source: '',
      blood_checkup: false,
      medicine_required: '',
      medicine_name: '',
      treatment_required: '',
      camp_category: '',
      eye_services: [],
      dental_services: [],
      cancer_services: [],
      general_services: [],
      eye_visual_acuity_left: '',
      eye_visual_acuity_right: '',
      eye_diagnosis: '',
      eye_identified_issues: '',
      eye_spectacles_recommended: false,
      eye_surgery_recommended: false,
      eye_follow_up_date: '',
      eye_additional_notes: '',
      eye_had_existing_spectacles: false,
      eye_vision_correction_required: false,
      eye_specify_vision_correction: false,
      eye_spectacles_provided: false,
      eye_spectacles_provided_date: '',
      eye_surgery_type: '',
      eye_surgery_prerequisites: '',
      eye_surgery_scheduled_date: '',
      eye_surgery_performed: false,
      eye_spectacles_advised_post_surgery: false,
      eye_post_surgery_follow_up: '',
      dental_oral_hygiene_status: '',
      dental_caries_present: false,
      dental_gum_disease_present: false,
      dental_tooth_extraction_recommended: false,
      dental_filling_recommended: false,
      dental_tooth_extraction_performed: false,
      dental_filling_performed: false,
      dental_root_canal_recommended: false,
      dental_dentures_recommended: false,
      dental_root_canal_performed: false,
      dental_dentures_provided: false,
      dental_follow_up_date: '',
      dental_additional_notes: '',
      dental_auditor: '',
      camp_id: '',
      general_height: '',
      general_weight: '',
      general_bmi: '',
      general_bsa: '',
      general_blood_pressure_systolic: '',
      general_blood_pressure_diastolic: '',
      general_presenting_complaints: '',
      general_examination_remarks: '',
      general_recommendations: '',
      blood_haemoglobin: '',
      blood_random_sugar: '',
      blood_other_information: '',
      blood_auditor: '',
      cancer_oral: false,
      cancer_breast: false,
      cancer_cervical: false,
      cancer_prostate: false,
      cancer_other: false,
      cancer_other_details: '',
      cancer_findings: '',
      cancer_recommendations: '',
      cancer_follow_up_date: '',
      general_medicine_required: false,
      general_medicine_name: '',
      blood_medicine_required: false,
      blood_medicine_name: '',
      eye_medicine_required: false,
      eye_medicine_name: '',
      dental_medicine_required: false,
      dental_medicine_name: '',
      cancer_medicine_required: false,
      cancer_medicine_name: ''
    });
    setActiveTab('');
    setAadharSuggestions([]);
    setShowSuggestions(false);
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedParticipant(null);
  };

  const MessageDisplay = () => (
    <>
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          {errorMessage}
        </div>
      )}
    </>
  );

  return (
    <div>
      <MessageDisplay />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Participant Management</h1>
      </div>
      
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 mr-4">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="Search by Aadhar"
            value={searchAadhar}
            onChange={(e) => setSearchAadhar(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="Search by Phone"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button 
            onClick={handleSearch}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Search size={18} /> Search
          </button>
          {(searchName || searchAadhar || searchPhone) && (
            <button 
              onClick={handleResetSearch}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 shadow-sm disabled:opacity-50"
        >
          <Plus size={18} /> Add Participant
        </button>
      </div>

      {/* Add Participant Modal - Enhanced with #00b4d8 color */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center p-6 border-b bg-[#00b4d8] text-white rounded-t-lg">
              <h2 className="text-xl font-semibold">Add New Participant</h2>
              <button onClick={handleClose} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-[#00b4d8] pb-2">Personal Information</h3>
              </div>

              {/* Aadhar Field */}
              <div className="col-span-2 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Number <span className="text-red-500">*</span>
                </label>
                <input
                  ref={aadharInputRef}
                  type="text"
                  name="aadhar"
                  value={formData.aadhar}
                  onChange={handleAadharChange}
                  onFocus={() => formData.aadhar.length >= 4 && setShowSuggestions(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                  maxLength={12}
                  placeholder="Enter 12-digit Aadhar number"
                  required
                />
                
                {/* Aadhar Suggestions Dropdown */}
                {showSuggestions && aadharSuggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    {aadharSuggestions.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                        onClick={() => handleSuggestionClick(participant)}
                      >
                        <User className="w-4 h-4 text-[#00b4d8] mr-3" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{participant.name}</div>
                          <div className="text-sm text-gray-600">Aadhar: {participant.aadhar}</div>
                          <div className="text-xs text-gray-500">Phone: {participant.phone}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                  required
                />
              </div>

              {/* Location Information */}
              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-[#00b4d8] pb-2">Location Information</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Constituency</label>
                <input
                  type="text"
                  name="assemblyconstituency"
                  value={formData.assemblyconstituency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mandal/Town/Division</label>
                <input
                  type="text"
                  name="mandal"
                  value={formData.mandal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village/Ward</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House No/Street No/Building No
                </label>
                <input
                  type="text"
                  name="house_no"
                  value={formData.house_no}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors bg-blue-50"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors bg-blue-50"
                  placeholder="Address will be automatically generated from the location fields above"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  This field is automatically generated from the location information you provide above.
                </p>
              </div>

              {/* Registration Source */}
              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-[#00b4d8] pb-2">Camp Information</h3>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Camp<span className="text-red-500">*</span>
                </label>
                <select
                  name="registration_source"
                  value={formData.registration_source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                  required
                >
                  <option value="">Select Camp</option>
                  {Array.isArray(camps) && camps.map((camp) => (
                    <option key={camp.id} value={camp.camp_name}>
                      {camp.camp_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkup Type Section - Only show when registration source is selected */}
              {formData.registration_source && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Checkup Type
                  </label>
                  
                  {/* Tabs in the requested order */}
                  <div className="flex space-x-1 mb-6">
                    <button
                      type="button"
                      onClick={() => handleTabClick('General Checkup')}
                      className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                        activeTab === 'General Checkup' 
                          ? 'bg-[#00b4d8] text-white rounded-t-lg border-b-2 border-[#00b4d8]' 
                          : 'bg-gray-100 text-gray-600 rounded-t-lg hover:bg-gray-200 border-b-2 border-transparent'
                      }`}
                    >
                      General Checkup
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabClick('Blood Test')}
                      className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                        activeTab === 'Blood Test' 
                          ? 'bg-[#00b4d8] text-white rounded-t-lg border-b-2 border-[#00b4d8]' 
                          : 'bg-gray-100 text-gray-600 rounded-t-lg hover:bg-gray-200 border-b-2 border-transparent'
                      }`}
                    >
                      Blood Test
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabClick('Eye')}
                      className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                        activeTab === 'Eye' 
                          ? 'bg-[#00b4d8] text-white rounded-t-lg border-b-2 border-[#00b4d8]' 
                          : 'bg-gray-100 text-gray-600 rounded-t-lg hover:bg-gray-200 border-b-2 border-transparent'
                      }`}
                    >
                      Eye Checkup
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabClick('Dental')}
                      className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                        activeTab === 'Dental' 
                          ? 'bg-[#00b4d8] text-white rounded-t-lg border-b-2 border-[#00b4d8]' 
                          : 'bg-gray-100 text-gray-600 rounded-t-lg hover:bg-gray-200 border-b-2 border-transparent'
                      }`}
                    >
                      Dental Checkup
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabClick('Cancer Screening')}
                      className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                        activeTab === 'Cancer Screening' 
                          ? 'bg-[#00b4d8] text-white rounded-t-lg border-b-2 border-[#00b4d8]' 
                          : 'bg-gray-100 text-gray-600 rounded-t-lg hover:bg-gray-200 border-b-2 border-transparent'
                      }`}
                    >
                      Cancer Screening
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'General Checkup' && (
                    <GeneralHealthExaminationForm />
                  )}

                  {activeTab === 'Blood Test' && (
                    <BloodTestExaminationForm />
                  )}

                  {activeTab === 'Eye' && (
                    <EyeExaminationForm />
                  )}

                  {activeTab === 'Dental' && (
                    <DentalExaminationForm />
                  )}

                  {activeTab === 'Cancer Screening' && (
                    <CancerScreeningForm />
                  )}

                </div>
              )}

              <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0099c3] disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Participant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Participant Modal - Updated with new tab order and medicine fields */}
      {isEditModalOpen && selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center p-6 border-b bg-[#00b4d8] text-white rounded-t-lg">
              <h2 className="text-xl font-semibold">Edit Participant</h2>
              <button onClick={handleClose} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 grid grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-[#00b4d8] pb-2">Personal Information</h3>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="aadhar"
                  value={formData.aadhar}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                  maxLength={12}
                  placeholder="Enter 12-digit Aadhar number"
                  required
                />
              </div>

              {/* Location Information */}
              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-[#00b4d8] pb-2">Location Information</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Constituency</label>
                <input
                  type="text"
                  name="assemblyconstituency"
                  value={formData.assemblyconstituency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mandal/Town/Division</label>
                <input
                  type="text"
                  name="mandal"
                  value={formData.mandal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village/Ward</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House No/Street No/Building No
                </label>
                <input
                  type="text"
                  name="house_no"
                  value={formData.house_no}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors bg-blue-50"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address (Auto-generated)
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors bg-blue-50"
                  placeholder="Address will be automatically generated from the location fields above"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  This field is automatically generated from the location information you provide above.
                </p>
              </div>

              {/* Registration Source */}
              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-[#00b4d8] pb-2">Camp Information</h3>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Camp <span className="text-red-500">*</span>
                </label>
                <select
                  name="registration_source"
                  value={formData.registration_source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
                  required
                >
                  <option value="">Select Camp</option>
                  {camps.map((camp) => (
                    <option key={camp.id} value={camp.camp_name}>
                      {camp.camp_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkup Type Section - Only show when registration source is selected */}
              {formData.registration_source && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Checkup Type
                  </label>
                  
                  {/* Tabs in the requested order */}
                  <div className="flex space-x-1 mb-6">
                    <button
                      type="button"
                      onClick={() => handleTabClick('General Checkup')}
                      className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                        activeTab === 'General Checkup' 
                          ? 'bg-[#00b4d8] text-white rounded-t-lg border-b-2 border-[#00b4d8]' 
                          : 'bg-gray-100 text-gray-600 rounded-t-lg hover:bg-gray-200 border-b-2 border-transparent'
                      }`}
                    >
                      General Checkup
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabClick('Blood Test')}
                      className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                        activeTab === 'Blood Test' 
                          ? 'bg-[#00b4d8] text-white rounded-t-lg border-b-2 border-[#00b4d8]' 
                          : 'bg-gray-100 text-gray-600 rounded-t-lg hover:bg-gray-200 border-b-2 border-transparent'
                      }`}
                    >
                      Blood Test
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabClick('Eye')}
                      className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                        activeTab === 'Eye' 
                          ? 'bg-[#00b4d8] text-white rounded-t-lg border-b-2 border-[#00b4d8]' 
                          : 'bg-gray-100 text-gray-600 rounded-t-lg hover:bg-gray-200 border-b-2 border-transparent'
                      }`}
                    >
                      Eye Checkup
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabClick('Dental')}
                      className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                        activeTab === 'Dental' 
                          ? 'bg-[#00b4d8] text-white rounded-t-lg border-b-2 border-[#00b4d8]' 
                          : 'bg-gray-100 text-gray-600 rounded-t-lg hover:bg-gray-200 border-b-2 border-transparent'
                      }`}
                    >
                      Dental Checkup
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabClick('Cancer Screening')}
                      className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                        activeTab === 'Cancer Screening' 
                          ? 'bg-[#00b4d8] text-white rounded-t-lg border-b-2 border-[#00b4d8]' 
                          : 'bg-gray-100 text-gray-600 rounded-t-lg hover:bg-gray-200 border-b-2 border-transparent'
                      }`}
                    >
                      Cancer Screening
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'General Checkup' && (
                    <GeneralHealthExaminationForm />
                  )}

                  {activeTab === 'Blood Test' && (
                    <BloodTestExaminationForm />
                  )}

                  {activeTab === 'Eye' && (
                    <EyeExaminationForm />
                  )}

                  {activeTab === 'Dental' && (
                    <DentalExaminationForm />
                  )}

                  {activeTab === 'Cancer Screening' && (
                    <CancerScreeningForm />
                  )}

                </div>
              )}

              <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0099c3] disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Participant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Participant Modal */}
      {isViewModalOpen && selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Participant Details</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.age}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.gender}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.phone}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.aadhar}
                </div>
              </div>

              {/* Location Information */}
              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.state}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Constituency</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.assemblyconstituency}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.district}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mandal/Town/Division</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.mandal}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village/Ward</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.village}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.pincode}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">House No/Street No</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[80px]">
                  {selectedParticipant.house_no}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[80px]">
                  {selectedParticipant.address}
                </div>
              </div>

              {/* Camp Information */}
              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Camp Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Camp</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {selectedParticipant.registration_source}
                </div>
              </div>

              <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Participants Table */}
      <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-8">Loading participants...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Aadhar</th>
                <th className="px-4 py-3">Select Camp</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-4 py-3">{p.age}</td>
                  <td className="px-4 py-3">{p.gender}</td>
                  <td className="px-4 py-3">{p.phone}</td>
                  <td className="px-4 py-3">{p.aadhar}</td>
                  <td className="px-4 py-3 text-gray-700">{p.registration_source}</td>
                  <td className="px-4 py-3">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <button 
                      onClick={() => handleView(p)}
                      className="bg-blue-300 hover:bg-blue-500 text-black p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleEdit(p)}
                      className="bg-orange-300 hover:bg-orange-500 text-black p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filteredParticipants.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">No participants found</div>
        )}
      </div>
    </div>
  );
};

export default ParticipantManagement;
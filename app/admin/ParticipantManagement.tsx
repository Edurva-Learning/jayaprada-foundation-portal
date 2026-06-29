'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { Pencil, Trash2, Plus, X, Eye, Search, User, Pill, Upload, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import ActivityIndicator from '@/app/components/ActivityIndicator';

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
  updated_on: string;
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<any[]>([]);
  const [importColumns, setImportColumns] = useState<string[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const aadharInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const inputTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isModalOpen || isViewModalOpen || isEditModalOpen || isImportModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isViewModalOpen, isEditModalOpen, isImportModalOpen]);

  useEffect(() => {
    return () => {
      if (inputTimeoutRef.current) {
        clearTimeout(inputTimeoutRef.current);
      }
    };
  }, []);

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
    cancer_medicine_name: '',
    bp: '',
    spets: '',
    operation: '',
    completed_operation_date: '',
    post_operation_date: '',
    dental_examination: '',
    camp_location: '',
    cancer_screening: '',
    hb: '',
    rbs: '',
    height: '',
    weight: '',
    vision_left: '',
    vision_right: '',
    additional_data: {} as Record<string, any>,
    medicine: ''
  });

  const API_BASE_URL = 'http://localhost:5000';
  // const API_BASE_URL = 'https://jpapi.jpf-portal-api.com';
  const eyeServices = ['Spectacles', 'Cataract', 'Pterygium', 'Other'];
  const dentalServices = ['Cleaning', 'Filling', 'Extraction', 'Root Canal', 'Other'];
  const cancerServices = ['Oral Cancer', 'Breast Cancer', 'Cervical Cancer', 'Prostate Cancer', 'Other'];
  const generalServices = ['Blood Pressure', 'Sugar Test', 'ECG', 'X-Ray', 'Other'];
  const surgeryTypes = ['Cataract Surgery', 'LASIK', 'Glaucoma Surgery', 'Retinal Surgery', 'Other'];

  const formatDateOnly = (dateString: string | undefined): string => {
    if (!dateString) return '';
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    const total = Math.ceil(filteredParticipants.length / itemsPerPage);
    setTotalPages(total > 0 ? total : 1);
    if (currentPage > total && total > 0) {
      setCurrentPage(total);
    }
  }, [filteredParticipants, itemsPerPage, currentPage]);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredParticipants.slice(startIndex, endIndex);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          aadharInputRef.current && !aadharInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/participants`);
      const data = await res.json() as Participant[];
      const enrichedData = data.map(p => ({ ...p, age: p.age || '', gender: p.gender || '' }));
      setParticipants(enrichedData);
      setFilteredParticipants(enrichedData);
      setCurrentPage(1);
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

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, aadhar: value }));
    if (value.length >= 4) {
      const filtered = participants.filter(participant => 
        participant.aadhar && participant.aadhar.includes(value)
      );
      setAadharSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setAadharSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (participant: Participant) => {
    setFormData({
      ...formData,
      name: participant.name,
      aadhar: participant.aadhar,
      age: (participant.age || '').toString(),
      gender: participant.gender || 'Male',
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
    setFormData(prev => ({ ...prev, camp_category: tab }));
  };

  const handleSearch = () => {
    if (searchName === '' && searchAadhar === '' && searchPhone === '') {
      setFilteredParticipants(participants);
      setCurrentPage(1);
      return;
    }
    const filtered = participants.filter(participant => {
      const nameMatch = searchName === '' || (participant.name && participant.name.toLowerCase().includes(searchName.toLowerCase()));
      const aadharMatch = searchAadhar === '' || (participant.aadhar && participant.aadhar.includes(searchAadhar));
      const phoneMatch = searchPhone === '' || (participant.phone && participant.phone.includes(searchPhone));
      return nameMatch && aadharMatch && phoneMatch;
    });
    setFilteredParticipants(filtered);
    setCurrentPage(1);
  };

  const handleResetSearch = () => {
    setSearchName('');
    setSearchAadhar('');
    setSearchPhone('');
    setFilteredParticipants(participants);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const generateAddress = () => {
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
      setFormData(prev => ({ ...prev, address: generatedAddress }));
    }
  };

  const extractCampInfoFromFilename = (filename: string) => {
    const nameWithoutExt = filename.replace(/\.(xlsx|xls|csv)$/i, '');
    let campName = '';
    let campDate = '';
    let campLocation = '';
    const dateMatch = nameWithoutExt.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{4})$/);
    if (dateMatch) {
      campDate = dateMatch[1];
      campName = nameWithoutExt.replace(new RegExp(`\\s*${campDate.replace(/[-\/]/g, '\\$&')}\\s*$`), '').trim();
    } else {
      campName = nameWithoutExt;
      campDate = new Date().toISOString().split('T')[0];
    }
    const locationMatch = campName.match(/(?:CAMP\s+NO[\s-]*\d+\s+)?(.+)$/i);
    if (locationMatch && locationMatch[1]) campLocation = locationMatch[1].trim();
    let formattedDate = campDate;
    if (campDate.includes('-') || campDate.includes('/')) {
      const separator = campDate.includes('-') ? '-' : '/';
      const parts = campDate.split(separator);
      if (parts[0].length === 4) {
        formattedDate = campDate.replace(/\//g, '-');
      } else {
        const [day, month, year] = parts;
        formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    return { campName, campDate: formattedDate, campLocation };
  };

  const createCampFromFilename = async (campName: string, campDate: string, campLocation: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/camps`);
      const existingCamps = await response.json();
      const campExists = existingCamps.some((camp: any) => camp.camp_name === campName);
      if (campExists) return existingCamps.find((camp: any) => camp.camp_name === campName)?.id;
      const createResponse = await fetch(`${API_BASE_URL}/camps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          camp_name: campName,
          date: campDate,
          location: campLocation || 'To be specified',
          services: 'General CheckUp, Blood Test, Eye CheckUp, Dental CheckUp, Cancer Screening',
          status: 'Active'
        })
      });
      if (createResponse.ok) {
        const newCamp = await createResponse.json();
        window.dispatchEvent(new CustomEvent('campsUpdated'));
        return newCamp.id;
      }
      return null;
    } catch (err) {
      console.error('Error creating camp:', err);
      return null;
    }
  };

  const convertExcelDate = (dateValue: any): string => {
    if (!dateValue) return '';
    if (typeof dateValue === 'number' && !isNaN(dateValue)) {
      const date = new Date((dateValue - 25569) * 86400 * 1000);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      if (year > 1900 && year < 2100) return `${year}-${month}-${day}`;
    }
    if (typeof dateValue === 'string') {
      dateValue = dateValue.trim();
      if (dateValue.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
        const parts = dateValue.split('/');
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      if (dateValue.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
        const parts = dateValue.split('-');
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) return dateValue;
      return dateValue;
    }
    return '';
  };

  const mapExcelRowToParticipant = (row: any, campName?: string) => {
    const getValue = (possibleNames: string[]): string => {
      for (const name of possibleNames) {
        if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
          return String(row[name]);
        }
        const lowerName = name.toLowerCase();
        for (const key of Object.keys(row)) {
          if (key.toLowerCase() === lowerName && row[key] !== undefined && row[key] !== null && row[key] !== '') {
            return String(row[key]);
          }
        }
      }
      return '';
    };

    const standardFieldNames = new Set([
      'name', 'NAME', 'Name', 'Full Name', 'Participant Name',
      'aadhar', 'AADHAR', 'Aadhar', 'Aadhaar', 'Aadhar Number',
      'age', 'AGE', 'Age',
      'gender', 'GENDER', 'Gender',
      'phone', 'PHONE', 'Phone', 'Mobile', 'Mobile Number', 'Phone Number',
      'house_no', 'HOUSE NO', 'House No', 'House Number',
      'village', 'VILLAGE', 'Village',
      'mandal', 'MANDAL', 'Mandal',
      'assemblyconstituency', 'ASSEMBLY CONSTITUENCY', 'Constituency',
      'district', 'DISTRICT', 'District',
      'state', 'STATE', 'State',
      'pincode', 'PINCODE', 'Pincode', 'Pin Code',
      'hb', 'HB', 'Hb', 'haemoglobin', 'Hemoglobin', 'HAEMOGLOBIN',
      'bp', 'BP', 'bp', 'Blood Pressure', 'BLOOD PRESSURE',
      'rbs', 'RBS', 'rbs', 'Random Blood Sugar', 'Random Sugar',
      'height', 'HEIGHT', 'Height',
      'weight', 'WEIGHT', 'Weight',
      'treatment_required', 'TREATMENT REQUIRED', 'Treatment Required', 'Treatment',
      'medicine', 'MEDICINE', 'Medicine', 'Medicine Name',
      'vision_left', 'VISION LEFT', 'Vision Left', 'VISION ACTIVITY (left)',
      'vision_right', 'VISION RIGHT', 'Vision Right', 'VISION ACTIVITY (right)',
      'spets', 'SPECTS', 'Spets', 'Spectacles',
      'operation', 'OPERATION', 'Operation',
      'completed_operation_date', 'COMPLETED OPERATION DATE', 'COMPLETED_OPERATION_DATE',
      'post_operation_date', 'POST OPERATION DATE', 'POST_OPERATION_DATE',
      'dental_examination', 'DENTAL EXAMINATION', 'Dental Examination',
      'cancer_screening', 'CANCER SCREENING', 'Cancer Screening',
      'camp_location', 'CAMP LOCATION', 'Camp Location'
    ]);

    const additionalData: Record<string, any> = {};
    for (const key of Object.keys(row)) {
      const value = row[key];
      if (value === undefined || value === null || value === '') continue;
      const isStandardField = Array.from(standardFieldNames).some(
        stdName => stdName.toLowerCase() === key.toLowerCase() || 
                   (stdName.includes(' ') && stdName.toLowerCase() === key.toLowerCase())
      );
      if (!isStandardField && value !== undefined && value !== null && value !== '') {
        additionalData[key] = value;
      }
    }

    let completedDateRaw = '';
    let postDateRaw = '';
    for (const key of Object.keys(row)) {
      const upperKey = key.toUpperCase();
      if (upperKey.includes('COMPLETED') && upperKey.includes('OPERATION')) completedDateRaw = row[key];
      if (upperKey.includes('POST') && upperKey.includes('OPERATION')) postDateRaw = row[key];
    }

    const completed_operation_date = convertExcelDate(completedDateRaw);
    const post_operation_date = convertExcelDate(postDateRaw);
    const medicineValue = getValue(['MEDICINE', 'Medicine', 'Medicine Name', 'MEDICINE NAME', 'Medication', 'Drug']);

    return {
      name: getValue(['NAME', 'Name', 'Full Name', 'Participant Name']),
      aadhar: getValue(['AADHAR', 'Aadhar', 'Aadhaar', 'Aadhar Number']),
      age: getValue(['AGE', 'Age']),
      gender: getValue(['GENDER', 'Gender']),
      phone: getValue(['PHONE', 'Phone', 'Mobile', 'Mobile Number', 'Phone Number']),
      house_no: getValue(['HOUSE NO', 'House No', 'House Number']),
      village: getValue(['VILLAGE', 'Village']),
      mandal: getValue(['MANDAL', 'Mandal']),
      assemblyconstituency: getValue(['ASSEMBLY CONSTITUENCY', 'Constituency']),
      district: getValue(['DISTRICT', 'District']),
      state: getValue(['STATE', 'State']),
      pincode: getValue(['PINCODE', 'Pincode', 'Pin Code']),
      hb: getValue(['HB', 'Hb', 'haemoglobin', 'Hemoglobin', 'HAEMOGLOBIN']),
      bp: getValue(['BP', 'bp', 'Blood Pressure', 'BLOOD PRESSURE']),
      rbs: getValue(['RBS', 'rbs', 'Random Blood Sugar', 'Random Sugar']),
      height: getValue(['HEIGHT', 'Height']),
      weight: getValue(['WEIGHT', 'Weight']),
      treatment_required: getValue(['TREATMENT REQUIRED', 'Treatment Required', 'Treatment']),
      medicine: medicineValue,
      vision_left: getValue(['VISION LEFT', 'Vision Left', 'VISION ACTIVITY (left)']),
      vision_right: getValue(['VISION RIGHT', 'Vision Right', 'VISION ACTIVITY (right)']),
      spets: getValue(['SPECTS', 'Spets', 'Spectacles']),
      operation: getValue(['OPERATION', 'Operation']),
      completed_operation_date: completed_operation_date,
      post_operation_date: post_operation_date,
      dental_examination: getValue(['DENTAL EXAMINATION', 'Dental Examination']),
      cancer_screening: getValue(['CANCER SCREENING', 'Cancer Screening']),
      camp_location: getValue(['CAMP LOCATION', 'Camp Location']),
      additional_data: additionalData,
      registration_source: campName || 'Excel Import'
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportErrors([]);
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: any[] = XLSX.utils.sheet_to_json(worksheet);
          
          console.log(`📊 Total rows found in Excel: ${json.length}`);
          
          if (json.length > 0) {
            const columns = Object.keys(json[0]);
            setImportColumns(columns);
            const { campName } = extractCampInfoFromFilename(file.name);
            const mappedData = json.map(row => mapExcelRowToParticipant(row, campName));
            setImportData(mappedData);
            setImportProgress({ current: 0, total: mappedData.length });
            
            console.log(`✅ Mapped ${mappedData.length} records successfully`);
            console.log(`📋 Sample record:`, mappedData[0]);
          } else {
            showError('No data found in the Excel file');
          }
        } catch (err) {
          console.error('Error reading file:', err);
          showError('Failed to read the Excel file: ' + (err as Error).message);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleImportConfirm = async () => {
    if (importData.length === 0) {
      showError('No data to import');
      return;
    }

    setImportLoading(true);
    setImportErrors([]);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    let campInfo = null;
    
    try {
      if (importFile) {
        const { campName, campDate, campLocation } = extractCampInfoFromFilename(importFile.name);
        campInfo = { campName, campDate, campLocation };
        await createCampFromFilename(campName, campDate, campLocation);
      }

      const batchSize = 20;
      const totalRecords = importData.length;
      const totalBatches = Math.ceil(totalRecords / batchSize);

      console.log(`🚀 Starting import of ${totalRecords} records in ${totalBatches} batches`);

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const start = batchIndex * batchSize;
        const end = Math.min(start + batchSize, totalRecords);
        const batch = importData.slice(start, end);
        
        console.log(`📦 Processing batch ${batchIndex + 1}/${totalBatches}: Records ${start + 1} to ${end}`);

        for (let i = 0; i < batch.length; i++) {
          const participant = batch[i];
          const globalIndex = start + i;
          
          try {
            const addressParts = [];
            if (participant.house_no) addressParts.push(`H.No: ${participant.house_no}`);
            if (participant.village) addressParts.push(`Village: ${participant.village}`);
            if (participant.mandal) addressParts.push(`Mandal: ${participant.mandal}`);
            if (participant.district) addressParts.push(`District: ${participant.district}`);
            if (participant.assemblyconstituency) addressParts.push(`Constituency: ${participant.assemblyconstituency}`);
            if (participant.state) addressParts.push(`State: ${participant.state}`);
            if (participant.pincode) addressParts.push(`Pincode: ${participant.pincode}`);
            const fullAddress = addressParts.join(', ');

            const medicineValue = participant.medicine || '';

            const mappedParticipant: any = {
              name: participant.name || '',
              aadhar: participant.aadhar || '',
              age: participant.age ? parseInt(participant.age) : null,
              gender: participant.gender || '',
              phone: participant.phone || '',
              address: fullAddress || '',
              state: participant.state || '',
              district: participant.district || '',
              assemblyconstituency: participant.assemblyconstituency || '',
              mandal: participant.mandal || '',
              village: participant.village || '',
              pincode: participant.pincode || '',
              house_no: participant.house_no || '',
              registration_source: campInfo ? campInfo.campName : 'Excel Import',
              camp_location: participant.camp_location || '',
              hb: participant.hb ? parseFloat(participant.hb) : null,
              bp: participant.bp || '',
              rbs: participant.rbs ? parseInt(participant.rbs) : null,
              height: participant.height ? parseFloat(participant.height) : null,
              weight: participant.weight ? parseFloat(participant.weight) : null,
              treatment_required: participant.treatment_required || '',
              medicine: medicineValue,
              medicine_required: medicineValue ? 'Yes' : '',
              medicine_name: medicineValue || '',
              vision_left: participant.vision_left || '',
              vision_right: participant.vision_right || '',
              spets: participant.spets || '',
              operation: participant.operation || '',
              completed_operation_date: participant.completed_operation_date || null,
              post_operation_date: participant.post_operation_date || null,
              dental_examination: participant.dental_examination || '',
              cancer_screening: participant.cancer_screening || '',
              additional_data: participant.additional_data || {},
              blood_checkup: false,
              campcategory: null
            };
            
            const cleanParticipant: any = {};
            for (const key of Object.keys(mappedParticipant)) {
              const value = mappedParticipant[key];
              if (value !== undefined) {
                cleanParticipant[key] = value;
              }
            }
            
            const response = await fetch(`${API_BASE_URL}/participants`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(cleanParticipant)
            });
            
            if (response.ok) {
              successCount++;
            } else {
              const result = await response.json();
              const errorMsg = `Row ${globalIndex + 1}: ${result.error || result.message || 'Server error'}`;
              errors.push(errorMsg);
              errorCount++;
              console.error(`❌ Failed to import record ${globalIndex + 1}:`, result);
            }
          } catch (err) {
            const errorMsg = `Row ${globalIndex + 1}: ${(err as Error).message || 'Unknown error'}`;
            errors.push(errorMsg);
            errorCount++;
            console.error(`❌ Error importing record ${globalIndex + 1}:`, err);
          }
          
          setImportProgress({ current: globalIndex + 1, total: totalRecords });
        }
        
        console.log(`✅ Batch ${batchIndex + 1}/${totalBatches} complete. Success: ${successCount}, Errors: ${errorCount}`);
      }

      await fetchParticipants();
      await fetchCamps();
      
      console.log(`📊 Import complete! Total: ${totalRecords}, Success: ${successCount}, Errors: ${errorCount}`);
      
      if (errors.length > 0) {
        setImportErrors(errors);
        const errorSummary = errors.slice(0, 5).join('\n');
        const moreErrors = errors.length > 5 ? `\n... and ${errors.length - 5} more errors` : '';
        showError(`⚠️ Imported ${successCount} participants, ${errorCount} failed.\n${errorSummary}${moreErrors}`);
      } else {
        showSuccess(`✅ Successfully imported all ${successCount} participants!`);
      }
      
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportFile(null);
        setImportData([]);
        setImportColumns([]);
        setImportErrors([]);
      }, 3000);
      
    } catch (err) {
      console.error('Import error:', err);
      showError('Import failed: ' + (err as Error).message);
    } finally {
      setImportLoading(false);
      setImportProgress({ current: 0, total: 0 });
    }
  };

  const closeImportModal = () => {
    setIsImportModalOpen(false);
    setImportFile(null);
    setImportData([]);
    setImportColumns([]);
    setImportErrors([]);
    setImportProgress({ current: 0, total: 0 });
  };

  const healthFields = useMemo(() => {
    let medicineValue = formData.medicine || '';
    if (!medicineValue && formData.medicine_name) {
      medicineValue = formData.medicine_name;
    }
    if (!medicineValue && formData.medicine_required && formData.medicine_required !== 'No') {
      medicineValue = formData.medicine_required;
    }
    
    if (!medicineValue && formData.additional_data) {
      const additionalData = formData.additional_data as Record<string, any>;
      for (const key of Object.keys(additionalData)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('medicine') || lowerKey.includes('med') || lowerKey.includes('drug') || lowerKey.includes('medication')) {
          if (additionalData[key] && additionalData[key] !== '') {
            medicineValue = additionalData[key];
            break;
          }
        }
      }
    }

    return [
      { key: 'medicine', label: 'Medicine', value: medicineValue },
      { key: 'hb', label: 'HB / Haemoglobin', value: formData.hb || formData.blood_haemoglobin || '' },
      { key: 'bp', label: 'BP / Blood Pressure', value: formData.bp || '' },
      { key: 'rbs', label: 'RBS / Random Sugar', value: formData.rbs || formData.blood_random_sugar || '' },
      { key: 'height', label: 'Height', value: formData.height || formData.general_height || '' },
      { key: 'weight', label: 'Weight', value: formData.weight || formData.general_weight || '' },
      { key: 'vision_left', label: 'Vision Left', value: formData.vision_left || formData.eye_visual_acuity_left || '' },
      { key: 'vision_right', label: 'Vision Right', value: formData.vision_right || formData.eye_visual_acuity_right || '' },
      { key: 'spets', label: 'Spectacles', value: formData.spets || '' },
      { key: 'operation', label: 'Operation', value: formData.operation || '' },
      { key: 'completed_operation_date', label: 'Completed Operation Date', value: formData.completed_operation_date ? formatDateOnly(formData.completed_operation_date) : '', type: 'date' },
      { key: 'post_operation_date', label: 'Post Operation Date', value: formData.post_operation_date ? formatDateOnly(formData.post_operation_date) : '', type: 'date' },
      { key: 'treatment_required', label: 'Treatment Required', value: formData.treatment_required || '' },
      { key: 'dental_examination', label: 'Dental Examination', value: formData.dental_examination || '' },
      { key: 'cancer_screening', label: 'Cancer Screening', value: formData.cancer_screening || '' },
      { key: 'camp_location', label: 'Camp Location', value: formData.camp_location || '' }
    ];
  }, [formData]);

  const HealthExaminationDetails = memo(({ isViewMode = false }: { isViewMode?: boolean }) => {
    const hasHealthData = healthFields.some(field => field.value && field.value !== '');

    if (!hasHealthData) {
      return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Health Examination Details
          </h3>
          <p className="text-gray-500 text-center py-4">No health examination data available</p>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5" />
          Health Examination Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {healthFields.map((field) => {
            const displayValue = field.value || '';
            
            return (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                {isViewMode ? (
                  <p className="text-gray-900">{displayValue || 'Not specified'}</p>
                ) : field.type === 'date' ? (
                  <input
                    type="date"
                    name={field.key}
                    value={displayValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  />
                ) : (
                  <input
                    type="text"
                    name={field.key}
                    value={displayValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  HealthExaminationDetails.displayName = 'HealthExaminationDetails';

  const eyeFields = useMemo(() => [
    { key: 'eye_visual_acuity_left', label: 'Visual Acuity (Left)' },
    { key: 'eye_visual_acuity_right', label: 'Visual Acuity (Right)' },
    { key: 'eye_diagnosis', label: 'Diagnosis' },
    { key: 'eye_identified_issues', label: 'Identified Vision Issues' },
    { key: 'eye_spectacles_recommended', label: 'Spectacles Recommended', type: 'checkbox' },
    { key: 'eye_had_existing_spectacles', label: 'Had Existing Spectacles', type: 'checkbox' },
    { key: 'eye_vision_correction_required', label: 'Vision Correction Required', type: 'checkbox' },
    { key: 'eye_specify_vision_correction', label: 'Specify Vision Correction', type: 'checkbox' },
    { key: 'eye_spectacles_provided', label: 'Spectacles Provided', type: 'checkbox' },
    { key: 'eye_spectacles_provided_date', label: 'Spectacles Provided Date', type: 'date' },
    { key: 'eye_surgery_recommended', label: 'Surgery Recommended', type: 'checkbox' },
    { key: 'eye_surgery_type', label: 'Surgery Type' },
    { key: 'eye_surgery_prerequisites', label: 'Surgery Pre-requisites' },
    { key: 'eye_surgery_scheduled_date', label: 'Surgery Scheduled Date', type: 'date' },
    { key: 'eye_surgery_performed', label: 'Surgery Performed', type: 'checkbox' },
    { key: 'eye_spectacles_advised_post_surgery', label: 'Spectacles Advised Post Surgery', type: 'checkbox' },
    { key: 'eye_post_surgery_follow_up', label: 'Post-Surgery Follow-up', type: 'date' },
    { key: 'eye_follow_up_date', label: 'Follow-up Date', type: 'date' },
    { key: 'eye_additional_notes', label: 'Additional Notes' }
  ], []);

  const EyeExaminationDetails = memo(({ isViewMode = false }: { isViewMode?: boolean }) => {
    const hasEyeData = eyeFields.some(field => {
      const value = (formData as any)[field.key];
      return value && value !== '' && value !== false;
    });

    if (!hasEyeData) return null;

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Eye Examination Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eyeFields.map((field) => {
            const value = (formData as any)[field.key];
            
            if (field.type === 'checkbox') {
              return (
                <div key={field.key} className="flex items-center space-x-3 pt-2">
                  {isViewMode ? (
                    <p className="text-gray-900">{value ? '✓ Yes' : '✗ No'}</p>
                  ) : (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name={field.key}
                        checked={value || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#00b4d8] border-gray-300 rounded focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm font-medium text-gray-700">{field.label}</span>
                    </label>
                  )}
                </div>
              );
            }

            let displayValue = value || '';
            if (field.type === 'date' && value) {
              displayValue = formatDateOnly(value);
            }

            return (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                {isViewMode ? (
                  <p className="text-gray-900">{displayValue || 'Not specified'}</p>
                ) : field.type === 'date' ? (
                  <input
                    type="date"
                    name={field.key}
                    value={displayValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  />
                ) : (
                  <input
                    type="text"
                    name={field.key}
                    value={displayValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  EyeExaminationDetails.displayName = 'EyeExaminationDetails';

  const dentalFields = useMemo(() => [
    { key: 'dental_oral_hygiene_status', label: 'Oral Hygiene Status' },
    { key: 'dental_caries_present', label: 'Dental Caries Present', type: 'checkbox' },
    { key: 'dental_gum_disease_present', label: 'Gum Disease Present', type: 'checkbox' },
    { key: 'dental_tooth_extraction_recommended', label: 'Tooth Extraction Recommended', type: 'checkbox' },
    { key: 'dental_filling_recommended', label: 'Filling Recommended', type: 'checkbox' },
    { key: 'dental_tooth_extraction_performed', label: 'Tooth Extraction Performed', type: 'checkbox' },
    { key: 'dental_filling_performed', label: 'Filling Performed', type: 'checkbox' },
    { key: 'dental_root_canal_recommended', label: 'Root Canal Recommended', type: 'checkbox' },
    { key: 'dental_dentures_recommended', label: 'Dentures Recommended', type: 'checkbox' },
    { key: 'dental_root_canal_performed', label: 'Root Canal Performed', type: 'checkbox' },
    { key: 'dental_dentures_provided', label: 'Dentures Provided', type: 'checkbox' },
    { key: 'dental_follow_up_date', label: 'Follow-up Date', type: 'date' },
    { key: 'dental_additional_notes', label: 'Additional Notes' },
    { key: 'dental_auditor', label: 'Dental Auditor' }
  ], []);

  const DentalExaminationDetails = memo(({ isViewMode = false }: { isViewMode?: boolean }) => {
    const hasDentalData = dentalFields.some(field => {
      const value = (formData as any)[field.key];
      return value && value !== '' && value !== false;
    });

    if (!hasDentalData) return null;

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5" />
          Dental Examination Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dentalFields.map((field) => {
            const value = (formData as any)[field.key];
            
            if (field.type === 'checkbox') {
              return (
                <div key={field.key} className="flex items-center space-x-3 pt-2">
                  {isViewMode ? (
                    <p className="text-gray-900">{value ? '✓ Yes' : '✗ No'}</p>
                  ) : (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name={field.key}
                        checked={value || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#00b4d8] border-gray-300 rounded focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm font-medium text-gray-700">{field.label}</span>
                    </label>
                  )}
                </div>
              );
            }

            let displayValue = value || '';
            if (field.type === 'date' && value) {
              displayValue = formatDateOnly(value);
            }

            return (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                {isViewMode ? (
                  <p className="text-gray-900">{displayValue || 'Not specified'}</p>
                ) : field.type === 'date' ? (
                  <input
                    type="date"
                    name={field.key}
                    value={displayValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  />
                ) : (
                  <input
                    type="text"
                    name={field.key}
                    value={displayValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  DentalExaminationDetails.displayName = 'DentalExaminationDetails';

  const generalFields = useMemo(() => [
    { key: 'general_height', label: 'Height (cm)' },
    { key: 'general_weight', label: 'Weight (kg)' },
    { key: 'general_blood_pressure_systolic', label: 'Blood Pressure - Systolic (mm/Hg)' },
    { key: 'general_blood_pressure_diastolic', label: 'Blood Pressure - Diastolic (mm/Hg)' },
    { key: 'general_presenting_complaints', label: 'Presenting Complaints' },
    { key: 'general_examination_remarks', label: 'Examination Remarks' },
    { key: 'general_recommendations', label: 'Recommendations' },
    { key: 'general_medicine_required', label: 'Medicine Required', type: 'checkbox' },
    { key: 'general_medicine_name', label: 'Medicine Name' }
  ], []);

  const GeneralHealthDetails = memo(({ isViewMode = false }: { isViewMode?: boolean }) => {
    const hasGeneralData = generalFields.some(field => {
      const value = (formData as any)[field.key];
      return value && value !== '' && value !== false;
    });

    if (!hasGeneralData) return null;

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5" />
          General Health Examination Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {generalFields.map((field) => {
            const value = (formData as any)[field.key];
            
            if (field.type === 'checkbox') {
              return (
                <div key={field.key} className="flex items-center space-x-3 pt-2">
                  {isViewMode ? (
                    <p className="text-gray-900">{value ? '✓ Yes' : '✗ No'}</p>
                  ) : (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name={field.key}
                        checked={value || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#00b4d8] border-gray-300 rounded focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm font-medium text-gray-700">{field.label}</span>
                    </label>
                  )}
                </div>
              );
            }

            return (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                {isViewMode ? (
                  <p className="text-gray-900">{value || 'Not specified'}</p>
                ) : (
                  <input
                    type="text"
                    name={field.key}
                    value={value || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  GeneralHealthDetails.displayName = 'GeneralHealthDetails';

  const bloodFields = useMemo(() => [
    { key: 'blood_haemoglobin', label: 'Haemoglobin (g/dL)' },
    { key: 'blood_random_sugar', label: 'Random Blood Sugar (mg/dL)' },
    { key: 'blood_other_information', label: 'Other Information' },
    { key: 'blood_auditor', label: 'Blood Test Auditor' },
    { key: 'blood_medicine_required', label: 'Medicine Required', type: 'checkbox' },
    { key: 'blood_medicine_name', label: 'Medicine Name' }
  ], []);

  const BloodTestDetails = memo(({ isViewMode = false }: { isViewMode?: boolean }) => {
    const hasBloodData = bloodFields.some(field => {
      const value = (formData as any)[field.key];
      return value && value !== '' && value !== false;
    });

    if (!hasBloodData) return null;

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5" />
          Blood Test Examination Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bloodFields.map((field) => {
            const value = (formData as any)[field.key];
            
            if (field.type === 'checkbox') {
              return (
                <div key={field.key} className="flex items-center space-x-3 pt-2">
                  {isViewMode ? (
                    <p className="text-gray-900">{value ? '✓ Yes' : '✗ No'}</p>
                  ) : (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name={field.key}
                        checked={value || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#00b4d8] border-gray-300 rounded focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm font-medium text-gray-700">{field.label}</span>
                    </label>
                  )}
                </div>
              );
            }

            return (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                {isViewMode ? (
                  <p className="text-gray-900">{value || 'Not specified'}</p>
                ) : (
                  <input
                    type="text"
                    name={field.key}
                    value={value || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  BloodTestDetails.displayName = 'BloodTestDetails';

  const cancerFields = useMemo(() => [
    { key: 'cancer_oral', label: 'Oral Cancer', type: 'checkbox' },
    { key: 'cancer_breast', label: 'Breast Cancer', type: 'checkbox' },
    { key: 'cancer_cervical', label: 'Cervical Cancer', type: 'checkbox' },
    { key: 'cancer_prostate', label: 'Prostate Cancer', type: 'checkbox' },
    { key: 'cancer_other', label: 'Other Cancer', type: 'checkbox' },
    { key: 'cancer_other_details', label: 'Other Cancer Details' },
    { key: 'cancer_findings', label: 'Findings' },
    { key: 'cancer_recommendations', label: 'Recommendations' },
    { key: 'cancer_follow_up_date', label: 'Follow-up Date', type: 'date' },
    { key: 'cancer_medicine_required', label: 'Medicine Required', type: 'checkbox' },
    { key: 'cancer_medicine_name', label: 'Medicine Name' }
  ], []);

  const CancerScreeningDetails = memo(({ isViewMode = false }: { isViewMode?: boolean }) => {
    const hasCancerData = cancerFields.some(field => {
      const value = (formData as any)[field.key];
      return value && value !== '' && value !== false;
    });

    if (!hasCancerData) return null;

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5" />
          Cancer Screening Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cancerFields.map((field) => {
            const value = (formData as any)[field.key];
            
            if (field.type === 'checkbox') {
              return (
                <div key={field.key} className="flex items-center space-x-3 pt-2">
                  {isViewMode ? (
                    <p className="text-gray-900">{value ? '✓ Yes' : '✗ No'}</p>
                  ) : (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name={field.key}
                        checked={value || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#00b4d8] border-gray-300 rounded focus:ring-[#00b4d8]"
                      />
                      <span className="text-sm font-medium text-gray-700">{field.label}</span>
                    </label>
                  )}
                </div>
              );
            }

            let displayValue = value || '';
            if (field.type === 'date' && value) {
              displayValue = formatDateOnly(value);
            }

            return (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                {isViewMode ? (
                  <p className="text-gray-900">{displayValue || 'Not specified'}</p>
                ) : field.type === 'date' ? (
                  <input
                    type="date"
                    name={field.key}
                    value={displayValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  />
                ) : (
                  <input
                    type="text"
                    name={field.key}
                    value={displayValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  CancerScreeningDetails.displayName = 'CancerScreeningDetails';

  const EyeExaminationEditForm = () => {
    return (
      <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6">
        <div className="mb-6"><h3 className="text-xl font-semibold text-blue-800 mb-4">Eye Examination Form</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Visual Acuity (Left)</label><input type="text" name="eye_visual_acuity_left" value={formData.eye_visual_acuity_left} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Visual Acuity (Right)</label><input type="text" name="eye_visual_acuity_right" value={formData.eye_visual_acuity_right} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label><input type="text" name="eye_diagnosis" value={formData.eye_diagnosis} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Identified Vision Issues</label><textarea name="eye_identified_issues" value={formData.eye_identified_issues} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border rounded-md" /></div>
        </div>
      </div>
    );
  };

  const DentalExaminationEditForm = () => {
    return (
      <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6">
        <div className="mb-6"><h3 className="text-xl font-semibold text-blue-800 mb-4">Dental Examination Form</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Oral Hygiene Status</label>
            <select name="dental_oral_hygiene_status" value={formData.dental_oral_hygiene_status} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
              <option value="">Select</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const GeneralHealthExaminationEditForm = () => {
    return (
      <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6">
        <div className="mb-6"><h3 className="text-xl font-semibold text-blue-800 mb-4">General Health Examination</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label><input type="number" name="general_height" value={formData.general_height} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label><input type="number" name="general_weight" value={formData.general_weight} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" /></div>
        </div>
      </div>
    );
  };

  const BloodTestExaminationEditForm = () => {
    return (
      <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6">
        <div className="mb-6"><h3 className="text-xl font-semibold text-blue-800 mb-4">Blood Test Examination</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Haemoglobin (g/dL)</label><input type="number" name="blood_haemoglobin" value={formData.blood_haemoglobin} onChange={handleInputChange} step="0.1" className="w-full px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Random Blood Sugar (mg/dL)</label><input type="number" name="blood_random_sugar" value={formData.blood_random_sugar} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" /></div>
        </div>
      </div>
    );
  };

  const CancerScreeningEditForm = () => {
    return (
      <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6">
        <div className="mb-6"><h3 className="text-xl font-semibold text-blue-800 mb-4">Cancer Screening</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Findings</label><textarea name="cancer_findings" value={formData.cancer_findings} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border rounded-md" /></div>
        </div>
      </div>
    );
  };

  const handleEdit = (participant: Participant) => {
    console.log('Editing participant with data:', participant);
    setSelectedParticipant(participant);
    
    let medicineValue = (participant as any).medicine || '';
    if (!medicineValue && participant.medicine_name) {
      medicineValue = participant.medicine_name;
    }
    if (!medicineValue && participant.medicine_required && participant.medicine_required !== 'No') {
      medicineValue = participant.medicine_required;
    }
    
    setFormData({
      name: participant.name || '',
      aadhar: participant.aadhar || '',
      age: (participant.age || '').toString(),
      gender: participant.gender || 'Male',
      phone: participant.phone || '',
      address: participant.address || '',
      state: participant.state || '',
      district: participant.district || '',
      assemblyconstituency: participant.assemblyconstituency || '',
      mandal: participant.mandal || '',
      village: participant.village || '',
      pincode: participant.pincode || '',
      house_no: participant.house_no || '',
      registration_source: participant.registration_source || '',
      blood_checkup: participant.blood_checkup || false,
      medicine_required: participant.medicine_required || '',
      medicine_name: participant.medicine_name || '',
      treatment_required: participant.treatment_required || '',
      camp_category: (participant as any).campcategory || '',
      eye_services: [],
      dental_services: [],
      cancer_services: [],
      general_services: [],
      eye_visual_acuity_left: participant.eye_visual_acuity_left || '',
      eye_visual_acuity_right: participant.eye_visual_acuity_right || '',
      eye_diagnosis: participant.eye_diagnosis || '',
      eye_identified_issues: participant.eye_identified_issues || '',
      eye_spectacles_recommended: participant.eye_spectacles_recommended || false,
      eye_surgery_recommended: participant.eye_surgery_recommended || false,
      eye_follow_up_date: participant.eye_follow_up_date || '',
      eye_additional_notes: participant.eye_additional_notes || '',
      eye_had_existing_spectacles: participant.eye_had_existing_spectacles || false,
      eye_vision_correction_required: participant.eye_vision_correction_required || false,
      eye_specify_vision_correction: participant.eye_specify_vision_correction || false,
      eye_spectacles_provided: participant.eye_spectacles_provided || false,
      eye_spectacles_provided_date: participant.eye_spectacles_provided_date || '',
      eye_surgery_type: participant.eye_surgery_type || '',
      eye_surgery_prerequisites: participant.eye_surgery_prerequisites || '',
      eye_surgery_scheduled_date: participant.eye_surgery_scheduled_date || '',
      eye_surgery_performed: participant.eye_surgery_performed || false,
      eye_spectacles_advised_post_surgery: participant.eye_spectacles_advised_post_surgery || false,
      eye_post_surgery_follow_up: participant.eye_post_surgery_follow_up || '',
      dental_oral_hygiene_status: participant.dental_oral_hygiene_status || '',
      dental_caries_present: participant.dental_caries_present || false,
      dental_gum_disease_present: participant.dental_gum_disease_present || false,
      dental_tooth_extraction_recommended: participant.dental_tooth_extraction_recommended || false,
      dental_filling_recommended: participant.dental_filling_recommended || false,
      dental_tooth_extraction_performed: participant.dental_tooth_extraction_performed || false,
      dental_filling_performed: participant.dental_filling_performed || false,
      dental_root_canal_recommended: participant.dental_root_canal_recommended || false,
      dental_dentures_recommended: participant.dental_dentures_recommended || false,
      dental_root_canal_performed: participant.dental_root_canal_performed || false,
      dental_dentures_provided: participant.dental_dentures_provided || false,
      dental_follow_up_date: participant.dental_follow_up_date || '',
      dental_additional_notes: participant.dental_additional_notes || '',
      dental_auditor: participant.dental_auditor || '',
      camp_id: '',
      general_height: participant.general_height || '',
      general_weight: participant.general_weight || '',
      general_bmi: participant.general_bmi || '',
      general_bsa: participant.general_bsa || '',
      general_blood_pressure_systolic: participant.general_blood_pressure_systolic || '',
      general_blood_pressure_diastolic: participant.general_blood_pressure_diastolic || '',
      general_presenting_complaints: participant.general_presenting_complaints || '',
      general_examination_remarks: participant.general_examination_remarks || '',
      general_recommendations: participant.general_recommendations || '',
      blood_haemoglobin: participant.blood_haemoglobin || '',
      blood_random_sugar: participant.blood_random_sugar || '',
      blood_other_information: participant.blood_other_information || '',
      blood_auditor: participant.blood_auditor || '',
      cancer_oral: participant.cancer_oral || false,
      cancer_breast: participant.cancer_breast || false,
      cancer_cervical: participant.cancer_cervical || false,
      cancer_prostate: participant.cancer_prostate || false,
      cancer_other: participant.cancer_other || false,
      cancer_other_details: participant.cancer_other_details || '',
      cancer_findings: participant.cancer_findings || '',
      cancer_recommendations: participant.cancer_recommendations || '',
      cancer_follow_up_date: participant.cancer_follow_up_date || '',
      general_medicine_required: participant.general_medicine_required || false,
      general_medicine_name: participant.general_medicine_name || '',
      blood_medicine_required: participant.blood_medicine_required || false,
      blood_medicine_name: participant.blood_medicine_name || '',
      eye_medicine_required: participant.eye_medicine_required || false,
      eye_medicine_name: participant.eye_medicine_name || '',
      dental_medicine_required: participant.dental_medicine_required || false,
      dental_medicine_name: participant.dental_medicine_name || '',
      cancer_medicine_required: participant.cancer_medicine_required || false,
      cancer_medicine_name: participant.cancer_medicine_name || '',
      bp: participant.bp || '',
      spets: participant.spets || '',
      operation: participant.operation || '',
      completed_operation_date: participant.completed_operation_date || '',
      post_operation_date: participant.post_operation_date || '',
      dental_examination: participant.dental_examination || '',
      camp_location: participant.camp_location || '',
      cancer_screening: participant.cancer_screening || '',
      hb: participant.hb?.toString() || '',
      rbs: participant.rbs?.toString() || '',
      height: participant.height?.toString() || '',
      weight: participant.weight?.toString() || '',
      vision_left: participant.vision_left || '',
      vision_right: participant.vision_right || '',
      additional_data: (participant as any).additional_data || {},
      medicine: medicineValue
    });
    
    setIsEditModalOpen(true);
    setTimeout(() => {
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!formData.name || !formData.registration_source || !formData.aadhar || !formData.phone) {
        showError('Please fill in all required fields');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to create participant');
      await fetchParticipants();
      handleClose();
      showSuccess('Participant added successfully!');
    } catch (err) {
      console.error('Error saving participant:', err);
      showError('Failed to save participant');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant) {
      showError('No participant selected');
      return;
    }
    if (!formData.name || !formData.aadhar || !formData.phone) {
      showError('Please fill in all required fields (Name, Aadhar, Phone)');
      return;
    }
    try {
      setLoading(true);
      const updateData: Record<string, any> = {};
      
      if (formData.name) updateData.name = formData.name;
      if (formData.aadhar) updateData.aadhar = formData.aadhar;
      if (formData.age) updateData.age = parseInt(formData.age);
      if (formData.gender) updateData.gender = formData.gender;
      if (formData.phone) updateData.phone = formData.phone;
      if (formData.address) updateData.address = formData.address;
      if (formData.state) updateData.state = formData.state;
      if (formData.district) updateData.district = formData.district;
      if (formData.assemblyconstituency) updateData.assemblyconstituency = formData.assemblyconstituency;
      if (formData.mandal) updateData.mandal = formData.mandal;
      if (formData.village) updateData.village = formData.village;
      if (formData.pincode) updateData.pincode = formData.pincode;
      if (formData.house_no) updateData.house_no = formData.house_no;
      if (formData.registration_source) updateData.registration_source = formData.registration_source;
      if (formData.medicine_required) updateData.medicine_required = formData.medicine_required;
      if (formData.medicine || formData.medicine_name) {
        updateData.medicine = formData.medicine || formData.medicine_name;
      }
      if (formData.treatment_required) updateData.treatment_required = formData.treatment_required;
      if (formData.camp_category) updateData.campcategory = formData.camp_category;
      
      if (formData.hb) updateData.hb = parseFloat(formData.hb);
      if (formData.bp) updateData.bp = formData.bp;
      if (formData.rbs) updateData.rbs = parseInt(formData.rbs);
      if (formData.height) updateData.height = parseFloat(formData.height);
      if (formData.weight) updateData.weight = parseFloat(formData.weight);
      if (formData.vision_left) updateData.vision_left = formData.vision_left;
      if (formData.vision_right) updateData.vision_right = formData.vision_right;
      if (formData.spets) updateData.spets = formData.spets;
      if (formData.operation) updateData.operation = formData.operation;
      if (formData.completed_operation_date) updateData.completed_operation_date = formData.completed_operation_date;
      if (formData.post_operation_date) updateData.post_operation_date = formData.post_operation_date;
      if (formData.dental_examination) updateData.dental_examination = formData.dental_examination;
      if (formData.cancer_screening) updateData.cancer_screening = formData.cancer_screening;
      if (formData.camp_location) updateData.camp_location = formData.camp_location;
      
      const response = await fetch(`${API_BASE_URL}/participants/${selectedParticipant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          try {
            const textError = await response.text();
            if (textError) errorMessage = textError;
          } catch {
            // Use default error message
          }
        }
        throw new Error(errorMessage);
      }
      
      await fetchParticipants();
      handleClose();
      showSuccess('Participant updated successfully!');
    } catch (err) {
      console.error('Error updating participant:', err);
      showError('Update failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleView = (participant: Participant) => {
    setSelectedParticipant(participant);
    setFormData({
      ...formData,
      name: participant.name,
      aadhar: participant.aadhar,
      age: (participant.age || '').toString(),
      gender: participant.gender || 'Male',
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
      treatment_required: participant.treatment_required,
      eye_visual_acuity_left: participant.eye_visual_acuity_left || '',
      eye_visual_acuity_right: participant.eye_visual_acuity_right || '',
      eye_diagnosis: participant.eye_diagnosis || '',
      eye_identified_issues: participant.eye_identified_issues || '',
      eye_spectacles_recommended: participant.eye_spectacles_recommended || false,
      eye_surgery_recommended: participant.eye_surgery_recommended || false,
      eye_follow_up_date: participant.eye_follow_up_date || '',
      eye_additional_notes: participant.eye_additional_notes || '',
      eye_had_existing_spectacles: participant.eye_had_existing_spectacles || false,
      eye_vision_correction_required: participant.eye_vision_correction_required || false,
      eye_specify_vision_correction: participant.eye_specify_vision_correction || false,
      eye_spectacles_provided: participant.eye_spectacles_provided || false,
      eye_spectacles_provided_date: participant.eye_spectacles_provided_date || '',
      eye_surgery_type: participant.eye_surgery_type || '',
      eye_surgery_prerequisites: participant.eye_surgery_prerequisites || '',
      eye_surgery_scheduled_date: participant.eye_surgery_scheduled_date || '',
      eye_surgery_performed: participant.eye_surgery_performed || false,
      eye_spectacles_advised_post_surgery: participant.eye_spectacles_advised_post_surgery || false,
      eye_post_surgery_follow_up: participant.eye_post_surgery_follow_up || '',
      dental_oral_hygiene_status: participant.dental_oral_hygiene_status || '',
      dental_caries_present: participant.dental_caries_present || false,
      dental_gum_disease_present: participant.dental_gum_disease_present || false,
      dental_tooth_extraction_recommended: participant.dental_tooth_extraction_recommended || false,
      dental_filling_recommended: participant.dental_filling_recommended || false,
      dental_tooth_extraction_performed: participant.dental_tooth_extraction_performed || false,
      dental_filling_performed: participant.dental_filling_performed || false,
      dental_root_canal_recommended: participant.dental_root_canal_recommended || false,
      dental_dentures_recommended: participant.dental_dentures_recommended || false,
      dental_root_canal_performed: participant.dental_root_canal_performed || false,
      dental_dentures_provided: participant.dental_dentures_provided || false,
      dental_follow_up_date: participant.dental_follow_up_date || '',
      dental_additional_notes: participant.dental_additional_notes || '',
      dental_auditor: participant.dental_auditor || '',
      general_height: participant.general_height || '',
      general_weight: participant.general_weight || '',
      general_bmi: participant.general_bmi || '',
      general_bsa: participant.general_bsa || '',
      general_blood_pressure_systolic: participant.general_blood_pressure_systolic || '',
      general_blood_pressure_diastolic: participant.general_blood_pressure_diastolic || '',
      general_presenting_complaints: participant.general_presenting_complaints || '',
      general_examination_remarks: participant.general_examination_remarks || '',
      general_recommendations: participant.general_recommendations || '',
      blood_haemoglobin: participant.blood_haemoglobin || '',
      blood_random_sugar: participant.blood_random_sugar || '',
      blood_other_information: participant.blood_other_information || '',
      blood_auditor: participant.blood_auditor || '',
      cancer_oral: participant.cancer_oral || false,
      cancer_breast: participant.cancer_breast || false,
      cancer_cervical: participant.cancer_cervical || false,
      cancer_prostate: participant.cancer_prostate || false,
      cancer_other: participant.cancer_other || false,
      cancer_other_details: participant.cancer_other_details || '',
      cancer_findings: participant.cancer_findings || '',
      cancer_recommendations: participant.cancer_recommendations || '',
      cancer_follow_up_date: participant.cancer_follow_up_date || '',
      general_medicine_required: participant.general_medicine_required || false,
      general_medicine_name: participant.general_medicine_name || '',
      blood_medicine_required: participant.blood_medicine_required || false,
      blood_medicine_name: participant.blood_medicine_name || '',
      eye_medicine_required: participant.eye_medicine_required || false,
      eye_medicine_name: participant.eye_medicine_name || '',
      dental_medicine_required: participant.dental_medicine_required || false,
      dental_medicine_name: participant.dental_medicine_name || '',
      cancer_medicine_required: participant.cancer_medicine_required || false,
      cancer_medicine_name: participant.cancer_medicine_name || '',
      bp: participant.bp || '',
      spets: participant.spets || '',
      operation: participant.operation || '',
      completed_operation_date: participant.completed_operation_date || '',
      post_operation_date: participant.post_operation_date || '',
      dental_examination: participant.dental_examination || '',
      camp_location: participant.camp_location || '',
      cancer_screening: participant.cancer_screening || '',
      hb: participant.hb?.toString() || '',
      rbs: participant.rbs?.toString() || '',
      height: participant.height?.toString() || '',
      weight: participant.weight?.toString() || '',
      vision_left: participant.vision_left || '',
      vision_right: participant.vision_right || '',
      additional_data: (participant as any).additional_data || {},
      medicine: (participant as any).medicine || ''
    });
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this participant?')) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/participants/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete participant');
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
      name: '', aadhar: '', age: '', gender: 'Male', phone: '', address: '', state: '', district: '',
      assemblyconstituency: '', mandal: '', village: '', pincode: '', house_no: '', registration_source: '',
      blood_checkup: false, medicine_required: '', medicine_name: '', treatment_required: '', camp_category: '',
      eye_services: [], dental_services: [], cancer_services: [], general_services: [],
      eye_visual_acuity_left: '', eye_visual_acuity_right: '', eye_diagnosis: '', eye_identified_issues: '',
      eye_spectacles_recommended: false, eye_surgery_recommended: false, eye_follow_up_date: '', eye_additional_notes: '',
      eye_had_existing_spectacles: false, eye_vision_correction_required: false, eye_specify_vision_correction: false,
      eye_spectacles_provided: false, eye_spectacles_provided_date: '', eye_surgery_type: '', eye_surgery_prerequisites: '',
      eye_surgery_scheduled_date: '', eye_surgery_performed: false, eye_spectacles_advised_post_surgery: false,
      eye_post_surgery_follow_up: '', dental_oral_hygiene_status: '', dental_caries_present: false,
      dental_gum_disease_present: false, dental_tooth_extraction_recommended: false, dental_filling_recommended: false,
      dental_tooth_extraction_performed: false, dental_filling_performed: false, dental_root_canal_recommended: false,
      dental_dentures_recommended: false, dental_root_canal_performed: false, dental_dentures_provided: false,
      dental_follow_up_date: '', dental_additional_notes: '', dental_auditor: '', camp_id: '',
      general_height: '', general_weight: '', general_bmi: '', general_bsa: '', general_blood_pressure_systolic: '',
      general_blood_pressure_diastolic: '', general_presenting_complaints: '', general_examination_remarks: '',
      general_recommendations: '', blood_haemoglobin: '', blood_random_sugar: '', blood_other_information: '',
      blood_auditor: '', cancer_oral: false, cancer_breast: false, cancer_cervical: false, cancer_prostate: false,
      cancer_other: false, cancer_other_details: '', cancer_findings: '', cancer_recommendations: '',
      cancer_follow_up_date: '', general_medicine_required: false, general_medicine_name: '',
      blood_medicine_required: false, blood_medicine_name: '', eye_medicine_required: false, eye_medicine_name: '',
      dental_medicine_required: false, dental_medicine_name: '', cancer_medicine_required: false, cancer_medicine_name: '',
      bp: '', spets: '', operation: '', completed_operation_date: '', post_operation_date: '', dental_examination: '',
      camp_location: '', cancer_screening: '', hb: '', rbs: '', height: '', weight: '', vision_left: '', vision_right: '',
      additional_data: {},
      medicine: ''
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
      {successMessage && (<div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">{successMessage}</div>)}
      {errorMessage && (<div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">{errorMessage}</div>)}
    </>
  );

  const BasicInfoForm = ({ isViewMode = false }: { isViewMode?: boolean }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><User className="w-5 h-5" />Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          {isViewMode ? <p className="text-gray-900">{formData.name}</p> : 
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
          }
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number *</label>
          {isViewMode ? <p className="text-gray-900">{formData.aadhar}</p> : 
            <>
              <input 
                type="text" 
                name="aadhar" 
                value={formData.aadhar} 
                onChange={handleAadharChange} 
                maxLength={12} 
                ref={aadharInputRef} 
                required 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" 
              />
              {showSuggestions && aadharSuggestions.length > 0 && (
                <div ref={suggestionsRef} className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                  {aadharSuggestions.map((suggestion) => (
                    <div 
                      key={suggestion.id} 
                      onClick={() => handleSuggestionClick(suggestion)} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="font-medium">{suggestion.name}</div>
                      <div className="text-sm text-gray-500">Aadhar: {suggestion.aadhar}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          }
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          {isViewMode ? <p className="text-gray-900">{formData.age || 'Not specified'}</p> : 
            <input type="text" name="age" value={formData.age} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
          }
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          {isViewMode ? <p className="text-gray-900">{formData.gender || 'Not specified'}</p> : 
            <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          }
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          {isViewMode ? <p className="text-gray-900">{formData.phone}</p> : 
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} maxLength={10} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
          }
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Camp Source *</label>
          {isViewMode ? <p className="text-gray-900">{formData.registration_source}</p> : 
            <select name="registration_source" value={formData.registration_source} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]">
              <option value="">Select Camp</option>
              {camps.map((camp) => (
                <option key={camp.id} value={camp.camp_name}>{camp.camp_name} - {camp.date} - {camp.location}</option>
              ))}
            </select>
          }
        </div>
      </div>
      <div className="mt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Address Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">House No</label>
            {isViewMode ? <p className="text-gray-900">{formData.house_no || 'Not specified'}</p> : 
              <input type="text" name="house_no" value={formData.house_no} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
            }
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
            {isViewMode ? <p className="text-gray-900">{formData.village || 'Not specified'}</p> : 
              <input type="text" name="village" value={formData.village} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
            }
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mandal</label>
            {isViewMode ? <p className="text-gray-900">{formData.mandal || 'Not specified'}</p> : 
              <input type="text" name="mandal" value={formData.mandal} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
            }
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
            {isViewMode ? <p className="text-gray-900">{formData.district || 'Not specified'}</p> : 
              <input type="text" name="district" value={formData.district} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
            }
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Constituency</label>
            {isViewMode ? <p className="text-gray-900">{formData.assemblyconstituency || 'Not specified'}</p> : 
              <input type="text" name="assemblyconstituency" value={formData.assemblyconstituency} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
            }
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            {isViewMode ? <p className="text-gray-900">{formData.state || 'Not specified'}</p> : 
              <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
            }
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            {isViewMode ? <p className="text-gray-900">{formData.pincode || 'Not specified'}</p> : 
              <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
            }
          </div>
        </div>
        {formData.address && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">Full Address</p>
            <p className="text-gray-900">{formData.address}</p>
          </div>
        )}
      </div>
    </div>
  );

  const Pagination = () => {
    if (totalPages <= 1 && filteredParticipants.length <= itemsPerPage) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 bg-white border-t border-gray-200 gap-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{filteredParticipants.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</span>
          <span className="mx-1">-</span>
          <span className="font-medium">
            {filteredParticipants.length === 0 ? 0 : Math.min(currentPage * itemsPerPage, filteredParticipants.length)}
          </span>
          <span className="mx-1">of</span>
          <span className="font-medium">{filteredParticipants.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
              currentPage === 1
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-600 hover:bg-cyan-50 hover:border-cyan-400 hover:text-cyan-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className={`flex items-center justify-center min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  1 === currentPage
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-200'
                    : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-600'
                }`}
              >
                1
              </button>
              {startPage > 2 && (
                <span className="flex items-center justify-center min-w-[36px] h-9 px-2 text-sm text-gray-400">…</span>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`flex items-center justify-center min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                page === currentPage
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-200 scale-105'
                  : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-600'
              }`}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="flex items-center justify-center min-w-[36px] h-9 px-2 text-sm text-gray-400">…</span>
              )}
              <button
                onClick={() => goToPage(totalPages)}
                className={`flex items-center justify-center min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  totalPages === currentPage
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-200'
                    : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-600'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
              currentPage === totalPages
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-600 hover:bg-cyan-50 hover:border-cyan-400 hover:text-cyan-600'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const ModalWrapper = ({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-white/30">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col shadow-2xl relative">
        <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-[#00b4d8] text-white rounded-t-lg z-20">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div ref={modalContentRef} className="flex-1 overflow-y-auto p-6" style={{ paddingTop: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <MessageDisplay />
      <div className="mb-6"><h1 className="text-3xl font-bold text-gray-800">Participant Management</h1></div>
      
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 mr-4">
          <input type="text" placeholder="Search by Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} onKeyPress={handleKeyPress} className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
          <input type="text" placeholder="Search by Aadhar" value={searchAadhar} onChange={(e) => setSearchAadhar(e.target.value)} onKeyPress={handleKeyPress} className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
          <input type="text" placeholder="Search by Phone" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} onKeyPress={handleKeyPress} className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
          <button onClick={handleSearch} className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md flex items-center gap-2"><Search size={18} /> Search</button>
          {(searchName || searchAadhar || searchPhone) && (<button onClick={handleResetSearch} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">Reset</button>)}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsImportModalOpen(true)} disabled={loading} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md"><Upload size={18} /> Import Excel</button>
          <button onClick={() => setIsModalOpen(true)} disabled={loading} className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md"><Plus size={18} /> Add Participant</button>
        </div>
      </div>

      {/* Add Participant Modal */}
      {isModalOpen && (
        <ModalWrapper title="Add New Participant" onClose={handleClose}>
          <form onSubmit={handleSubmit}>
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><User className="w-5 h-5" />Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number *</label>
                  <input 
                    type="text" 
                    name="aadhar" 
                    value={formData.aadhar} 
                    onChange={handleAadharChange} 
                    maxLength={12} 
                    ref={aadharInputRef} 
                    required 
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" 
                  />
                  {showSuggestions && aadharSuggestions.length > 0 && (
                    <div ref={suggestionsRef} className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                      {aadharSuggestions.map((suggestion) => (
                        <div 
                          key={suggestion.id} 
                          onClick={() => handleSuggestionClick(suggestion)} 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <div className="font-medium">{suggestion.name}</div>
                          <div className="text-sm text-gray-500">Aadhar: {suggestion.aadhar}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input type="text" name="age" value={formData.age} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} maxLength={10} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Camp Source *</label>
                  <select name="registration_source" value={formData.registration_source} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]">
                    <option value="">Select Camp</option>
                    {camps.map((camp) => (
                      <option key={camp.id} value={camp.camp_name}>{camp.camp_name} - {camp.date} - {camp.location}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Address Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">House No</label>
                    <input type="text" name="house_no" value={formData.house_no} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                    <input type="text" name="village" value={formData.village} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mandal</label>
                    <input type="text" name="mandal" value={formData.mandal} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                    <input type="text" name="district" value={formData.district} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Constituency</label>
                    <input type="text" name="assemblyconstituency" value={formData.assemblyconstituency} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={generateAddress} 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    Generate Address
                  </button>
                  <span className="text-xs text-gray-500">Click to generate full address from address fields</span>
                </div>
                {formData.address && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">Generated Address: {formData.address}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Examination Type</label>
              <div className="flex flex-wrap gap-3">
                {['Eye', 'Dental', 'General Health', 'Blood Test', 'Cancer Screening'].map((tab) => (
                  <button key={tab} type="button" onClick={() => handleTabClick(tab)} 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab ? 'bg-[#00b4d8] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {activeTab === 'Eye' && <EyeExaminationEditForm />}
            {activeTab === 'Dental' && <DentalExaminationEditForm />}
            {activeTab === 'General Health' && <GeneralHealthExaminationEditForm />}
            {activeTab === 'Blood Test' && <BloodTestExaminationEditForm />}
            {activeTab === 'Cancer Screening' && <CancerScreeningEditForm />}
            <div className="pt-4 pb-2 border-t mt-6 flex justify-end gap-3">
              <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0097b2] transition-colors">
                {loading ? 'Saving...' : 'Save Participant'}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* Edit Participant Modal */}
      {isEditModalOpen && selectedParticipant && (
        <ModalWrapper title="Edit Participant" onClose={handleClose}>
          <form onSubmit={handleUpdate}>
            <div>
              <BasicInfoForm isViewMode={false} />
              <HealthExaminationDetails isViewMode={false} />
              <EyeExaminationDetails isViewMode={false} />
              <DentalExaminationDetails isViewMode={false} />
              <GeneralHealthDetails isViewMode={false} />
              <BloodTestDetails isViewMode={false} />
              <CancerScreeningDetails isViewMode={false} />
            </div>
            <div className="pt-4 pb-2 border-t mt-6 flex justify-end gap-3">
              <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0097b2] transition-colors">
                {loading ? 'Updating...' : 'Update Participant'}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* View Participant Modal */}
      {isViewModalOpen && selectedParticipant && (
        <ModalWrapper title="Participant Details - Complete Record" onClose={handleClose}>
          <div>
            <BasicInfoForm isViewMode={true} />
            <HealthExaminationDetails isViewMode={true} />
            <EyeExaminationDetails isViewMode={true} />
            <DentalExaminationDetails isViewMode={true} />
            <GeneralHealthDetails isViewMode={true} />
            <BloodTestDetails isViewMode={true} />
            <CancerScreeningDetails isViewMode={true} />
          </div>
          <div className="pt-4 pb-2 border-t mt-6 flex justify-end">
            <button onClick={handleClose} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">Close</button>
          </div>
        </ModalWrapper>
      )}

      {/* Import Excel Modal */}
      {isImportModalOpen && (
        <ModalWrapper title="Import Participants from Excel" onClose={closeImportModal}>
          <div>
            {importData.length === 0 ? (
              <div className="text-center py-8">
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                <p className="text-gray-500">Select an Excel file (.xlsx, .xls) or CSV to begin.</p>
                {importColumns.length > 0 && (
                  <div className="mt-4 text-left">
                    <p className="text-sm font-medium text-gray-700">Detected Columns ({importColumns.length}):</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {importColumns.map(col => (
                        <span key={col} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{col}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-green-600">{importData.length}</span> records ready to import
                      {importLoading && ` - Processing: ${importProgress.current} of ${importProgress.total}`}
                    </p>
                    <button 
                      onClick={() => { setImportFile(null); setImportData([]); setImportColumns([]); setImportErrors([]); }} 
                      className="text-sm text-red-600 hover:text-red-800"
                      disabled={importLoading}
                    >
                      Clear & choose another file
                    </button>
                  </div>
                  
                  {importLoading && importProgress.total > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round((importProgress.current / importProgress.total) * 100)}% complete
                      </p>
                    </div>
                  )}
                </div>
                
                {importErrors.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {importErrors.length} errors occurred:
                    </p>
                    <ul className="mt-1 text-xs text-red-600 list-disc list-inside">
                      {importErrors.slice(0, 10).map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                      {importErrors.length > 10 && (
                        <li>... and {importErrors.length - 10} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-96">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        {importColumns.slice(0, 8).map(col => (
                          <th key={col} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{col}</th>
                        ))}
                        {importColumns.length > 8 && (
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">...</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {importData.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-500">{idx + 1}</td>
                          {importColumns.slice(0, 8).map(col => (
                            <td key={col} className="px-4 py-2 text-sm text-gray-900">
                              {row[col] || row[col.toLowerCase()] || '-'}
                            </td>
                          ))}
                          {importColumns.length > 8 && (
                            <td className="px-4 py-2 text-sm text-gray-400">...</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {importData.length > 10 && (
                    <div className="p-2 text-center text-sm text-gray-500 border-t">
                      ... and {importData.length - 10} more rows
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="pt-4 pb-2 border-t mt-6 flex justify-end gap-3">
            <button onClick={closeImportModal} disabled={importLoading} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors">Cancel</button>
            <button 
              onClick={handleImportConfirm} 
              disabled={importLoading || importData.length === 0} 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importLoading ? (
                <>
                  <ActivityIndicator size="sm" />
                  Importing... {importProgress.current}/{importProgress.total}
                </>
              ) : (
                `Import All ${importData.length} Records`
              )}
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* Participants Table - WITH CENTER ALIGNMENT AND Sl.No */}
      <div className="bg-white border border-[#90e0ef] rounded-lg shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <ActivityIndicator size="lg" />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-100 text-gray-700">
                <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
                  <th className="px-4 py-3 text-center font-medium">Sl.No</th>
                  <th className="px-4 py-3 text-center font-medium">Name</th>
                  <th className="px-4 py-3 text-center font-medium">Age</th>
                  <th className="px-4 py-3 text-center font-medium">Gender</th>
                  <th className="px-4 py-3 text-center font-medium">Phone</th>
                  <th className="px-4 py-3 text-center font-medium">Aadhar</th>
                  <th className="px-4 py-3 text-center font-medium">Updated On</th>
                  <th className="px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageItems().map((p, index) => (
                  <tr key={p.id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-4 py-3 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 text-center">{p.name}</td>
                    <td className="px-4 py-3 text-center">{p.age}</td>
                    <td className="px-4 py-3 text-center">{p.gender}</td>
                    <td className="px-4 py-3 text-center">{p.phone}</td>
                    <td className="px-4 py-3 text-center">{p.aadhar}</td>
                    <td className="px-4 py-3 text-center">{formatDateOnly(p.updated_on)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleView(p)} className="bg-blue-300 hover:bg-blue-500 text-black p-2 rounded-lg" title="View">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleEdit(p)} className="bg-orange-300 hover:bg-orange-500 text-black p-2 rounded-lg" title="Edit">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="bg-red-300 hover:bg-red-500 text-black p-2 rounded-lg" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredParticipants.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">No participants found</div>
            )}
            {filteredParticipants.length > 0 && <Pagination />}
          </>
        )}
      </div>
    </div>
  );
};

export default ParticipantManagement;
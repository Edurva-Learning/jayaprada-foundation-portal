// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { Pencil, Trash2, Plus, X, Eye, Search, User, Pill, Upload } from 'lucide-react';
// import * as XLSX from 'xlsx';

// interface Participant {
//   id: number;
//   name: string;
//   aadhar: string;
//   age?: number | string;
//   gender?: string;
//   phone: string;
//   address: string;
//   state: string;
//   assemblyconstituency: string;
//   district: string;
//   mandal: string;
//   village: string;
//   pincode: string;
//   house_no?: string;
//   registration_source: string;
//   created_at: string;
//   blood_checkup: boolean;
//   medicine_required: string;
//   medicine_name: string;
//   treatment_required: string;
// }

// interface Camp {
//   id: number;
//   camp_name: string;
//   date: string;
//   location: string;
//   services: string;
//   status: string;
// }

// const ParticipantManagement: React.FC = () => {
//   const [participants, setParticipants] = useState<Participant[]>([]);
//   const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
//   const [camps, setCamps] = useState<Camp[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [searchName, setSearchName] = useState('');
//   const [searchAadhar, setSearchAadhar] = useState('');
//   const [searchPhone, setSearchPhone] = useState('');
//   const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [activeTab, setActiveTab] = useState<string>('');
//   const [aadharSuggestions, setAadharSuggestions] = useState<Participant[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   // Excel import states
//   const [isImportModalOpen, setIsImportModalOpen] = useState(false);
//   const [importFile, setImportFile] = useState<File | null>(null);
//   const [importData, setImportData] = useState<any[]>([]);
//   const [importLoading, setImportLoading] = useState(false);

//   const aadharInputRef = useRef<HTMLInputElement>(null);
//   const suggestionsRef = useRef<HTMLDivElement>(null);

//   const [formData, setFormData] = useState({
//     name: '',
//     aadhar: '',
//     age: '',
//     gender: 'Male',
//     phone: '',
//     address: '',
//     state: '',
//     district: '',
//     assemblyconstituency: '',
//     mandal: '',
//     village: '',
//     pincode: '',
//     house_no: '',
//     registration_source: '',
//     blood_checkup: false,
//     medicine_required: '',
//     medicine_name: '',
//     treatment_required: '',
//     camp_category: '',
//     eye_services: [] as string[],
//     dental_services: [] as string[],
//     cancer_services: [] as string[],
//     general_services: [] as string[],
//     // Eye examination fields
//     eye_visual_acuity_left: '',
//     eye_visual_acuity_right: '',
//     eye_diagnosis: '',
//     eye_identified_issues: '',
//     eye_spectacles_recommended: false,
//     eye_surgery_recommended: false,
//     eye_follow_up_date: '',
//     eye_additional_notes: '',
//     eye_had_existing_spectacles: false,
//     eye_vision_correction_required: false,
//     eye_specify_vision_correction: false,
//     eye_spectacles_provided: false,
//     eye_spectacles_provided_date: '',
//     eye_surgery_type: '',
//     eye_surgery_prerequisites: '',
//     eye_surgery_scheduled_date: '',
//     eye_surgery_performed: false,
//     eye_spectacles_advised_post_surgery: false,
//     eye_post_surgery_follow_up: '',
//     // Dental examination fields
//     dental_oral_hygiene_status: '',
//     dental_caries_present: false,
//     dental_gum_disease_present: false,
//     dental_tooth_extraction_recommended: false,
//     dental_filling_recommended: false,
//     dental_tooth_extraction_performed: false,
//     dental_filling_performed: false,
//     dental_root_canal_recommended: false,
//     dental_dentures_recommended: false,
//     dental_root_canal_performed: false,
//     dental_dentures_provided: false,
//     dental_follow_up_date: '',
//     dental_additional_notes: '',
//     dental_auditor: '',
//     camp_id: '',
//     // General Health Examination fields
//     general_height: '',
//     general_weight: '',
//     general_bmi: '',
//     general_bsa: '',
//     general_blood_pressure_systolic: '',
//     general_blood_pressure_diastolic: '',
//     general_presenting_complaints: '',
//     general_examination_remarks: '',
//     general_recommendations: '',
//     // Blood Test fields
//     blood_haemoglobin: '',
//     blood_random_sugar: '',
//     blood_other_information: '',
//     blood_auditor: '',
//     // Cancer Screening fields
//     cancer_oral: false,
//     cancer_breast: false,
//     cancer_cervical: false,
//     cancer_prostate: false,
//     cancer_other: false,
//     cancer_other_details: '',
//     cancer_findings: '',
//     cancer_recommendations: '',
//     cancer_follow_up_date: '',
//     // Medicine fields for each tab
//     general_medicine_required: false,
//     general_medicine_name: '',
//     blood_medicine_required: false,
//     blood_medicine_name: '',
//     eye_medicine_required: false,
//     eye_medicine_name: '',
//     dental_medicine_required: false,
//     dental_medicine_name: '',
//     cancer_medicine_required: false,
//     cancer_medicine_name: ''
//   });

//   // const API_BASE_URL = 'https://api.jpf-portal-api.com';
//   const API_BASE_URL ='http://localhost:5000';

//   const eyeServices = ['Spectacles', 'Cataract', 'Pterygium', 'Other'];
//   const dentalServices = ['Cleaning', 'Filling', 'Extraction', 'Root Canal', 'Other'];
//   const cancerServices = ['Oral Cancer', 'Breast Cancer', 'Cervical Cancer', 'Prostate Cancer', 'Other'];
//   const generalServices = ['Blood Pressure', 'Sugar Test', 'ECG', 'X-Ray', 'Other'];
//   const surgeryTypes = ['Cataract Surgery', 'LASIK', 'Glaucoma Surgery', 'Retinal Surgery', 'Other'];

//   // Handle click outside to close suggestions
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
//           aadharInputRef.current && !aadharInputRef.current.contains(event.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Calculate BMI and BSA when height or weight changes
//   useEffect(() => {
//     if (formData.general_height && formData.general_weight) {
//       const heightInMeters = parseFloat(formData.general_height) / 100;
//       const weight = parseFloat(formData.general_weight);
      
//       // Calculate BMI
//       const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      
//       // Calculate BSA (Mosteller formula)
//       const bsa = Math.sqrt((parseFloat(formData.general_height) * weight) / 3600).toFixed(2);
      
//       setFormData(prev => ({
//         ...prev,
//         general_bmi: bmi,
//         general_bsa: bsa
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         general_bmi: '',
//         general_bsa: ''
//       }));
//     }
//   }, [formData.general_height, formData.general_weight]);

//   const showSuccess = (message: string) => {
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 5000);
//   };

//   const showError = (message: string) => {
//     setErrorMessage(message);
//     setTimeout(() => setErrorMessage(''), 5000);
//   };

//   const fetchParticipants = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}/participants`);
//       const data = await res.json() as Participant[];
//       console.log('API Response - First participant:', data[0]); // Debug log
//       // Ensure age and gender fields exist, set to empty string if missing
//       const enrichedData = data.map(p => ({
//         ...p,
//         age: p.age || '',
//         gender: p.gender || ''
//       }));
//       setParticipants(enrichedData);
//       setFilteredParticipants(enrichedData);
//     } catch (err) {
//       console.error('Error fetching participants:', err);
//       showError('Failed to fetch participants');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCamps = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/camps`);
//       const data = await res.json();
//       setCamps(data);
//     } catch (err) {
//       console.error('Error fetching camps:', err);
//     }
//   };

//   useEffect(() => {
//     fetchParticipants();
//     fetchCamps();
//   }, []);

//   useEffect(() => {
//     const addressParts = [];
    
//     if (formData.house_no) addressParts.push(`H.No: ${formData.house_no}`);
//     if (formData.village) addressParts.push(`Village: ${formData.village}`);
//     if (formData.mandal) addressParts.push(`Mandal: ${formData.mandal}`);
//     if (formData.district) addressParts.push(`District: ${formData.district}`);
//     if (formData.assemblyconstituency) addressParts.push(`Constituency: ${formData.assemblyconstituency}`);
//     if (formData.state) addressParts.push(`State: ${formData.state}`);
//     if (formData.pincode) addressParts.push(`Pincode: ${formData.pincode}`);
    
//     const generatedAddress = addressParts.join(', ');
    
//     if (generatedAddress) {
//       setFormData(prev => ({
//         ...prev,
//         address: generatedAddress
//       }));
//     }
//   }, [
//     formData.house_no,
//     formData.village,
//     formData.mandal,
//     formData.district,
//     formData.assemblyconstituency,
//     formData.state,
//     formData.pincode
//   ]);

//   // Handle Aadhar input change for suggestions
//   const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setFormData(prev => ({ ...prev, aadhar: value }));

//     if (value.length >= 4) {
//       const filtered = participants.filter(participant =>
//         participant.aadhar.includes(value)
//       );
//       setAadharSuggestions(filtered);
//       setShowSuggestions(true);
//     } else {
//       setAadharSuggestions([]);
//       setShowSuggestions(false);
//     }
//   };

//   // Handle suggestion click
//   const handleSuggestionClick = (participant: Participant) => {
//     setFormData({
//       ...formData,
//       name: participant.name,
//       aadhar: participant.aadhar,
//       age: (participant.age || '').toString(),
//       gender: participant.gender || 'Male',
//       phone: participant.phone,
//       address: participant.address,
//       state: participant.state,
//       district: participant.district,
//       assemblyconstituency: participant.assemblyconstituency,
//       mandal: participant.mandal,
//       village: participant.village,
//       pincode: participant.pincode,
//       house_no: participant.house_no || '',
//       registration_source: participant.registration_source,
//       blood_checkup: participant.blood_checkup,
//       medicine_required: participant.medicine_required,
//       medicine_name: participant.medicine_name,
//       treatment_required: participant.treatment_required
//     });
//     setAadharSuggestions([]);
//     setShowSuggestions(false);
//   };

//   const handleTabClick = (tab: string) => {
//     setActiveTab(tab);
//     setFormData(prev => ({
//       ...prev,
//       camp_category: tab
//     }));
//   };

//   const handleSearch = () => {
//     if (searchName === '' && searchAadhar === '' && searchPhone === '') {
//       setFilteredParticipants(participants);
//       return;
//     }

//     const filtered = participants.filter(participant => {
//       const nameMatch = participant.name.toLowerCase().includes(searchName.toLowerCase());
//       const aadharMatch = participant.aadhar.includes(searchAadhar);
//       const phoneMatch = participant.phone.includes(searchPhone);
      
//       return (searchName === '' || nameMatch) && 
//              (searchAadhar === '' || aadharMatch) && 
//              (searchPhone === '' || phoneMatch);
//     });
//     setFilteredParticipants(filtered);
//   };

//   const handleResetSearch = () => {
//     setSearchName('');
//     setSearchAadhar('');
//     setSearchPhone('');
//     setFilteredParticipants(participants);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
    
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setFormData((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleServiceCheckboxChange = (serviceType: string, service: string, checked: boolean) => {
//     if (serviceType === 'eye') {
//       setFormData(prev => ({
//         ...prev,
//         eye_services: checked 
//           ? [...prev.eye_services, service]
//           : prev.eye_services.filter(s => s !== service)
//       }));
//     } else if (serviceType === 'dental') {
//       setFormData(prev => ({
//         ...prev,
//         dental_services: checked 
//           ? [...prev.dental_services, service]
//           : prev.dental_services.filter(s => s !== service)
//       }));
//     } else if (serviceType === 'cancer') {
//       setFormData(prev => ({
//         ...prev,
//         cancer_services: checked 
//           ? [...prev.cancer_services, service]
//           : prev.cancer_services.filter(s => s !== service)
//       }));
//     } else if (serviceType === 'general') {
//       setFormData(prev => ({
//         ...prev,
//         general_services: checked 
//           ? [...prev.general_services, service]
//           : prev.general_services.filter(s => s !== service)
//       }));
//     }
//   };

//   // Medicine Required Component for each tab
//   const MedicineRequiredSection = ({ tabName }: { tabName: string }) => {
//     const medicineRequiredField = `${tabName.toLowerCase().replace(' ', '_')}_medicine_required` as keyof typeof formData;
//     const medicineNameField = `${tabName.toLowerCase().replace(' ', '_')}_medicine_name` as keyof typeof formData;

//     return (
//       <div className="mb-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
//         <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
//           <Pill className="w-5 h-5" />
//           Medicine Information
//         </h4>
//         <div className="space-y-4">
//           <label className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
//             <input
//               type="checkbox"
//               name={medicineRequiredField as string}
//               checked={formData[medicineRequiredField] as boolean}
//               onChange={handleInputChange}
//               className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//             />
//             <span className="text-sm font-medium text-gray-700">Medicine Required for {tabName}</span>
//           </label>
          
//           {(formData[medicineRequiredField] as boolean) && (
//             <div className="bg-white p-4 rounded-lg border border-blue-200">
//               <label className="block text-sm font-medium text-blue-700 mb-2">
//                 Medicine Name
//               </label>
//               <input
//                 type="text"
//                 name={medicineNameField as string}
//                 value={formData[medicineNameField] as string}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder={`Enter medicine name for ${tabName}`}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Eye Examination Form Component
//   const EyeExaminationForm = () => (
//     <div className="bg-white p-6 rounded-lg border border-blue-200">
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold text-blue-800 mb-4">Eye Examination Form</h3>
//         <div className="bg-blue-50 p-4 rounded-lg">
//           <p className="text-blue-700"><strong>Camp:</strong> {formData.registration_source || 'Not selected'} | <strong>Participant:</strong> {formData.name || 'Not provided'}</p>
//         </div>
//       </div>

//       {/* Medicine Required Section for Eye */}
//       <MedicineRequiredSection tabName="Eye" />

//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Basic Examination</h4>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Visual Acuity (Left)</label>
//             <input
//               type="text"
//               name="eye_visual_acuity_left"
//               value={formData.eye_visual_acuity_left}
//               onChange={handleInputChange}
//               placeholder="e.g., 6/6, 6/12"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Visual Acuity (Right)</label>
//             <input
//               type="text"
//               name="eye_visual_acuity_right"
//               value={formData.eye_visual_acuity_right}
//               onChange={handleInputChange}
//               placeholder="e.g., 6/6, 6/12"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
//             <input
//               type="text"
//               name="eye_diagnosis"
//               value={formData.eye_diagnosis}
//               onChange={handleInputChange}
//               placeholder="Primary diagnosis"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Identified Vision Issues</label>
//         <textarea
//           name="eye_identified_issues"
//           value={formData.eye_identified_issues}
//           onChange={handleInputChange}
//           rows={3}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//           placeholder="Describe any identified vision issues..."
//         />
//       </div>

//       {/* Spectacles Recommendation Section */}
//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Spectacles Recommendation</h4>
        
//         <div className="space-y-3 mb-4">
//           <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
//             <input
//               type="checkbox"
//               name="eye_spectacles_recommended"
//               checked={formData.eye_spectacles_recommended}
//               onChange={handleInputChange}
//               className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//             />
//             <span className="text-sm font-medium text-gray-700">Spectacles Recommended</span>
//           </label>
          
//           {formData.eye_spectacles_recommended && (
//             <>
//               <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
//                 <input
//                   type="checkbox"
//                   name="eye_had_existing_spectacles"
//                   checked={formData.eye_had_existing_spectacles}
//                   onChange={handleInputChange}
//                   className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Had Existing Spectacles</span>
//               </label>
              
//               <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
//                 <input
//                   type="checkbox"
//                   name="eye_vision_correction_required"
//                   checked={formData.eye_vision_correction_required}
//                   onChange={handleInputChange}
//                   className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Vision Correction Required</span>
//               </label>

//               {/* Vision Correction Details */}
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-4 transition-all duration-300">
//                 <h5 className="text-md font-semibold text-blue-800 mb-4 flex items-center">
//                   <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
//                   Vision Correction Details
//                 </h5>
                
//                 <div className="space-y-3 mb-4">
//                   <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name="eye_specify_vision_correction"
//                       checked={formData.eye_specify_vision_correction}
//                       onChange={handleInputChange}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <span className="text-sm text-gray-700">Specify vision correction requirements</span>
//                   </label>
                  
//                   <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name="eye_spectacles_provided"
//                       checked={formData.eye_spectacles_provided}
//                       onChange={handleInputChange}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <span className="text-sm text-gray-700">Spectacles Provided</span>
//                   </label>
//                 </div>
                
//                 {formData.eye_spectacles_provided && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Date Provided</label>
//                       <input
//                         type="date"
//                         name="eye_spectacles_provided_date"
//                         value={formData.eye_spectacles_provided_date}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Surgery Recommendation Section */}
//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Surgery Recommendation</h4>
        
//         <div className="space-y-3 mb-4">
//           <label className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">
//             <input
//               type="checkbox"
//               name="eye_surgery_recommended"
//               checked={formData.eye_surgery_recommended}
//               onChange={handleInputChange}
//               className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
//             />
//             <span className="text-sm font-medium text-gray-700">Surgery Recommended</span>
//           </label>

//           {formData.eye_surgery_recommended && (
//             <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-200 mb-4 transition-all duration-300">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Type</label>
//                   <select
//                     name="eye_surgery_type"
//                     value={formData.eye_surgery_type}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
//                   >
//                     <option value="">Select Surgery Type</option>
//                     {surgeryTypes.map(type => (
//                       <option key={type} value={type}>{type}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Scheduled Date</label>
//                   <input
//                     type="date"
//                     name="eye_surgery_scheduled_date"
//                     value={formData.eye_surgery_scheduled_date}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
//                   />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Pre-requisites</label>
//                 <textarea
//                   name="eye_surgery_prerequisites"
//                   value={formData.eye_surgery_prerequisites}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
//                   placeholder="Any pre-requisites for surgery"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="eye_surgery_performed"
//                     checked={formData.eye_surgery_performed}
//                     onChange={handleInputChange}
//                     className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
//                   />
//                   <span className="text-sm text-gray-700">Surgery Performed</span>
//                 </label>
                
//                 <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="eye_spectacles_advised_post_surgery"
//                     checked={formData.eye_spectacles_advised_post_surgery}
//                     onChange={handleInputChange}
//                     className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
//                   />
//                   <span className="text-sm text-gray-700">Spectacles Advised Post Surgery</span>
//                 </label>
//               </div>

//               <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Post-Surgery Follow-up</label>
//                 <input
//                   type="date"
//                   name="eye_post_surgery_follow_up"
//                   value={formData.eye_post_surgery_follow_up}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Follow-up Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">General Follow-up Date</label>
//             <input
//               type="date"
//               name="eye_follow_up_date"
//               value={formData.eye_follow_up_date}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//             />
//           </div>
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
//             <textarea
//               name="eye_additional_notes"
//               value={formData.eye_additional_notes}
//               onChange={handleInputChange}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               placeholder="Any additional observations or notes"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Dental Examination Form Component
//   const DentalExaminationForm = () => (
//     <div className="bg-white p-6 rounded-lg border border-blue-200">
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold text-blue-800 mb-4">Dental Examination Form</h3>
//         <div className="bg-blue-50 p-4 rounded-lg">
//           <p className="text-blue-700">
//             <strong>Camp:</strong> {formData.registration_source || 'Not selected'} |{' '}
//             <strong>Participant:</strong> {formData.name || 'Not provided'} |{' '}
//             <strong>Camp ID:</strong> {formData.camp_id || 'Not provided'}
//           </p>
//         </div>
//       </div>

//       {/* Medicine Required Section for Dental */}
//       <MedicineRequiredSection tabName="Dental" />

//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Basic Dental Examination</h4>
        
//         {/* Oral Hygiene Status */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-3">Oral Hygiene Status</label>
//           <div className="flex gap-6">
//             <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
//               <input
//                 type="radio"
//                 name="dental_oral_hygiene_status"
//                 value="Good"
//                 checked={formData.dental_oral_hygiene_status === 'Good'}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Good</span>
//             </label>
            
//             <label className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors cursor-pointer">
//               <input
//                 type="radio"
//                 name="dental_oral_hygiene_status"
//                 value="Fair"
//                 checked={formData.dental_oral_hygiene_status === 'Fair'}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Fair</span>
//             </label>
            
//             <label className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">
//               <input
//                 type="radio"
//                 name="dental_oral_hygiene_status"
//                 value="Poor"
//                 checked={formData.dental_oral_hygiene_status === 'Poor'}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Poor</span>
//             </label>
//           </div>
//         </div>

//         {/* Dental Conditions */}
//         <div className="space-y-3">
//           <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
//             <input
//               type="checkbox"
//               name="dental_caries_present"
//               checked={formData.dental_caries_present || false}
//               onChange={handleInputChange}
//               className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
//             />
//             <span className="text-sm font-medium text-gray-700">Dental Caries Present</span>
//           </label>
          
//           <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
//             <input
//               type="checkbox"
//               name="dental_gum_disease_present"
//               checked={formData.dental_gum_disease_present || false}
//               onChange={handleInputChange}
//               className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
//             />
//             <span className="text-sm font-medium text-gray-700">Gum Disease Present</span>
//           </label>
//         </div>
//       </div>

//       {/* Treatment Recommendations */}
//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Treatment Recommendations</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-3">
//             <label className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="dental_tooth_extraction_recommended"
//                 checked={formData.dental_tooth_extraction_recommended || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Tooth Extraction Recommended</span>
//             </label>
            
//             <label className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="dental_filling_recommended"
//                 checked={formData.dental_filling_recommended || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Filling Recommended</span>
//             </label>
            
//             <label className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="dental_root_canal_recommended"
//                 checked={formData.dental_root_canal_recommended || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Root Canal Recommended</span>
//             </label>
            
//             <label className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="dental_dentures_recommended"
//                 checked={formData.dental_dentures_recommended || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Dentures Recommended</span>
//             </label>
//           </div>
          
//           <div className="space-y-3">
//             <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="dental_tooth_extraction_performed"
//                 checked={formData.dental_tooth_extraction_performed || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Tooth Extraction Performed</span>
//             </label>
            
//             <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="dental_filling_performed"
//                 checked={formData.dental_filling_performed || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Filling Performed</span>
//             </label>
            
//             <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="dental_root_canal_performed"
//                 checked={formData.dental_root_canal_performed || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Root Canal Performed</span>
//             </label>
            
//             <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="dental_dentures_provided"
//                 checked={formData.dental_dentures_provided || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Dentures Provided</span>
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Follow-up Information */}
//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Follow-up Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
//             <input
//               type="date"
//               name="dental_follow_up_date"
//               value={formData.dental_follow_up_date || ''}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Additional Notes */}
//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Additional Notes</h4>
//         <textarea
//           name="dental_additional_notes"
//           value={formData.dental_additional_notes || ''}
//           onChange={handleInputChange}
//           rows={4}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//           placeholder="Any additional observations or notes"
//         />
//       </div>

//       {/* Dental Auditor */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Dental Auditor</label>
//         <input
//           type="text"
//           name="dental_auditor"
//           value={formData.dental_auditor || ''}
//           onChange={handleInputChange}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//           placeholder="Enter dental auditor name"
//         />
//       </div>
//     </div>
//   );

//   // General Health Examination Form
//   const GeneralHealthExaminationForm = () => (
//     <div className="bg-white p-6 rounded-lg border border-blue-200">
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold text-blue-800 mb-4">General Health Examination</h3>
//         <div className="bg-blue-50 p-4 rounded-lg">
//           <p className="text-blue-700">
//             <strong>Camp:</strong> {formData.registration_source || 'Not selected'} |{' '}
//             <strong>Participant:</strong> {formData.name || 'Not provided'} |{' '}
//             <strong>Camp ID:</strong> {formData.camp_id || 'Not provided'}
//           </p>
//         </div>
//       </div>

//       {/* Medicine Required Section for General Checkup */}
//       <MedicineRequiredSection tabName="General Checkup" />

//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Physical Measurements</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
//               <input
//                 type="number"
//                 name="general_height"
//                 value={formData.general_height}
//                 onChange={handleInputChange}
//                 placeholder="Enter height"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure - Systolic (mm/Hg)</label>
//               <input
//                 type="number"
//                 name="general_blood_pressure_systolic"
//                 value={formData.general_blood_pressure_systolic}
//                 onChange={handleInputChange}
//                 placeholder="Systolic pressure"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">BMI (Calculated)</label>
//               <input
//                 type="text"
//                 name="general_bmi"
//                 value={formData.general_bmi}
//                 readOnly
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
//                 placeholder="Auto-calculated"
//               />
//             </div>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
//               <input
//                 type="number"
//                 name="general_weight"
//                 value={formData.general_weight}
//                 onChange={handleInputChange}
//                 placeholder="Enter weight"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure - Diastolic (mm/Hg)</label>
//               <input
//                 type="number"
//                 name="general_blood_pressure_diastolic"
//                 value={formData.general_blood_pressure_diastolic}
//                 onChange={handleInputChange}
//                 placeholder="Diastolic pressure"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">BSA (Calculated)</label>
//               <input
//                 type="text"
//                 name="general_bsa"
//                 value={formData.general_bsa}
//                 readOnly
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
//                 placeholder="Body Surface Area (m²)"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Clinical Assessment</h4>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Presenting Complaints</label>
//             <textarea
//               name="general_presenting_complaints"
//               value={formData.general_presenting_complaints}
//               onChange={handleInputChange}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               placeholder="Describe the participant's main complaints"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Examination Remarks</label>
//             <textarea
//               name="general_examination_remarks"
//               value={formData.general_examination_remarks}
//               onChange={handleInputChange}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               placeholder="Enter examination findings and observations"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
//             <textarea
//               name="general_recommendations"
//               value={formData.general_recommendations}
//               onChange={handleInputChange}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               placeholder="Enter any recommendations or follow-up advice"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Blood Test Examination Form
//   const BloodTestExaminationForm = () => (
//     <div className="bg-white p-6 rounded-lg border border-blue-200">
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold text-blue-800 mb-4">Blood Test Examination</h3>
//         <div className="bg-blue-50 p-4 rounded-lg">
//           <p className="text-blue-700">
//             <strong>Camp:</strong> {formData.registration_source || 'Not selected'} |{' '}
//             <strong>Participant:</strong> {formData.name || 'Not provided'} |{' '}
//             <strong>Camp ID:</strong> {formData.camp_id || 'Not provided'}
//           </p>
//         </div>
//       </div>

//       {/* Medicine Required Section for Blood Test */}
//       <MedicineRequiredSection tabName="Blood Test" />

//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Blood Test Parameters</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Haemoglobin (g/dL)</label>
//               <input
//                 type="number"
//                 name="blood_haemoglobin"
//                 value={formData.blood_haemoglobin}
//                 onChange={handleInputChange}
//                 placeholder="Enter haemoglobin value"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Normal range: 12-16 g/dL for women, 13-17 g/dL for men
//               </p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Random Blood Sugar (mg/dL)</label>
//               <input
//                 type="number"
//                 name="blood_random_sugar"
//                 value={formData.blood_random_sugar}
//                 onChange={handleInputChange}
//                 placeholder="Enter random blood sugar"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Random capillary glucose measured anytime (not fasting)
//               </p>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Other Information / Additional Tests</label>
//             <textarea
//               name="blood_other_information"
//               value={formData.blood_other_information}
//               onChange={handleInputChange}
//               rows={8}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               placeholder="Enter any other blood test findings or information"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Blood Auditor */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Blood Test Auditor</label>
//         <input
//           type="text"
//           name="blood_auditor"
//           value={formData.blood_auditor || ''}
//           onChange={handleInputChange}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//           placeholder="Enter blood test auditor name"
//         />
//       </div>
//     </div>
//   );

//   // Cancer Screening Form
//   const CancerScreeningForm = () => (
//     <div className="bg-white p-6 rounded-lg border border-blue-200">
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold text-blue-800 mb-4">Cancer Screening</h3>
//         <div className="bg-blue-50 p-4 rounded-lg">
//           <p className="text-blue-700">
//             <strong>Camp:</strong> {formData.registration_source || 'Not selected'} |{' '}
//             <strong>Participant:</strong> {formData.name || 'Not provided'} |{' '}
//             <strong>Camp ID:</strong> {formData.camp_id || 'Not provided'}
//           </p>
//         </div>
//       </div>

//       {/* Medicine Required Section for Cancer Screening */}
//       <MedicineRequiredSection tabName="Cancer Screening" />

//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Cancer Screening Types</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-3">
//             <label className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="cancer_oral"
//                 checked={formData.cancer_oral || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Oral Cancer</span>
//             </label>
            
//             <label className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="cancer_breast"
//                 checked={formData.cancer_breast || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Breast Cancer</span>
//             </label>
            
//             <label className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="cancer_cervical"
//                 checked={formData.cancer_cervical || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Cervical Cancer</span>
//             </label>
//           </div>
          
//           <div className="space-y-3">
//             <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="cancer_prostate"
//                 checked={formData.cancer_prostate || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Prostate Cancer</span>
//             </label>
            
//             <label className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="cancer_other"
//                 checked={formData.cancer_other || false}
//                 onChange={handleInputChange}
//                 className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Other</span>
//             </label>
            
//             {formData.cancer_other && (
//               <div className="mt-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Specify Other Cancer Type</label>
//                 <input
//                   type="text"
//                   name="cancer_other_details"
//                   value={formData.cancer_other_details || ''}
//                   onChange={handleInputChange}
//                   placeholder="Enter other cancer type"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Screening Findings</h4>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Findings</label>
//             <textarea
//               name="cancer_findings"
//               value={formData.cancer_findings || ''}
//               onChange={handleInputChange}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               placeholder="Enter screening findings and observations"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
//             <textarea
//               name="cancer_recommendations"
//               value={formData.cancer_recommendations || ''}
//               onChange={handleInputChange}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//               placeholder="Enter recommendations and follow-up advice"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-900 mb-3">Follow-up Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
//             <input
//               type="date"
//               name="cancer_follow_up_date"
//               value={formData.cancer_follow_up_date || ''}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition-colors"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);

//       console.log('Form data being sent:', formData);
      
//       if (!formData.name || !formData.registration_source || !formData.aadhar || !formData.phone) {
//         showError('Please fill in all required fields including Aadhar and Phone number');
//         return;
//       }

//       if (formData.aadhar.length !== 12 || !/^\d+$/.test(formData.aadhar)) {
//         showError('Please enter a valid 12-digit Aadhar number');
//         return;
//       }

//       if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
//         showError('Please enter a valid 10-digit phone number');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/participants`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       });

//       const result = await response.json();
//       console.log('API Response:', result);

//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to create participant');
//       }

//       await fetchParticipants();
//       setFormData({
//         name: '',
//         aadhar: '',
//         age: '',
//         gender: 'Male',
//         phone: '',
//         address: '',
//         state: '',
//         district: '',
//         assemblyconstituency: '',
//         mandal: '',
//         village: '',
//         pincode: '',
//         house_no: '',
//         registration_source: '',
//         blood_checkup: false,
//         medicine_required: '',
//         medicine_name: '',
//         treatment_required: '',
//         camp_category: '',
//         eye_services: [],
//         dental_services: [],
//         cancer_services: [],
//         general_services: [],
//         eye_visual_acuity_left: '',
//         eye_visual_acuity_right: '',
//         eye_diagnosis: '',
//         eye_identified_issues: '',
//         eye_spectacles_recommended: false,
//         eye_surgery_recommended: false,
//         eye_follow_up_date: '',
//         eye_additional_notes: '',
//         eye_had_existing_spectacles: false,
//         eye_vision_correction_required: false,
//         eye_specify_vision_correction: false,
//         eye_spectacles_provided: false,
//         eye_spectacles_provided_date: '',
//         eye_surgery_type: '',
//         eye_surgery_prerequisites: '',
//         eye_surgery_scheduled_date: '',
//         eye_surgery_performed: false,
//         eye_spectacles_advised_post_surgery: false,
//         eye_post_surgery_follow_up: '',
//         dental_oral_hygiene_status: '',
//         dental_caries_present: false,
//         dental_gum_disease_present: false,
//         dental_tooth_extraction_recommended: false,
//         dental_filling_recommended: false,
//         dental_tooth_extraction_performed: false,
//         dental_filling_performed: false,
//         dental_root_canal_recommended: false,
//         dental_dentures_recommended: false,
//         dental_root_canal_performed: false,
//         dental_dentures_provided: false,
//         dental_follow_up_date: '',
//         dental_additional_notes: '',
//         dental_auditor: '',
//         camp_id: '',
//         general_height: '',
//         general_weight: '',
//         general_bmi: '',
//         general_bsa: '',
//         general_blood_pressure_systolic: '',
//         general_blood_pressure_diastolic: '',
//         general_presenting_complaints: '',
//         general_examination_remarks: '',
//         general_recommendations: '',
//         blood_haemoglobin: '',
//         blood_random_sugar: '',
//         blood_other_information: '',
//         blood_auditor: '',
//         cancer_oral: false,
//         cancer_breast: false,
//         cancer_cervical: false,
//         cancer_prostate: false,
//         cancer_other: false,
//         cancer_other_details: '',
//         cancer_findings: '',
//         cancer_recommendations: '',
//         cancer_follow_up_date: '',
//         general_medicine_required: false,
//         general_medicine_name: '',
//         blood_medicine_required: false,
//         blood_medicine_name: '',
//         eye_medicine_required: false,
//         eye_medicine_name: '',
//         dental_medicine_required: false,
//         dental_medicine_name: '',
//         cancer_medicine_required: false,
//         cancer_medicine_name: ''
//       });
//       setActiveTab('');
//       setIsModalOpen(false);
//       showSuccess('Participant added successfully!');
//     } catch (err) {
//       console.error('Error saving participant:', err);
//       showError('Failed to save participant');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (participant: Participant) => {
//     setSelectedParticipant(participant);
//     setFormData({
//       ...formData,
//       name: participant.name,
//       aadhar: participant.aadhar,
//       age: (participant.age || '').toString(),
//       gender: participant.gender || 'Male',
//       phone: participant.phone,
//       address: participant.address,
//       state: participant.state,
//       district: participant.district,
//       assemblyconstituency: participant.assemblyconstituency,
//       mandal: participant.mandal,
//       village: participant.village,
//       pincode: participant.pincode,
//       house_no: participant.house_no || '',
//       registration_source: participant.registration_source,
//       blood_checkup: participant.blood_checkup,
//       medicine_required: participant.medicine_required,
//       medicine_name: participant.medicine_name,
//       treatment_required: participant.treatment_required
//     });
//     setActiveTab('');
//     setIsEditModalOpen(true);
//   };

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedParticipant) return;

//     try {
//       setLoading(true);
      
//       if (!formData.name || !formData.registration_source || !formData.aadhar || !formData.phone) {
//         showError('Please fill in all required fields including Aadhar and Phone number');
//         return;
//       }

//       if (formData.aadhar.length !== 12 || !/^\d+$/.test(formData.aadhar)) {
//         showError('Please enter a valid 12-digit Aadhar number');
//         return;
//       }

//       if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
//         showError('Please enter a valid 10-digit phone number');
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/participants/${selectedParticipant.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       });

//       const result = await response.json();
//       console.log('Update API Response:', result);

//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to update participant');
//       }

//       await fetchParticipants();
//       setIsEditModalOpen(false);
//       setSelectedParticipant(null);
//       setActiveTab('');
//       showSuccess('Participant updated successfully!');
//     } catch (err) {
//       console.error('Error updating participant:', err);
//       showError('Failed to update participant');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleView = (participant: Participant) => {
//     setSelectedParticipant(participant);
//     setIsViewModalOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this participant?')) return;
    
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
//         method: 'DELETE'
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete participant');
//       }

//       await fetchParticipants();
//       showSuccess('Participant deleted successfully!');
//     } catch (err) {
//       console.error('Error deleting participant:', err);
//       showError('Failed to delete participant');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       name: '',
//       aadhar: '',
//       age: '',
//       gender: 'Male',
//       phone: '',
//       address: '',
//       state: '',
//       district: '',
//       assemblyconstituency: '',
//       mandal: '',
//       village: '',
//       pincode: '',
//       house_no: '',
//       registration_source: '',
//       blood_checkup: false,
//       medicine_required: '',
//       medicine_name: '',
//       treatment_required: '',
//       camp_category: '',
//       eye_services: [],
//       dental_services: [],
//       cancer_services: [],
//       general_services: [],
//       eye_visual_acuity_left: '',
//       eye_visual_acuity_right: '',
//       eye_diagnosis: '',
//       eye_identified_issues: '',
//       eye_spectacles_recommended: false,
//       eye_surgery_recommended: false,
//       eye_follow_up_date: '',
//       eye_additional_notes: '',
//       eye_had_existing_spectacles: false,
//       eye_vision_correction_required: false,
//       eye_specify_vision_correction: false,
//       eye_spectacles_provided: false,
//       eye_spectacles_provided_date: '',
//       eye_surgery_type: '',
//       eye_surgery_prerequisites: '',
//       eye_surgery_scheduled_date: '',
//       eye_surgery_performed: false,
//       eye_spectacles_advised_post_surgery: false,
//       eye_post_surgery_follow_up: '',
//       dental_oral_hygiene_status: '',
//       dental_caries_present: false,
//       dental_gum_disease_present: false,
//       dental_tooth_extraction_recommended: false,
//       dental_filling_recommended: false,
//       dental_tooth_extraction_performed: false,
//       dental_filling_performed: false,
//       dental_root_canal_recommended: false,
//       dental_dentures_recommended: false,
//       dental_root_canal_performed: false,
//       dental_dentures_provided: false,
//       dental_follow_up_date: '',
//       dental_additional_notes: '',
//       dental_auditor: '',
//       camp_id: '',
//       general_height: '',
//       general_weight: '',
//       general_bmi: '',
//       general_bsa: '',
//       general_blood_pressure_systolic: '',
//       general_blood_pressure_diastolic: '',
//       general_presenting_complaints: '',
//       general_examination_remarks: '',
//       general_recommendations: '',
//       blood_haemoglobin: '',
//       blood_random_sugar: '',
//       blood_other_information: '',
//       blood_auditor: '',
//       cancer_oral: false,
//       cancer_breast: false,
//       cancer_cervical: false,
//       cancer_prostate: false,
//       cancer_other: false,
//       cancer_other_details: '',
//       cancer_findings: '',
//       cancer_recommendations: '',
//       cancer_follow_up_date: '',
//       general_medicine_required: false,
//       general_medicine_name: '',
//       blood_medicine_required: false,
//       blood_medicine_name: '',
//       eye_medicine_required: false,
//       eye_medicine_name: '',
//       dental_medicine_required: false,
//       dental_medicine_name: '',
//       cancer_medicine_required: false,
//       cancer_medicine_name: ''
//     });
//     setActiveTab('');
//     setAadharSuggestions([]);
//     setShowSuggestions(false);
//     setIsModalOpen(false);
//     setIsEditModalOpen(false);
//     setIsViewModalOpen(false);
//     setSelectedParticipant(null);
//   };

//   // Excel import handlers
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImportFile(file);
//       const reader = new FileReader();
//       reader.onload = (evt) => {
//         const data = evt.target?.result;
//         const workbook = XLSX.read(data, { type: 'binary' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//         console.log('Parsed Excel Data:', json);

//         // First row = headers
//         const headers = json[0] as string[];
//         const rows = json.slice(1) as any[][];

//         const parsed = rows.map((row) => {
//           const obj: any = {};
//           headers.forEach((header, idx) => {
//             // Normalise header: lowercase, replace spaces with underscore
//             const key = header?.toString().toLowerCase().replace(/\s+/g, '_') || `col_${idx}`;
//             obj[key] = row[idx];
//           });
//           return obj;
//         });

//         setImportData(parsed);
//         console.log('Structured Import Data:', importData);
//       };
//       reader.readAsBinaryString(file);
//     }
//   };

//   const handleImportConfirm = async () => {
//     console.log("uploading data");
//     console.log('Import data sample with age/gender:', { age: importData[0]?.age, gender: importData[0]?.gender, ...importData[0] });
//     if (importData.length === 0) {
//       showError('No data to import');
//       return;
//     }

//     setImportLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/participants`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(importData),
//       });

//       const result = await response.json();
//       const errorMessage = typeof result === 'object' && result !== null && 'error' in result 
//         ? (result as Record<string, any>).error 
//         : 'Import failed';
//       if (!response.ok) throw new Error(errorMessage || 'Import failed');

//       await fetchParticipants(); // refresh table
//       showSuccess(`${importData.length} participants imported successfully!`);
//       setIsImportModalOpen(false);
//       setImportFile(null);
//       setImportData([]);
//     } catch (err) {
//       console.error('Import error:', err);
//       showError('Import failed: ' + (err as Error).message);
//     } finally {
//       setImportLoading(false);
//     }
//   };

//   const closeImportModal = () => {
//     setIsImportModalOpen(false);
//     setImportFile(null);
//     setImportData([]);
//   };

//   const MessageDisplay = () => (
//     <>
//       {successMessage && (
//         <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
//           <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
//           {successMessage}
//         </div>
//       )}
//       {errorMessage && (
//         <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
//           <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
//           {errorMessage}
//         </div>
//       )}
//     </>
//   );

//   return (
//     <div>
//       <MessageDisplay />
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Participant Management</h1>
//       </div>
      
//       <div className="flex justify-between mb-4">
//         <div className="flex items-center gap-3 flex-1 mr-4">
//           <input
//             type="text"
//             placeholder="Search by Name"
//             value={searchName}
//             onChange={(e) => setSearchName(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//           />
//           <input
//             type="text"
//             placeholder="Search by Aadhar"
//             value={searchAadhar}
//             onChange={(e) => setSearchAadhar(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//           />
//           <input
//             type="text"
//             placeholder="Search by Phone"
//             value={searchPhone}
//             onChange={(e) => setSearchPhone(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
//           />
//           <button 
//             onClick={handleSearch}
//             className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
//           >
//             <Search size={18} /> Search
//           </button>
//           {(searchName || searchAadhar || searchPhone) && (
//             <button 
//               onClick={handleResetSearch}
//               className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
//             >
//               Reset
//             </button>
//           )}
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={() => setIsImportModalOpen(true)}
//             disabled={loading}
//             className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 shadow-sm disabled:opacity-50"
//           >
//             <Upload size={18} /> Import Excel
//           </button>

//           <button
//             onClick={() => setIsModalOpen(true)}
//             disabled={loading}
//             className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 shadow-sm disabled:opacity-50"
//           >
//             <Plus size={18} /> Add Participant
//           </button>
//         </div>
//       </div>

//       {/* Add Participant Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
//             <div className="flex justify-between items-center p-6 border-b bg-[#00b4d8] text-white rounded-t-lg">
//               <h2 className="text-xl font-semibold">Add New Participant</h2>
//               <button onClick={handleClose} className="text-white hover:text-gray-200">
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-6">
//               {/* ... (unchanged) ... */}
//               {/* We keep the entire form as originally provided */}
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Participant Modal */}
//       {isEditModalOpen && selectedParticipant && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
//             <div className="flex justify-between items-center p-6 border-b bg-[#00b4d8] text-white rounded-t-lg">
//               <h2 className="text-xl font-semibold">Edit Participant</h2>
//               <button onClick={handleClose} className="text-white hover:text-gray-200">
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleUpdate} className="p-6 grid grid-cols-2 gap-6">
//               {/* ... (unchanged) ... */}
//             </form>
//           </div>
//         </div>
//       )}

//       {/* View Participant Modal */}
//       {isViewModalOpen && selectedParticipant && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center p-6 border-b">
//               <h2 className="text-xl font-semibold">Participant Details</h2>
//               <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="p-6 grid grid-cols-2 gap-6">
//               {/* ... (unchanged) ... */}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Import Excel Modal */}
//       {isImportModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
//             <div className="flex justify-between items-center p-6 border-b bg-green-600 text-white rounded-t-lg">
//               <h2 className="text-xl font-semibold">Import Participants from Excel</h2>
//               <button onClick={closeImportModal} className="text-white hover:text-gray-200">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6">
//               {importData.length === 0 ? (
//                 <div className="text-center py-8">
//                   <input
//                     type="file"
//                     accept=".xlsx, .xls, .csv"
//                     onChange={handleFileChange}
//                     className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
//                   />
//                   <p className="text-gray-500">Select an Excel file (.xlsx, .xls) or CSV to begin.</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="mb-4 flex justify-between items-center">
//                     <p className="text-sm text-gray-600">
//                       {importData.length} records found. Click "Confirm Import" to save them.
//                     </p>
//                     <button
//                       onClick={() => {
//                         setImportFile(null);
//                         setImportData([]);
//                       }}
//                       className="text-sm text-red-600 hover:text-red-800"
//                     >
//                       Clear & choose another file
//                     </button>
//                   </div>

//                   {/* Preview Table */}
//                   <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-96">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50 sticky top-0">
//                         <tr>
//                           {importData.length > 0 &&
//                             Object.keys(importData[0]).map((key) => (
//                               <th
//                                 key={key}
//                                 className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                               >
//                                 {key}
//                               </th>
//                             ))}
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {importData.slice(0, 10).map((row, idx) => (
//                           <tr key={idx}>
//                             {Object.values(row).map((val: any, colIdx) => (
//                               <td key={colIdx} className="px-4 py-2 text-sm text-gray-900 truncate max-w-xs">
//                                 {val?.toString() || ''}
//                               </td>
//                             ))}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                     {importData.length > 10 && (
//                       <div className="p-2 text-center text-sm text-gray-500 border-t">
//                         ... and {importData.length - 10} more rows
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex justify-end gap-3 pt-4 border-t mt-4">
//                     <button
//                       onClick={closeImportModal}
//                       disabled={importLoading}
//                       className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleImportConfirm}
//                       disabled={importLoading}
//                       className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
//                     >
//                       {importLoading ? 'Importing...' : 'Confirm Import'}
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Participants Table */}
//       <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm">
//         {loading ? (
//           <div className="text-center py-8">Loading participants...</div>
//         ) : (
//           <table className="w-full text-left">
//             <thead className="bg-gray-100 text-gray-700 text-left">
//               <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
//                 <th className="px-4 py-3">ID</th>
//                 <th className="px-4 py-3">Name</th>
//                 <th className="px-4 py-3">Age</th>
//                 <th className="px-4 py-3">Gender</th>
//                 <th className="px-4 py-3">Phone</th>
//                 <th className="px-4 py-3">Aadhar</th>
//                 <th className="px-4 py-3">Created At</th>
//                 <th className="px-4 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredParticipants.map((p) => (
//                 <tr key={p.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-3">{p.id}</td>
//                   <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
//                   <td className="px-4 py-3">{p.age}</td>
//                   <td className="px-4 py-3">{p.gender}</td>
//                   <td className="px-4 py-3">{p.phone}</td>
//                   <td className="px-4 py-3">{p.aadhar}</td>
//                   <td className="px-4 py-3">{new Date(p.created_at).toLocaleDateString()}</td>
//                   <td className="px-4 py-3 flex items-center gap-3">
//                     <button 
//                       onClick={() => handleView(p)}
//                       className="bg-blue-300 hover:bg-blue-500 text-black p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
//                     >
//                       <Eye size={18} />
//                     </button>
//                     <button 
//                       onClick={() => handleEdit(p)}
//                       className="bg-orange-300 hover:bg-orange-500 text-black p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
//                     >
//                       <Pencil size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//         {filteredParticipants.length === 0 && !loading && (
//           <div className="text-center py-8 text-gray-500">No participants found</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ParticipantManagement;


'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Trash2, Plus, X, Eye, Search, User, Pill, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

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
  // Eye examination fields
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
  // Dental examination fields
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
  // General Health fields
  general_height?: string;
  general_weight?: string;
  general_bmi?: string;
  general_bsa?: string;
  general_blood_pressure_systolic?: string;
  general_blood_pressure_diastolic?: string;
  general_presenting_complaints?: string;
  general_examination_remarks?: string;
  general_recommendations?: string;
  // Blood Test fields
  blood_haemoglobin?: string;
  blood_random_sugar?: string;
  blood_other_information?: string;
  blood_auditor?: string;
  // Cancer Screening fields
  cancer_oral?: boolean;
  cancer_breast?: boolean;
  cancer_cervical?: boolean;
  cancer_prostate?: boolean;
  cancer_other?: boolean;
  cancer_other_details?: string;
  cancer_findings?: string;
  cancer_recommendations?: string;
  cancer_follow_up_date?: string;
  // Medicine fields
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

  // Excel import states
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<any[]>([]);
  const [importLoading, setImportLoading] = useState(false);

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

  const API_BASE_URL = 'http://localhost:5000';

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
      
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      const bsa = Math.sqrt((parseFloat(formData.general_height) * weight) / 3600).toFixed(2);
      
      setFormData(prev => ({
        ...prev,
        general_bmi: bmi,
        general_bsa: bsa
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
      const data = await res.json() as Participant[];
      const enrichedData = data.map(p => ({
        ...p,
        age: p.age || '',
        gender: p.gender || ''
      }));
      setParticipants(enrichedData);
      setFilteredParticipants(enrichedData);
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
      setFormData(prev => ({ ...prev, address: generatedAddress }));
    }
  }, [formData.house_no, formData.village, formData.mandal, formData.district, formData.assemblyconstituency, formData.state, formData.pincode]);

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

  const MedicineRequiredSection = ({ tabName, isViewMode = false }: { tabName: string; isViewMode?: boolean }) => {
    const medicineRequiredField = `${tabName.toLowerCase().replace(' ', '_')}_medicine_required` as keyof typeof formData;
    const medicineNameField = `${tabName.toLowerCase().replace(' ', '_')}_medicine_name` as keyof typeof formData;

    if (isViewMode) {
      const isRequired = formData[medicineRequiredField] as boolean;
      const medicineName = formData[medicineNameField] as string;
      
      if (!isRequired && !medicineName) return null;
      
      return (
        <div className="mb-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Medicine Information
          </h4>
          <div className="space-y-2">
            <p><strong>Medicine Required:</strong> {isRequired ? 'Yes' : 'No'}</p>
            {medicineName && <p><strong>Medicine Name:</strong> {medicineName}</p>}
          </div>
        </div>
      );
    }

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

  const EyeExaminationForm = ({ isViewMode = false }: { isViewMode?: boolean }) => {
    if (isViewMode) {
      const hasData = formData.eye_visual_acuity_left || formData.eye_visual_acuity_right || 
                      formData.eye_diagnosis || formData.eye_identified_issues ||
                      formData.eye_spectacles_recommended || formData.eye_surgery_recommended;
      
      if (!hasData) return null;
      
      return (
        <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Eye Examination Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.eye_visual_acuity_left && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Visual Acuity (Left)</p>
                <p className="font-medium">{formData.eye_visual_acuity_left}</p>
              </div>
            )}
            {formData.eye_visual_acuity_right && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Visual Acuity (Right)</p>
                <p className="font-medium">{formData.eye_visual_acuity_right}</p>
              </div>
            )}
            {formData.eye_diagnosis && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Diagnosis</p>
                <p className="font-medium">{formData.eye_diagnosis}</p>
              </div>
            )}
            {formData.eye_identified_issues && (
              <div className="bg-gray-50 p-3 rounded md:col-span-2">
                <p className="text-sm text-gray-500">Identified Vision Issues</p>
                <p className="font-medium">{formData.eye_identified_issues}</p>
              </div>
            )}
            {formData.eye_spectacles_recommended && (
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-green-600">✓ Spectacles Recommended</p>
                {formData.eye_had_existing_spectacles && <p>Had Existing Spectacles</p>}
                {formData.eye_vision_correction_required && <p>Vision Correction Required</p>}
                {formData.eye_spectacles_provided && (
                  <p>Spectacles Provided on: {formData.eye_spectacles_provided_date}</p>
                )}
              </div>
            )}
            {formData.eye_surgery_recommended && (
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-yellow-600">⚠ Surgery Recommended</p>
                <p>Surgery Type: {formData.eye_surgery_type}</p>
                <p>Scheduled Date: {formData.eye_surgery_scheduled_date}</p>
                {formData.eye_surgery_performed && <p>Surgery Performed</p>}
                {formData.eye_spectacles_advised_post_surgery && <p>Spectacles Advised Post Surgery</p>}
              </div>
            )}
            {formData.eye_follow_up_date && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Follow-up Date</p>
                <p className="font-medium">{formData.eye_follow_up_date}</p>
              </div>
            )}
            {formData.eye_additional_notes && (
              <div className="bg-gray-50 p-3 rounded md:col-span-2">
                <p className="text-sm text-gray-500">Additional Notes</p>
                <p className="font-medium">{formData.eye_additional_notes}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg border border-blue-200">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Eye Examination Form</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-700"><strong>Camp:</strong> {formData.registration_source || 'Not selected'} | <strong>Participant:</strong> {formData.name || 'Not provided'}</p>
          </div>
        </div>

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

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-4">
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
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-200 mb-4">
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
  };

  const DentalExaminationForm = ({ isViewMode = false }: { isViewMode?: boolean }) => {
    if (isViewMode) {
      const hasData = formData.dental_oral_hygiene_status || formData.dental_caries_present ||
                      formData.dental_gum_disease_present || formData.dental_tooth_extraction_recommended ||
                      formData.dental_filling_recommended;
      
      if (!hasData) return null;
      
      return (
        <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Dental Examination Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.dental_oral_hygiene_status && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Oral Hygiene Status</p>
                <p className="font-medium">{formData.dental_oral_hygiene_status}</p>
              </div>
            )}
            {formData.dental_caries_present && (
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-yellow-600">⚠ Dental Caries Present</p>
              </div>
            )}
            {formData.dental_gum_disease_present && (
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-yellow-600">⚠ Gum Disease Present</p>
              </div>
            )}
            {formData.dental_tooth_extraction_recommended && (
              <div className="bg-blue-50 p-3 rounded">
                <p>✓ Tooth Extraction Recommended</p>
                {formData.dental_tooth_extraction_performed && <p>Extraction Performed</p>}
              </div>
            )}
            {formData.dental_filling_recommended && (
              <div className="bg-blue-50 p-3 rounded">
                <p>✓ Filling Recommended</p>
                {formData.dental_filling_performed && <p>Filling Performed</p>}
              </div>
            )}
            {formData.dental_root_canal_recommended && (
              <div className="bg-blue-50 p-3 rounded">
                <p>✓ Root Canal Recommended</p>
                {formData.dental_root_canal_performed && <p>Root Canal Performed</p>}
              </div>
            )}
            {formData.dental_dentures_recommended && (
              <div className="bg-blue-50 p-3 rounded">
                <p>✓ Dentures Recommended</p>
                {formData.dental_dentures_provided && <p>Dentures Provided</p>}
              </div>
            )}
            {formData.dental_follow_up_date && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Follow-up Date</p>
                <p className="font-medium">{formData.dental_follow_up_date}</p>
              </div>
            )}
            {formData.dental_additional_notes && (
              <div className="bg-gray-50 p-3 rounded md:col-span-2">
                <p className="text-sm text-gray-500">Additional Notes</p>
                <p className="font-medium">{formData.dental_additional_notes}</p>
              </div>
            )}
            {formData.dental_auditor && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Dental Auditor</p>
                <p className="font-medium">{formData.dental_auditor}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
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

        <MedicineRequiredSection tabName="Dental" />

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">Basic Dental Examination</h4>
          
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
  };

  const GeneralHealthExaminationForm = ({ isViewMode = false }: { isViewMode?: boolean }) => {
    if (isViewMode) {
      const hasData = formData.general_height || formData.general_weight || 
                      formData.general_blood_pressure_systolic || formData.general_presenting_complaints;
      
      if (!hasData) return null;
      
      return (
        <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">General Health Examination Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.general_height && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Height</p>
                <p className="font-medium">{formData.general_height} cm</p>
              </div>
            )}
            {formData.general_weight && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Weight</p>
                <p className="font-medium">{formData.general_weight} kg</p>
              </div>
            )}
            {formData.general_bmi && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">BMI</p>
                <p className="font-medium">{formData.general_bmi}</p>
              </div>
            )}
            {formData.general_bsa && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">BSA</p>
                <p className="font-medium">{formData.general_bsa} m²</p>
              </div>
            )}
            {formData.general_blood_pressure_systolic && formData.general_blood_pressure_diastolic && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Blood Pressure</p>
                <p className="font-medium">{formData.general_blood_pressure_systolic}/{formData.general_blood_pressure_diastolic} mm/Hg</p>
              </div>
            )}
            {formData.general_presenting_complaints && (
              <div className="bg-gray-50 p-3 rounded md:col-span-2">
                <p className="text-sm text-gray-500">Presenting Complaints</p>
                <p className="font-medium">{formData.general_presenting_complaints}</p>
              </div>
            )}
            {formData.general_examination_remarks && (
              <div className="bg-gray-50 p-3 rounded md:col-span-2">
                <p className="text-sm text-gray-500">Examination Remarks</p>
                <p className="font-medium">{formData.general_examination_remarks}</p>
              </div>
            )}
            {formData.general_recommendations && (
              <div className="bg-gray-50 p-3 rounded md:col-span-2">
                <p className="text-sm text-gray-500">Recommendations</p>
                <p className="font-medium">{formData.general_recommendations}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
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
  };

  const BloodTestExaminationForm = ({ isViewMode = false }: { isViewMode?: boolean }) => {
    if (isViewMode) {
      const hasData = formData.blood_haemoglobin || formData.blood_random_sugar || formData.blood_other_information;
      
      if (!hasData) return null;
      
      return (
        <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Blood Test Examination Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.blood_haemoglobin && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Haemoglobin</p>
                <p className="font-medium">{formData.blood_haemoglobin} g/dL</p>
              </div>
            )}
            {formData.blood_random_sugar && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Random Blood Sugar</p>
                <p className="font-medium">{formData.blood_random_sugar} mg/dL</p>
              </div>
            )}
            {formData.blood_other_information && (
              <div className="bg-gray-50 p-3 rounded md:col-span-2">
                <p className="text-sm text-gray-500">Other Information</p>
                <p className="font-medium">{formData.blood_other_information}</p>
              </div>
            )}
            {formData.blood_auditor && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Blood Test Auditor</p>
                <p className="font-medium">{formData.blood_auditor}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
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
                  step="0.1"
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
  };

  const CancerScreeningForm = ({ isViewMode = false }: { isViewMode?: boolean }) => {
    if (isViewMode) {
      const hasData = formData.cancer_oral || formData.cancer_breast || formData.cancer_cervical ||
                      formData.cancer_prostate || formData.cancer_other || formData.cancer_findings;
      
      if (!hasData) return null;
      
      return (
        <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Cancer Screening Details</h3>
          <div className="grid grid-cols-1 gap-4">
            {(formData.cancer_oral || formData.cancer_breast || formData.cancer_cervical || 
              formData.cancer_prostate || formData.cancer_other) && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Screening Types</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.cancer_oral && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Oral Cancer</span>}
                  {formData.cancer_breast && <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded">Breast Cancer</span>}
                  {formData.cancer_cervical && <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Cervical Cancer</span>}
                  {formData.cancer_prostate && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Prostate Cancer</span>}
                  {formData.cancer_other && <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">Other: {formData.cancer_other_details}</span>}
                </div>
              </div>
            )}
            {formData.cancer_findings && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Findings</p>
                <p className="font-medium">{formData.cancer_findings}</p>
              </div>
            )}
            {formData.cancer_recommendations && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Recommendations</p>
                <p className="font-medium">{formData.cancer_recommendations}</p>
              </div>
            )}
            {formData.cancer_follow_up_date && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Follow-up Date</p>
                <p className="font-medium">{formData.cancer_follow_up_date}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      console.log('Form data being sent:', formData);
      
      if (!formData.name || !formData.registration_source || !formData.aadhar || !formData.phone) {
        showError('Please fill in all required fields including Aadhar and Phone number');
        return;
      }

      if (formData.aadhar.length !== 12 || !/^\d+$/.test(formData.aadhar)) {
        showError('Please enter a valid 12-digit Aadhar number');
        return;
      }

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

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create participant');
      }

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

  const handleEdit = (participant: Participant) => {
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
      // Eye fields
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
      // Dental fields
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
      // General Health fields
      general_height: participant.general_height || '',
      general_weight: participant.general_weight || '',
      general_bmi: participant.general_bmi || '',
      general_bsa: participant.general_bsa || '',
      general_blood_pressure_systolic: participant.general_blood_pressure_systolic || '',
      general_blood_pressure_diastolic: participant.general_blood_pressure_diastolic || '',
      general_presenting_complaints: participant.general_presenting_complaints || '',
      general_examination_remarks: participant.general_examination_remarks || '',
      general_recommendations: participant.general_recommendations || '',
      // Blood Test fields
      blood_haemoglobin: participant.blood_haemoglobin || '',
      blood_random_sugar: participant.blood_random_sugar || '',
      blood_other_information: participant.blood_other_information || '',
      blood_auditor: participant.blood_auditor || '',
      // Cancer Screening fields
      cancer_oral: participant.cancer_oral || false,
      cancer_breast: participant.cancer_breast || false,
      cancer_cervical: participant.cancer_cervical || false,
      cancer_prostate: participant.cancer_prostate || false,
      cancer_other: participant.cancer_other || false,
      cancer_other_details: participant.cancer_other_details || '',
      cancer_findings: participant.cancer_findings || '',
      cancer_recommendations: participant.cancer_recommendations || '',
      cancer_follow_up_date: participant.cancer_follow_up_date || '',
      // Medicine fields
      general_medicine_required: participant.general_medicine_required || false,
      general_medicine_name: participant.general_medicine_name || '',
      blood_medicine_required: participant.blood_medicine_required || false,
      blood_medicine_name: participant.blood_medicine_name || '',
      eye_medicine_required: participant.eye_medicine_required || false,
      eye_medicine_name: participant.eye_medicine_name || '',
      dental_medicine_required: participant.dental_medicine_required || false,
      dental_medicine_name: participant.dental_medicine_name || '',
      cancer_medicine_required: participant.cancer_medicine_required || false,
      cancer_medicine_name: participant.cancer_medicine_name || ''
    });
    setActiveTab('');
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant) return;

    try {
      setLoading(true);
      
      if (!formData.name || !formData.registration_source || !formData.aadhar || !formData.phone) {
        showError('Please fill in all required fields including Aadhar and Phone number');
        return;
      }

      if (formData.aadhar.length !== 12 || !/^\d+$/.test(formData.aadhar)) {
        showError('Please enter a valid 12-digit Aadhar number');
        return;
      }

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

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update participant');
      }

      await fetchParticipants();
      handleClose();
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
      // Eye fields
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
      // Dental fields
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
      // General Health fields
      general_height: participant.general_height || '',
      general_weight: participant.general_weight || '',
      general_bmi: participant.general_bmi || '',
      general_bsa: participant.general_bsa || '',
      general_blood_pressure_systolic: participant.general_blood_pressure_systolic || '',
      general_blood_pressure_diastolic: participant.general_blood_pressure_diastolic || '',
      general_presenting_complaints: participant.general_presenting_complaints || '',
      general_examination_remarks: participant.general_examination_remarks || '',
      general_recommendations: participant.general_recommendations || '',
      // Blood Test fields
      blood_haemoglobin: participant.blood_haemoglobin || '',
      blood_random_sugar: participant.blood_random_sugar || '',
      blood_other_information: participant.blood_other_information || '',
      blood_auditor: participant.blood_auditor || '',
      // Cancer Screening fields
      cancer_oral: participant.cancer_oral || false,
      cancer_breast: participant.cancer_breast || false,
      cancer_cervical: participant.cancer_cervical || false,
      cancer_prostate: participant.cancer_prostate || false,
      cancer_other: participant.cancer_other || false,
      cancer_other_details: participant.cancer_other_details || '',
      cancer_findings: participant.cancer_findings || '',
      cancer_recommendations: participant.cancer_recommendations || '',
      cancer_follow_up_date: participant.cancer_follow_up_date || '',
      // Medicine fields
      general_medicine_required: participant.general_medicine_required || false,
      general_medicine_name: participant.general_medicine_name || '',
      blood_medicine_required: participant.blood_medicine_required || false,
      blood_medicine_name: participant.blood_medicine_name || '',
      eye_medicine_required: participant.eye_medicine_required || false,
      eye_medicine_name: participant.eye_medicine_name || '',
      dental_medicine_required: participant.dental_medicine_required || false,
      dental_medicine_name: participant.dental_medicine_name || '',
      cancer_medicine_required: participant.cancer_medicine_required || false,
      cancer_medicine_name: participant.cancer_medicine_name || ''
    });
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

  // Excel import handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const headers = json[0] as string[];
        const rows = json.slice(1) as any[][];

        const parsed = rows.map((row) => {
          const obj: any = {};
          headers.forEach((header, idx) => {
            const key = header?.toString().toLowerCase().replace(/\s+/g, '_') || `col_${idx}`;
            obj[key] = row[idx];
          });
          return obj;
        });

        setImportData(parsed);
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
    try {
      const response = await fetch(`${API_BASE_URL}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(importData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Import failed');

      await fetchParticipants();
      showSuccess(`${importData.length} participants imported successfully!`);
      setIsImportModalOpen(false);
      setImportFile(null);
      setImportData([]);
    } catch (err) {
      console.error('Import error:', err);
      showError('Import failed: ' + (err as Error).message);
    } finally {
      setImportLoading(false);
    }
  };

  const closeImportModal = () => {
    setIsImportModalOpen(false);
    setImportFile(null);
    setImportData([]);
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

  // Basic Info Form Component
  const BasicInfoForm = ({ isViewMode = false }: { isViewMode?: boolean }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Basic Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          {isViewMode ? (
            <p className="text-gray-900">{formData.name}</p>
          ) : (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          )}
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number *</label>
          {isViewMode ? (
            <p className="text-gray-900">{formData.aadhar}</p>
          ) : (
            <>
              <input
                type="text"
                name="aadhar"
                value={formData.aadhar}
                onChange={handleAadharChange}
                maxLength={12}
                ref={aadharInputRef}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {showSuggestions && aadharSuggestions.length > 0 && (
                <div ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
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
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          {isViewMode ? (
            <p className="text-gray-900">{formData.age || 'Not specified'}</p>
          ) : (
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          {isViewMode ? (
            <p className="text-gray-900">{formData.gender || 'Not specified'}</p>
          ) : (
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          {isViewMode ? (
            <p className="text-gray-900">{formData.phone}</p>
          ) : (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              maxLength={10}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Camp Source *</label>
          {isViewMode ? (
            <p className="text-gray-900">{formData.registration_source}</p>
          ) : (
            <select
              name="registration_source"
              value={formData.registration_source}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Camp</option>
              {camps.map((camp) => (
                <option key={camp.id} value={camp.camp_name}>
                  {camp.camp_name} - {camp.date} - {camp.location}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Address Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">House No</label>
            {isViewMode ? (
              <p className="text-gray-900">{formData.house_no || 'Not specified'}</p>
            ) : (
              <input
                type="text"
                name="house_no"
                value={formData.house_no}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
            {isViewMode ? (
              <p className="text-gray-900">{formData.village || 'Not specified'}</p>
            ) : (
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mandal</label>
            {isViewMode ? (
              <p className="text-gray-900">{formData.mandal || 'Not specified'}</p>
            ) : (
              <input
                type="text"
                name="mandal"
                value={formData.mandal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
            {isViewMode ? (
              <p className="text-gray-900">{formData.district || 'Not specified'}</p>
            ) : (
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Constituency</label>
            {isViewMode ? (
              <p className="text-gray-900">{formData.assemblyconstituency || 'Not specified'}</p>
            ) : (
              <input
                type="text"
                name="assemblyconstituency"
                value={formData.assemblyconstituency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            {isViewMode ? (
              <p className="text-gray-900">{formData.state || 'Not specified'}</p>
            ) : (
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            {isViewMode ? (
              <p className="text-gray-900">{formData.pincode || 'Not specified'}</p>
            ) : (
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            )}
          </div>
        </div>
        {!isViewMode && formData.address && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Generated Address: {formData.address}</p>
          </div>
        )}
        {isViewMode && formData.address && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">Full Address</p>
            <p className="text-gray-900">{formData.address}</p>
          </div>
        )}
      </div>
    </div>
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

        <div className="flex gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            disabled={loading}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 shadow-sm disabled:opacity-50"
          >
            <Upload size={18} /> Import Excel
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
            className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 shadow-sm disabled:opacity-50"
          >
            <Plus size={18} /> Add Participant
          </button>
        </div>
      </div>

      {/* Add Participant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-[#00b4d8] text-white rounded-t-lg z-10">
              <h2 className="text-xl font-semibold">Add New Participant</h2>
              <button onClick={handleClose} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <BasicInfoForm />
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Examination Type</label>
                <div className="flex flex-wrap gap-3">
                  {['Eye', 'Dental', 'General Health', 'Blood Test', 'Cancer Screening'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => handleTabClick(tab)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-[#00b4d8] text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'Eye' && <EyeExaminationForm />}
              {activeTab === 'Dental' && <DentalExaminationForm />}
              {activeTab === 'General Health' && <GeneralHealthExaminationForm />}
              {activeTab === 'Blood Test' && <BloodTestExaminationForm />}
              {activeTab === 'Cancer Screening' && <CancerScreeningForm />}

              <div className="sticky bottom-0 bg-white pt-4 border-t mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0096c7] disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Participant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Participant Modal */}
      {isEditModalOpen && selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-[#00b4d8] text-white rounded-t-lg z-10">
              <h2 className="text-xl font-semibold">Edit Participant</h2>
              <button onClick={handleClose} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6">
              <BasicInfoForm />
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Examination Type</label>
                <div className="flex flex-wrap gap-3">
                  {['Eye', 'Dental', 'General Health', 'Blood Test', 'Cancer Screening'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => handleTabClick(tab)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-[#00b4d8] text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'Eye' && <EyeExaminationForm />}
              {activeTab === 'Dental' && <DentalExaminationForm />}
              {activeTab === 'General Health' && <GeneralHealthExaminationForm />}
              {activeTab === 'Blood Test' && <BloodTestExaminationForm />}
              {activeTab === 'Cancer Screening' && <CancerScreeningForm />}

              <div className="sticky bottom-0 bg-white pt-4 border-t mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0096c7] disabled:opacity-50"
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
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-gray-800 text-white rounded-t-lg z-10">
              <h2 className="text-xl font-semibold">Participant Details</h2>
              <button onClick={handleClose} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <BasicInfoForm isViewMode={true} />
              
              {/* Display all examination data if available */}
              <EyeExaminationForm isViewMode={true} />
              <DentalExaminationForm isViewMode={true} />
              <GeneralHealthExaminationForm isViewMode={true} />
              <BloodTestExaminationForm isViewMode={true} />
              <CancerScreeningForm isViewMode={true} />
              
              <div className="sticky bottom-0 bg-white pt-4 border-t mt-6 flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Excel Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center p-6 border-b bg-green-600 text-white rounded-t-lg">
              <h2 className="text-xl font-semibold">Import Participants from Excel</h2>
              <button onClick={closeImportModal} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {importData.length === 0 ? (
                <div className="text-center py-8">
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                    className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="text-gray-500">Select an Excel file (.xlsx, .xls) or CSV to begin.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {importData.length} records found. Click "Confirm Import" to save them.
                    </p>
                    <button
                      onClick={() => {
                        setImportFile(null);
                        setImportData([]);
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear & choose another file
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-96">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          {importData.length > 0 &&
                            Object.keys(importData[0]).map((key) => (
                              <th
                                key={key}
                                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {importData.slice(0, 10).map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).map((val: any, colIdx) => (
                              <td key={colIdx} className="px-4 py-2 text-sm text-gray-900 truncate max-w-xs">
                                {val?.toString() || ''}
                              </td>
                            ))}
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

                  <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                    <button
                      onClick={closeImportModal}
                      disabled={importLoading}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImportConfirm}
                      disabled={importLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {importLoading ? 'Importing...' : 'Confirm Import'}
                    </button>
                  </div>
                </>
              )}
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
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-300 hover:bg-red-500 text-black p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      <Trash2 size={18} />
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
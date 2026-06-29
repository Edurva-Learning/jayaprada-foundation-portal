'use client';

import React, { useState } from 'react';

interface Participant {
  id: number;
  name: string;
  aadhar: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  registration_source: string;
  created_at: string;
  state: string;
  assemblyconstituency: string;
  district: string;
  mandal: string;
  village: string;
  pincode: string;
  hb: string;
  medicine_required: string | boolean;
  medician: string;
  medicine: string;
  medicine_name: string;
  treatment_required: string | boolean;
  operation: string | boolean;
  campcategory: string;
  bp: string;
  rbs: string;
  vision: string;
  spets: string;
  completed_operation_date: string;
  post_operation_date: string;
  vision_left: string;
  vision_right: string;
  height: string;
  weight: string;
  dental_examination: string;
  cancer_screening: string;
  camp_location: string;
  house_no: string;
  additional_data?: Record<string, any>;
  // Add any other fields that might come from the API
  [key: string]: any;
}

const PatientHistory = () => {
  const [aadhar, setAadhar] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const API_BASE_URL = 'http://localhost:5000';

  const handleSearch = async () => {
    if (!aadhar.trim()) {
      alert('Please enter Aadhar number');
      return;
    }

    // Validate Aadhar number (12 digits)
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(aadhar.trim())) {
      alert('Please enter a valid 12-digit Aadhar number');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      console.log('Fetching participants for Aadhar:', aadhar);
      
      const response = await fetch(`${API_BASE_URL}/participants`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allParticipants: Participant[] = await response.json();
      
      // Log the first participant to see what fields are available
      if (allParticipants.length > 0) {
        console.log('First participant data:', allParticipants[0]);
        console.log('All available keys:', Object.keys(allParticipants[0]));
      }
      
      // Filter by Aadhar number (handle null/undefined)
      const filtered = allParticipants.filter(p => p.aadhar && p.aadhar === aadhar.trim());
      
      // Remove duplicates based on Aadhar number (keep only the first occurrence)
      const uniqueParticipants: Participant[] = [];
      const seenAadhars = new Set<string>();
      
      for (const participant of filtered) {
        if (participant.aadhar && !seenAadhars.has(participant.aadhar)) {
          seenAadhars.add(participant.aadhar);
          uniqueParticipants.push(participant);
        }
      }
      
      setParticipants(uniqueParticipants);

      // Log filtered participants to check all data
      if (uniqueParticipants.length > 0) {
        console.log('Unique participants:', uniqueParticipants);
        uniqueParticipants.forEach((p, index) => {
          console.log(`Participant ${index + 1} - All fields:`, p);
          console.log(`Participant ${index + 1} - Operation:`, p.operation);
          console.log(`Participant ${index + 1} - Treatment Required:`, p.treatment_required);
          console.log(`Participant ${index + 1} - Additional Data:`, p.additional_data);
        });
      }

      if (uniqueParticipants.length === 0) {
        alert('No patient found with this Aadhar number');
      }
    } catch (err) {
      console.error('Error fetching patient data:', err);
      alert('Error fetching patient data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAadhar('');
    setParticipants([]);
    setSearched(false);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Helper to format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to render boolean as Yes/No - Enhanced for all fields
  const formatBool = (val: any): string => {
    if (val === undefined || val === null || val === '') return '-';
    if (val === true || val === 'true' || val === 'Yes' || val === 'yes' || val === 'YES') return 'Yes';
    if (val === false || val === 'false' || val === 'No' || val === 'no' || val === 'NO') return 'No';
    if (val === 'Y' || val === 'y') return 'Yes';
    if (val === 'N' || val === 'n') return 'No';
    if (val === 1) return 'Yes';
    if (val === 0) return 'No';
    if (typeof val === 'string' && val.trim() !== '') return val;
    return '-';
  };

  // Helper to get treatment_required value from various possible fields
  const getTreatmentRequiredValue = (participant: Participant): string => {
    // Check direct field
    if (participant.treatment_required !== undefined && participant.treatment_required !== null && participant.treatment_required !== '') {
      return formatBool(participant.treatment_required);
    }
    // Check in additional_data
    if (participant.additional_data && typeof participant.additional_data === 'object') {
      const additionalData = participant.additional_data;
      for (const key of Object.keys(additionalData)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('treatment') || lowerKey.includes('treatment_required')) {
          if (additionalData[key] !== undefined && additionalData[key] !== null && additionalData[key] !== '') {
            return formatBool(additionalData[key]);
          }
        }
      }
    }
    return '-';
  };

  // Helper to get operation value from various possible fields
  const getOperationValue = (participant: Participant): string => {
    // Check direct field
    if (participant.operation !== undefined && participant.operation !== null && participant.operation !== '') {
      return formatBool(participant.operation);
    }
    // Check in additional_data
    if (participant.additional_data && typeof participant.additional_data === 'object') {
      const additionalData = participant.additional_data;
      for (const key of Object.keys(additionalData)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('operation') || lowerKey.includes('surgery')) {
          if (additionalData[key] !== undefined && additionalData[key] !== null && additionalData[key] !== '') {
            return formatBool(additionalData[key]);
          }
        }
      }
    }
    return '-';
  };

  // Helper to get medicine value from various possible fields
  const getMedicineValue = (participant: Participant): string => {
    // Check all possible medicine fields
    if (participant.medicine && participant.medicine !== '') {
      return participant.medicine;
    }
    if (participant.medician && participant.medician !== '') {
      return participant.medician;
    }
    if (participant.medicine_name && participant.medicine_name !== '') {
      return participant.medicine_name;
    }
    if (participant.medicine_required !== undefined && participant.medicine_required !== null && participant.medicine_required !== '' && 
        participant.medicine_required !== 'No' && participant.medicine_required !== 'no' && 
        participant.medicine_required !== false) {
      return typeof participant.medicine_required === 'string' ? participant.medicine_required : 'Yes';
    }
    // Check additional_data if available
    if (participant.additional_data && typeof participant.additional_data === 'object') {
      const additionalData = participant.additional_data;
      for (const key of Object.keys(additionalData)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('medicine') || lowerKey.includes('med') || lowerKey.includes('drug') || lowerKey.includes('medication')) {
          if (additionalData[key] !== undefined && additionalData[key] !== null && additionalData[key] !== '') {
            return String(additionalData[key]);
          }
        }
      }
    }
    return '-';
  };

  // Helper to get value from additional_data
  const getAdditionalDataValue = (participant: Participant, key: string): any => {
    if (participant.additional_data && typeof participant.additional_data === 'object') {
      const additionalData = participant.additional_data;
      // Try exact match
      if (additionalData[key] !== undefined && additionalData[key] !== null && additionalData[key] !== '') {
        return additionalData[key];
      }
      // Try case-insensitive match
      for (const dataKey of Object.keys(additionalData)) {
        if (dataKey.toLowerCase() === key.toLowerCase()) {
          if (additionalData[dataKey] !== undefined && additionalData[dataKey] !== null && additionalData[dataKey] !== '') {
            return additionalData[dataKey];
          }
        }
      }
    }
    return null;
  };

  // Helper to get display value from participant or additional_data
  const getDisplayValue = (participant: Participant, field: string): string => {
    // First check if the field exists directly on the participant
    const directValue = (participant as any)[field];
    if (directValue !== undefined && directValue !== null && directValue !== '') {
      return String(directValue);
    }
    // Then check in additional_data
    const additionalValue = getAdditionalDataValue(participant, field);
    if (additionalValue !== null) {
      return String(additionalValue);
    }
    return '-';
  };

  // Get all unique additional data keys from all participants
  const getAllAdditionalDataKeys = (participants: Participant[]): string[] => {
    const keys = new Set<string>();
    participants.forEach(p => {
      if (p.additional_data && typeof p.additional_data === 'object') {
        Object.keys(p.additional_data).forEach(key => keys.add(key));
      }
    });
    return Array.from(keys);
  };

  // Safe access for participant fields
  const getSafeValue = (value: any): string => {
    if (value === undefined || value === null || value === '') return '-';
    return String(value);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Patient History</h1>
      <p className="text-gray-600 mb-6">Search patient camp attendance history by Aadhar number</p>

      {/* Search Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aadhar Number
            </label>
            <input
              type="text"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter 12-digit Aadhar number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
              maxLength={12}
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-[#00b4d8] text-white rounded-lg hover:bg-[#0099c3] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && !loading && participants.length > 0 && (
        <>
          {/* Patient Summary */}
          <div className="bg-[#00b4d8] text-white rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p><span className="font-medium">Name:</span> {getSafeValue(participants[0].name)}</p>
                <p><span className="font-medium">Aadhar:</span> {getSafeValue(participants[0].aadhar)}</p>
                <p><span className="font-medium">Age/Gender:</span> {getSafeValue(participants[0].age)} / {getSafeValue(participants[0].gender)}</p>
                <p><span className="font-medium">Phone:</span> {getSafeValue(participants[0].phone)}</p>
              </div>
              <div>
                <p><span className="font-medium">Address:</span> {getSafeValue(participants[0].address)}</p>
                <p><span className="font-medium">Village:</span> {getSafeValue(participants[0].village)}</p>
                <p><span className="font-medium">Mandal:</span> {getSafeValue(participants[0].mandal)}</p>
                <p><span className="font-medium">District:</span> {getSafeValue(participants[0].district)}</p>
              </div>
              <div>
                <p><span className="font-medium">State:</span> {getSafeValue(participants[0].state)}</p>
                <p><span className="font-medium">Pincode:</span> {getSafeValue(participants[0].pincode)}</p>
                <p><span className="font-medium">Total Camps:</span> {participants.length}</p>
              </div>
            </div>
          </div>

          {/* Detailed Records Table */}
          <div>
            <h3 className="text-xl font-semibold text-[#00b4d8] mb-4">
              Camp Attendance Details ({participants.length} records)
            </h3>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#00b4d8] text-white">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">S.No</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Camp Name</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Registration Date</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Name</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Age</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Gender</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Phone</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Aadhar</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">House No</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Village</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Mandal</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">District</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">State</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Pincode</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">HB</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">BP</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">RBS</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Height</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Weight</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Vision Left</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Vision Right</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Spectacles</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Medicine</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Treatment Required</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Operation</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Completed Op Date</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Post Op Date</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Dental Examination</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Cancer Screening</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Camp Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((p, index) => {
                    const medicineValue = getMedicineValue(p);
                    const treatmentRequiredValue = getTreatmentRequiredValue(p);
                    const operationValue = getOperationValue(p);
                    return (
                      <tr key={`${p.id}-${index}`} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{index + 1}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.registration_source)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{formatDate(p.created_at)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.name)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.age)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.gender)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.phone)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.aadhar)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.house_no)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.village)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.mandal)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.district)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.state)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.pincode)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.hb)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.bp)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.rbs)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getDisplayValue(p, 'height')}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getDisplayValue(p, 'weight')}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.vision_left) || getDisplayValue(p, 'vision_left')}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.vision_right) || getDisplayValue(p, 'vision_right')}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.spets)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                          {medicineValue !== '-' ? medicineValue : <span className="text-gray-400">-</span>}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                          {treatmentRequiredValue !== '-' ? (
                            <span className={treatmentRequiredValue === 'Yes' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {treatmentRequiredValue}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                          {operationValue !== '-' ? (
                            <span className={operationValue === 'Yes' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {operationValue}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{formatDate(p.completed_operation_date)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{formatDate(p.post_operation_date)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.dental_examination)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.cancer_screening)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{getSafeValue(p.camp_location)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Additional Data Section - Shows ALL extra columns from Excel */}
            {participants.some(p => p.additional_data && typeof p.additional_data === 'object' && Object.keys(p.additional_data).length > 0) && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Additional Data from Excel</h4>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">S.No</th>
                        {getAllAdditionalDataKeys(participants).map(key => (
                          <th key={key} className="py-2 px-4 text-left text-sm font-medium text-gray-700">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {participants.map((p, index) => {
                        if (!p.additional_data || typeof p.additional_data !== 'object' || Object.keys(p.additional_data).length === 0) return null;
                        return (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 text-sm text-gray-900">{index + 1}</td>
                            {getAllAdditionalDataKeys(participants).map(key => (
                              <td key={key} className="py-2 px-4 text-sm text-gray-900">
                                {p.additional_data?.[key] !== undefined && p.additional_data?.[key] !== null && p.additional_data?.[key] !== '' 
                                  ? String(p.additional_data[key]) 
                                  : '-'}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* No Results */}
      {searched && !loading && participants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No records found for this Aadhar number.
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b4d8]"></div>
          <p className="mt-2 text-gray-600">Searching for patient data...</p>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
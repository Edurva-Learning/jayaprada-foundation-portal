// 'use client';

// import React, { useState } from 'react';

// interface PatientInfo {
//   name: string;
//   aadhar: string;
//   camps: Array<{
//     campName: string;
//     fromDate: string;
//     endDate: string;
//     location: string;
//   }>;
// }

// const PatientHistory = () => {
//   const [aadhar, setAadhar] = useState('');
//   const [searchResults, setSearchResults] = useState<Array<{
//     campName: string;
//     fromDate: string;
//     endDate: string;
//     location: string;
//   }>>([]);
//   const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
//   const [loading, setLoading] = useState(false);

//   const API_BASE_URL = 'https://api.jpf-portal-api.com'; // Use your actual API base URL

//   const handleSearch = async () => {
//     if (!aadhar.trim()) {
//       alert('Please enter Aadhar number');
//       return;
//     }

//     try {
//       setLoading(true);
      
//       // Fetch all participants and filter by aadhar
//       const response = await fetch(`${API_BASE_URL}/participants`);
//       const allParticipants = await response.json();

//       // Filter participants by aadhar number
//       const patientParticipants = allParticipants.filter((p: { aadhar: string; }) => p.aadhar === aadhar);

//       if (patientParticipants.length === 0) {
//         setPatientInfo(null);
//         setSearchResults([]);
//         alert('No patient found with this Aadhar number');
//         return;
//       }

//       // Group by registration_source (camp name) and get unique camps
//       const uniqueCamps = patientParticipants.reduce((acc: { campName: any; fromDate: string; endDate: string; location: string; }[], participant: { registration_source: any; created_at: string | number | Date; }) => {
//         const campName = participant.registration_source;
//         if (campName && !acc.find(camp => camp.campName === campName)) {
//           acc.push({
//             campName: campName,
//             fromDate: participant.created_at ? new Date(participant.created_at).toLocaleDateString() : 'N/A',
//             endDate: participant.created_at ? new Date(participant.created_at).toLocaleDateString() : 'N/A',
//             location: getLocationFromParticipant(participant)
//           });
//         }
//         return acc;
//       }, []);

//       // Use the first participant for patient info
//       const firstParticipant = patientParticipants[0];
//       setPatientInfo({
//         name: firstParticipant.name,
//         aadhar: firstParticipant.aadhar,
//         camps: uniqueCamps
//       });

//       setSearchResults(uniqueCamps);
//     } catch (err) {
//       console.error('Error fetching patient data:', err);
//       alert('Error fetching patient data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to extract location from participant data
//   const getLocationFromParticipant = (participant: { registration_source?: any; created_at?: string | number | Date; village?: any; mandal?: any; district?: any; state?: any; }) => {
//     const locationParts = [];
//     if (participant.village) locationParts.push(participant.village);
//     if (participant.mandal) locationParts.push(participant.mandal);
//     if (participant.district) locationParts.push(participant.district);
//     if (participant.state) locationParts.push(participant.state);
    
//     return locationParts.length > 0 ? locationParts.join(', ') : 'Location not specified';
//   };

//   const handleKeyPress = (e: { key: string; }) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-sm">
//       <h1 className="text-2xl font-bold text-gray-900 mb-2">Patient History</h1>
//       <p className="text-gray-600 mb-6">Search patient camp attendance history by Aadhar number</p>

//       {/* Search Section */}
//       <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
//         <div className="flex items-end gap-4">
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Aadhar Number
//             </label>
//             <input
//               type="text"
//               value={aadhar}
//               onChange={(e) => setAadhar(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Enter 12-digit Aadhar number"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
//               maxLength={12}
//               disabled={loading}
//             />
//           </div>
//           <button
//             onClick={handleSearch}
//             disabled={loading}
//             className="px-6 py-2 bg-[#00b4d8] text-white rounded-lg hover:bg-[#0099c3] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Searching...' : 'Search'}
//           </button>
//         </div>
//       </div>

//       {/* Patient Info Section */}
//       {patientInfo && (
//         <div className="bg-[#00b4d8] text-white rounded-lg p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
//               <p><span className="font-medium">Name:</span> {patientInfo.name}</p>
//               <p><span className="font-medium">Aadhar:</span> {patientInfo.aadhar}</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Camp Summary</h3>
//               <p><span className="font-medium">Total Camps Attended:</span> {patientInfo.camps.length}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Results Table */}
//       {searchResults.length > 0 ? (
//         <div>
//           <h3 className="text-xl font-semibold text-[#00b4d8] mb-4">
//             Camp Attendance History ({searchResults.length} camps)
//           </h3>
          
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-[#00b4d8] text-white">
//                   <th className="py-3 px-4 text-left text-sm font-medium">Camp Name</th>
//                   <th className="py-3 px-4 text-left text-sm font-medium">From Date</th>
//                   <th className="py-3 px-4 text-left text-sm font-medium">End Date</th>
//                   <th className="py-3 px-4 text-left text-sm font-medium">Location</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {searchResults.map((camp, index) => (
//                   <tr 
//                     key={index} 
//                     className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="py-3 px-4 text-sm text-gray-900 font-medium">
//                       {camp.campName}
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-900">
//                       {camp.fromDate}
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-900">
//                       {camp.endDate}
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-900">
//                       {camp.location}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : patientInfo && searchResults.length === 0 ? (
//         <div className="text-center py-8 text-gray-500">
//           No camp attendance records found for this patient.
//         </div>
//       ) : null}

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b4d8]"></div>
//           <p className="mt-2 text-gray-600">Searching for patient data...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatientHistory;


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
  hp: string;
  medicine_required: boolean;
  medician: string;
  treatment_required: boolean;
  operation: boolean;
  campcategory: string;
  bp: string;
  rbs: string;
  vision: string;
  spets: string;
  completed_operation_date: string;
  post_operation_date: string;
}

const PatientHistory = () => {
  const [aadhar, setAadhar] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const API_BASE_URL = 'https://api.jpf-portal-api.com'; // Use your actual API base URL

  const handleSearch = async () => {
    if (!aadhar.trim()) {
      alert('Please enter Aadhar number');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const response = await fetch(`${API_BASE_URL}/participants`);
      const allParticipants: Participant[] = await response.json();

      const filtered = allParticipants.filter(p => p.aadhar === aadhar);
      setParticipants(filtered);

      if (filtered.length === 0) {
        alert('No patient found with this Aadhar number');
      }
    } catch (err) {
      console.error('Error fetching patient data:', err);
      alert('Error fetching patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
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

  // Helper to render boolean as Yes/No
  const formatBool = (val: boolean | null | undefined) => {
    if (val === true) return 'Yes';
    if (val === false) return 'No';
    return '-';
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
                <p><span className="font-medium">Name:</span> {participants[0].name}</p>
                <p><span className="font-medium">Aadhar:</span> {participants[0].aadhar}</p>
                <p><span className="font-medium">Age/Gender:</span> {participants[0].age} / {participants[0].gender}</p>
                <p><span className="font-medium">Phone:</span> {participants[0].phone || '-'}</p>
              </div>
              <div>
                <p><span className="font-medium">Address:</span> {participants[0].address || '-'}</p>
                <p><span className="font-medium">Village:</span> {participants[0].village || '-'}</p>
                <p><span className="font-medium">Mandal:</span> {participants[0].mandal || '-'}</p>
                <p><span className="font-medium">District:</span> {participants[0].district || '-'}</p>
              </div>
              <div>
                <p><span className="font-medium">State:</span> {participants[0].state || '-'}</p>
                <p><span className="font-medium">Pincode:</span> {participants[0].pincode || '-'}</p>
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
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Category</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">HP</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Medicine Required</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Medicine Given</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Treatment Required</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Operation</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">BP</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">RBS</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Vision</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">SPETS</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Completed Op Date</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Post Op Date</th>
                    <th className="py-3 px-4 text-left text-sm font-medium whitespace-nowrap">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((p, index) => {
                    const location = [p.village, p.mandal, p.district, p.state].filter(Boolean).join(', ') || '-';
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{index + 1}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{p.registration_source || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{formatDate(p.created_at)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{p.campcategory || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{p.hp || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{formatBool(p.medicine_required)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{p.medician || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{formatBool(p.treatment_required)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{formatBool(p.operation)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{p.bp || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{p.rbs || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{p.vision || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{p.spets || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{formatDate(p.completed_operation_date)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{formatDate(p.post_operation_date)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{location}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
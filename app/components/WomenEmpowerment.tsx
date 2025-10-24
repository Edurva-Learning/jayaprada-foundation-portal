'use client';

import { useState, useEffect } from 'react';
import { Search, User, Phone, IdCard, Download, Eye, MapPin, Users, Calendar, X, Camera, FileText, Loader2 } from 'lucide-react';

export default function WomenEmpowerment() {
  const [activeTab, setActiveTab] = useState<'participants' | 'records'>('participants');
  // Common field style to keep all boxes consistent in size and look
  const fieldBase = "w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all";
  // Lightweight inline toast/notice (non-blocking replacement for alert)
  const [notice, setNotice] = useState<null | { type: 'success' | 'error' | 'info'; message: string }>(null);
  // Map saved tokens to user-facing labels (for backward compatibility with existing rows)
  const labelMap: Record<string, string> = {
    // booleans
    yes: 'Yes',
    no: 'No',
    // training types
    'sewing-machine': 'Sewing Machine',
    'computer-training': 'Computer Training',
    'beauty-parlor': 'Beauty Parlor',
    handicrafts: 'Handicrafts',
    other: 'Other',
    // employment
    'self-employed': 'Self-employed',
    employed: 'Employed',
    unemployed: 'Unemployed',
    'seeking-employment': 'Seeking Employment',
    // gender and misc sources
    male: 'Male',
    female: 'Female',
    // keep generic other mapping as well
    // Note: "other" already mapped above
    'walk-in': 'Walk-in',
    referral: 'Referral',
    campaign: 'Campaign',
  };

  const displayLabel = (v: any): string => {
    const key = String(v ?? '').trim();
    if (!key) return '';
    return labelMap[key] ?? key;
  };
  const [filters, setFilters] = useState({
    name: '',
    aadhar: '',
    phone: '',
    trainingType: 'All Training Types',
    counselling: 'All',
    employmentStatus: 'All Statuses',
    workshop: 'All'
  });
  // Participants search is applied only when user presses Search
  const [appliedParticipantsFilters, setAppliedParticipantsFilters] = useState({
    name: '',
    aadhar: '',
    phone: ''
  });

  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);

  // Participant Form state
  const [participantForm, setParticipantForm] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    aadhar: '',
    address: '',
    registrationSource: 'Women Empowerment',
    registeredThrough: ''
  });

  // Record Form state
  const [recordForm, setRecordForm] = useState({
    participantId: null as number | null,
    participant: '',
    trainingType: '',
    workshopAttended: '',
    counsellingDone: '',
    employmentStatus: '',
    photo: null as File | null,
    idProof: null as File | null
  });

  // Typeahead state for Participant field in Add Record form
  const [participantQuery, setParticipantQuery] = useState('');
  const [showParticipantSuggestions, setShowParticipantSuggestions] = useState(false);

  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [records, setRecords] = useState<any[]>([]);
  const [recordsLoading, setRecordsLoading] = useState<boolean>(false);

  // Always display participants in ascending order of ID
  const sortedParticipants = [...participants].sort((a, b) => {
    const ida = Number(a?.id ?? 0);
    const idb = Number(b?.id ?? 0);
    return ida - idb;
  });

  // Normalize numeric strings for phone/aadhar
  const digitsOnly = (v: any) => String(v ?? '').replace(/\D/g, '');

  // Apply client-side filtering for participants tab
  const filteredParticipants = sortedParticipants.filter((p: any) => {
    const nameMatch = !appliedParticipantsFilters.name || String(p?.name ?? '')
      .toLowerCase()
      .includes(appliedParticipantsFilters.name.toLowerCase());
    const aadharMatch = !appliedParticipantsFilters.aadhar || digitsOnly(p?.aadhar)
      .includes(digitsOnly(appliedParticipantsFilters.aadhar));
    const phoneMatch = !appliedParticipantsFilters.phone || digitsOnly(p?.phone)
      .includes(digitsOnly(appliedParticipantsFilters.phone));
    return nameMatch && aadharMatch && phoneMatch;
  });

  // Suggestions list for typeahead (match by name only)
  const participantSuggestions = sortedParticipants.filter((p: any) => {
    const q = participantQuery.toLowerCase();
    if (!q) return true; // show all when empty
    const name = String(p?.name ?? '').toLowerCase();
    return name.includes(q);
  });

  const API_WE_BASE = 'http://localhost:5000/women-empowerment';

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_WE_BASE}/participants`);
      if (!res.ok) throw new Error('Failed to load participants');
      const data = await res.json();
      setParticipants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching participants:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      setRecordsLoading(true);
      const res = await fetch(`${API_WE_BASE}/records`);
      if (!res.ok) throw new Error('Failed to load records');
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setRecordsLoading(false);
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  useEffect(() => { fetchParticipants(); fetchRecords(); }, []);

  // Keep the typeahead input in sync when the modal opens/closes
  useEffect(() => {
    if (showRecordForm) {
      setParticipantQuery(recordForm.participant || '');
    } else {
      setShowParticipantSuggestions(false);
    }
  }, [showRecordForm]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParticipantFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setParticipantForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecordFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        setRecordForm(prev => ({
          ...prev,
          [name]: fileInput.files![0],
        }));
      }
    } else {
      setRecordForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleReset = () => {
    setFilters({
      name: '',
      aadhar: '',
      phone: '',
      trainingType: 'All Training Types',
      counselling: 'All',
      employmentStatus: 'All Statuses',
      workshop: 'All'
    });
    setAppliedParticipantsFilters({ name: '', aadhar: '', phone: '' });
  };

  // Helper to show a temporary, non-blocking message
  const showNotice = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotice({ type, message });
    // Auto-dismiss after 3 seconds
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSaveParticipant = async () => {
    // basic validation
    if (!participantForm.name) {
      showNotice('Name is required', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_WE_BASE}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participantForm),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save participant');
      }

      await fetchParticipants();

      setParticipantForm({
        name: '',
        age: '',
        gender: '',
        phone: '',
        aadhar: '',
        address: '',
        registrationSource: 'Women Empowerment',
        registeredThrough: ''
      });
      setShowParticipantForm(false);
      showNotice('Participant saved successfully', 'success');
    } catch (e:any) {
      console.error('Save participant failed:', e);
      showNotice(e.message || 'Failed to save participant', 'error');
    }
  };

  const handleSaveRecord = () => {
    console.log("Saving record:", recordForm);
    // Validate required fields
    if (!recordForm.participantId || !recordForm.trainingType) {
      showNotice('Participant and Training Type are required', 'error');
      return;
    }

    // Validate file sizes if files are selected (uploads not yet implemented)
    if (recordForm.photo && recordForm.photo.size > 100 * 1024) {
      showNotice('Photo size should be less than 100KB', 'error');
      return;
    }
    if (recordForm.idProof && recordForm.idProof.size > 200 * 1024) {
      showNotice('ID Proof size should be less than 200KB', 'error');
      return;
    }

    const payload = {
      participantId: recordForm.participantId,
      trainingType: recordForm.trainingType,
      workshopAttended: recordForm.workshopAttended || null,
      counsellingDone: recordForm.counsellingDone || null,
      employmentStatus: recordForm.employmentStatus || null,
      // File uploads are not yet handled; placeholders for future
      photoUrl: null,
      idProofUrl: null,
    };

    fetch(`${API_WE_BASE}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({} as any));
          throw new Error((err as any).error || 'Failed to save record');
        }
        return res.json();
      })
      .then(() => {
        // Refresh lists and reset form
        fetchRecords();
        setRecordForm({
          participantId: null,
          participant: '',
          trainingType: '',
          workshopAttended: '',
          counsellingDone: '',
          employmentStatus: '',
          photo: null,
          idProof: null
        });
        setParticipantQuery('');
        setShowRecordForm(false);
        showNotice('Record saved successfully', 'success');
      })
      .catch((e:any) => {
        console.error('Save record failed:', e);
        showNotice(e.message || 'Failed to save record', 'error');
      });
  };

  const handleCloseParticipantForm = () => {
    setParticipantForm({
      name: '',
      age: '',
      gender: '',
      phone: '',
      aadhar: '',
      address: '',
      registrationSource: 'Women Empowerment',
      registeredThrough: ''
    });
    setShowParticipantForm(false);
  };

  const handleCloseRecordForm = () => {
    setRecordForm({
      participantId: null,
      participant: '',
      trainingType: '',
      workshopAttended: '',
      counsellingDone: '',
      employmentStatus: '',
      photo: null,
      idProof: null
    });
    setShowRecordForm(false);
  };

  const handleAddRecord = (participantId: number, participantName: string) => {
    setRecordForm(prev => ({
      ...prev,
      participantId,
      participant: participantName
    }));
    setParticipantQuery(participantName || '');
    setShowRecordForm(true);
  };

  const participantsData = [
    {
      id: 2,
      name: 'Women1',
      age: 36,
      gender: 'female',
      phone: '0192837465',
      aadhar: '012345678913',
      createdAt: 'Sep 20, 2025'
    }
  ];

  const recordsData = [
    {
      id: 1,
      participant: 'Women1',
      trainingType: 'Sewing Machine',
      workshop: 'Yes',
      counselling: 'No',
      employmentStatus: 'Self-employed',
      createdAt: 'Sep 20, 2025'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Inline toast/notice */}
        {notice && (
          <div
            role="alert"
            className={`fixed top-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-lg text-white ${
              notice.type === 'success' ? 'bg-green-600' : notice.type === 'error' ? 'bg-red-600' : 'bg-gray-800'
            }`}
          >
            {notice.message}
          </div>
        )}
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Women Empowerment Program</h1>
          
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('participants')}
              className={`px-6 py-3 font-medium text-sm rounded-t-lg mr-2 ${
                activeTab === 'participants'
                  ? 'bg-[#00b4d8] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Participants
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-6 py-3 font-medium text-sm rounded-t-lg ${
                activeTab === 'records'
                  ? 'bg-[#00b4d8] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Empowerment Records
            </button>
          </div>
        </div>

        {/* Participants Tab Content */}
        {activeTab === 'participants' && (
          <>
            {/* Statistics Section */}
            <div className="mb-8">
              <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm mb-6">
                <div className="mb-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">1</div>
                      <div className="text-sm font-medium text-black">Total Participants</div>
                    </div>
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">1</div>
                      <div className="text-sm font-medium text-black">Sewing Machine Trained</div>
                    </div>
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">1</div>
                      <div className="text-sm font-medium text-black">Workshop Attended</div>
                    </div>
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">0</div>
                      <div className="text-sm font-medium text-black">Employed Participants</div>
                    </div>
                  </div>
                </div>

                {/* Search Section */}
                <form onSubmit={(e) => { e.preventDefault(); setAppliedParticipantsFilters({ name: filters.name, aadhar: filters.aadhar, phone: filters.phone }); }} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Search by Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="name"
                          value={filters.name}
                          onChange={handleFilterChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                          placeholder="Enter name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Search by Aadhar</label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="aadhar"
                          value={filters.aadhar}
                          onChange={handleFilterChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                          placeholder="Enter Aadhar number"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Search by Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="phone"
                          value={filters.phone}
                          onChange={handleFilterChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button type="submit" className="px-6 py-2.5 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center gap-2">
                      <Search size={18} />
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const empty = { name: '', aadhar: '', phone: '' };
                        setFilters(prev => ({ ...prev, ...empty }));
                        setAppliedParticipantsFilters(empty);
                      }}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Participants Table */}
            <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0077b6]">Women Empowerment Participants</h2>
                <button 
                  onClick={() => setShowParticipantForm(true)}
                  className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <User size={18} />
                  Add Participant
                </button>
              </div>
              
              <div className="overflow-hidden">
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
                    {loading && (
                      <tr>
                        <td colSpan={8} className="p-6">
                          <div className="flex items-center justify-center gap-3 text-[#0077b6]">
                            <Loader2 className="animate-spin" size={20} />
                            <span className="font-medium">Loading participants...</span>
                          </div>
                        </td>
                      </tr>
                    )}
                    {!loading && sortedParticipants.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-gray-600">No participants found</td>
                      </tr>
                    )}
                    {!loading && filteredParticipants.length === 0 && sortedParticipants.length > 0 && (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-gray-600">No participants match your search</td>
                      </tr>
                    )}
                    {!loading && filteredParticipants.map((participant: any) => (
                      <tr key={participant.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3">{participant.id}</td>
                        <td className="p-3">{participant.name}</td>
                        <td className="p-3">{participant.age}</td>
                        <td className="p-3">{displayLabel(participant.gender)}</td>
                        <td className="p-3">{participant.phone}</td>
                        <td className="p-3">{participant.aadhar}</td>
                        <td className="p-3">{formatDate(participant.created_at)}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleAddRecord(participant.id, participant.name)}
                              className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                            >
                              + Add Record
                            </button>
                            <button className="bg-[#00b4d8] hover:bg-[#0096c7] text-white p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors">
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Empowerment Records Tab Content */}
        {activeTab === 'records' && (
          <>
            {/* Statistics and Filters Section */}
            <div className="mb-8">
              <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm mb-6">
                <h2 className="text-lg font-semibold text-[#0077b6] mb-4">Participants</h2>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Empowerment Records</h3>
                  
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">1</div>
                      <div className="text-sm font-medium text-black">Total Participants</div>
                    </div>
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">1</div>
                      <div className="text-sm font-medium text-black">Sewing Machine Trained</div>
                    </div>
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">1</div>
                      <div className="text-sm font-medium text-black">Workshop Attended</div>
                    </div>
                    <div className="bg-[#caf0f8] border border-[#90e0ef] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black mb-1">0</div>
                      <div className="text-sm font-medium text-black">Employed Participants</div>
                    </div>
                  </div>

                  <h4 className="text-sm font-medium text-gray-700 mb-3">Filter Empowerment Records</h4>
                  
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Training Type</label>
                      <select
                        name="trainingType"
                        value={filters.trainingType}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      >
                        <option>All Training Types</option>
                        <option>Sewing Machine</option>
                        <option>Computer Training</option>
                        <option>Beauty Parlor</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Counselling Done</label>
                      <select
                        name="counselling"
                        value={filters.counselling}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      >
                        <option>All</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                      <select
                        name="employmentStatus"
                        value={filters.employmentStatus}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      >
                        <option>All Statuses</option>
                        <option>Self-employed</option>
                        <option>Employed</option>
                        <option>Unemployed</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Workshop Attended</label>
                      <select
                        name="workshop"
                        value={filters.workshop}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                      >
                        <option>All</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="px-6 py-2.5 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center gap-2">
                    <Search size={18} />
                    Apply Filters
                  </button>
                  <button 
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Empowerment Records Table */}
            <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0077b6]">Empowerment Records</h2>
                <button 
                  onClick={() => setShowRecordForm(true)}
                  className="bg-[#00b4d8] hover:bg-[#0096c7] text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <FileText size={18} />
                  Add Record
                </button>
              </div>
              
              <div className="overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
                      <th className="p-3 font-semibold">ID</th>
                      <th className="p-3 font-semibold">Participant</th>
                      <th className="p-3 font-semibold">Training Type</th>
                      <th className="p-3 font-semibold">Workshop</th>
                      <th className="p-3 font-semibold">Counselling</th>
                      <th className="p-3 font-semibold">Employment Status</th>
                      <th className="p-3 font-semibold">Created At</th>
                      <th className="p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recordsLoading && (
                      <tr>
                        <td colSpan={8} className="p-6">
                          <div className="flex items-center justify-center gap-3 text-[#0077b6]">
                            <Loader2 className="animate-spin" size={20} />
                            <span className="font-medium">Loading records...</span>
                          </div>
                        </td>
                      </tr>
                    )}
                    {!recordsLoading && records.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-gray-600">No records found</td>
                      </tr>
                    )}
                    {!recordsLoading && records.map((record:any) => (
                      <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3">{record.id}</td>
                        <td className="p-3">{record.participant || '-'}</td>
                        <td className="p-3">{displayLabel(record.trainingType)}</td>
                        <td className="p-3">{displayLabel(record.workshopAttended) || '-'}</td>
                        <td className="p-3">{displayLabel(record.counsellingDone) || '-'}</td>
                        <td className="p-3">{displayLabel(record.employmentStatus) || '-'}</td>
                        <td className="p-3">{formatDate(record.created_at || record.createdAt)}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button className="text-gray-600 hover:text-[#00b4d8] transition-colors text-lg">
                              💬
                            </button>
                            <button className="text-gray-600 hover:text-[#00b4d8] transition-colors">
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

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
                    onClick={handleCloseParticipantForm}
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
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={participantForm.name}
                      onChange={handleParticipantFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar size={16} className="text-[#00b4d8]" />
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={participantForm.age}
                      onChange={handleParticipantFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      placeholder="Enter age"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={participantForm.gender}
                      onChange={handleParticipantFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone size={16} className="text-[#00b4d8]" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={participantForm.phone}
                      onChange={handleParticipantFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Aadhar Number */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <IdCard size={16} className="text-[#00b4d8]" />
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      name="aadhar"
                      value={participantForm.aadhar}
                      onChange={handleParticipantFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                      placeholder="Enter Aadhar number"
                    />
                  </div>

                  {/* Registration Source */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Registration Source *
                    </label>
                    <select
                      name="registrationSource"
                      value={participantForm.registrationSource}
                      onChange={handleParticipantFormChange}
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none"
                    >
                      <option value="Women Empowerment">Women Empowerment</option>
                    </select>
                  </div>

                  {/* Registered through */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Registered through
                    </label>
                    <select
                      name="registeredThrough"
                      value={participantForm.registeredThrough}
                      onChange={handleParticipantFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent transition-all"
                    >
                      <option value="">Select Source</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Referral">Referral</option>
                      <option value="Campaign">Campaign</option>
                    </select>
                  </div>

                  {/* Address - Full Width */}
                  <div className="col-span-2 space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin size={16} className="text-[#00b4d8]" />
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={participantForm.address}
                      onChange={handleParticipantFormChange}
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
                  onClick={handleCloseParticipantForm}
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

        {/* Add Record Form Modal */}
        {showRecordForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
              {/* Header */}
              <div className="bg-[#00b4d8] rounded-t-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={24} />
                    <h2 className="text-2xl font-bold">Add Empowerment Record</h2>
                  </div>
                  <button 
                    onClick={handleCloseRecordForm}
                    className="p-2 hover:bg-[#0096c7] rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-blue-100 mt-2">Fill in the empowerment record details</p>
              </div>

              {/* Form */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  {/* Participant * (Typeahead) */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User size={16} className="text-[#00b4d8]" />
                      Participant *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="participant"
                        value={participantQuery}
                        onChange={(e) => {
                          const v = e.target.value;
                          setParticipantQuery(v);
                          setRecordForm(prev => ({ ...prev, participant: v }));
                          setShowParticipantSuggestions(true);
                        }}
                        onFocus={() => setShowParticipantSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowParticipantSuggestions(false), 120)}
                        className={`${fieldBase} pr-10`}
                        placeholder="Search participant by name"
                        required
                      />

                      {participantQuery && (
                        <button
                          type="button"
                          aria-label="Clear participant"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setParticipantQuery('');
                            setRecordForm(prev => ({ ...prev, participant: '' }));
                            setShowParticipantSuggestions(false);
                          }}
                        >
                          <X size={16} />
                        </button>
                      )}

                      {showParticipantSuggestions && (
                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {participantSuggestions.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                          ) : (
                            participantSuggestions.map((p: any) => (
                              <button
                                key={p.id}
                                type="button"
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 focus:bg-gray-50"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  const name = (p?.name && String(p.name).trim()) || 'Unnamed participant';
                                  setParticipantQuery(name);
                                  setRecordForm(prev => ({ ...prev, participant: name, participantId: Number(p.id) || null }));
                                  setShowParticipantSuggestions(false);
                                }}
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-900">{(p?.name && String(p.name).trim()) || 'Unnamed participant'}</span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Training Type * */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FileText size={16} className="text-[#00b4d8]" />
                      Training Type *
                    </label>
                    <select
                      name="trainingType"
                      value={recordForm.trainingType}
                      onChange={handleRecordFormChange}
                      className={fieldBase}
                      required
                    >
                      <option value="">Select Training Type</option>
                      <option value="Sewing Machine">Sewing Machine</option>
                      <option value="Computer Training">Computer Training</option>
                      <option value="Beauty Parlor">Beauty Parlor</option>
                      <option value="Handicrafts">Handicrafts</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Workshop Attended */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Workshop Attended
                    </label>
                    <select
                      name="workshopAttended"
                      value={recordForm.workshopAttended}
                      onChange={handleRecordFormChange}
                      className={fieldBase}
                    >
                      <option value="">Select Option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Counselling Done */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Counselling Done
                    </label>
                    <select
                      name="counsellingDone"
                      value={recordForm.counsellingDone}
                      onChange={handleRecordFormChange}
                      className={fieldBase}
                    >
                      <option value="">Select Option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Employment Status */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-[#00b4d8]" />
                      Employment Status
                    </label>
                    <select
                      name="employmentStatus"
                      value={recordForm.employmentStatus}
                      onChange={handleRecordFormChange}
                      className={fieldBase}
                    >
                      <option value="">Select Status</option>
                      <option value="Self-employed">Self-employed</option>
                      <option value="Employed">Employed</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="Seeking Employment">Seeking Employment</option>
                    </select>
                  </div>

                  {/* Photo (Max 100KB, JPG/PNG) */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Camera size={16} className="text-[#00b4d8]" />
                      Photo (Max 100KB, JPG/PNG)
                    </label>
                    <input
                      type="file"
                      name="photo"
                      onChange={handleRecordFormChange}
                      accept=".jpg,.jpeg,.png"
                      className={`${fieldBase} text-sm file:mr-3 file:px-4 file:h-8 file:my-1 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#00b4d8] file:text-white hover:file:bg-[#0096c7]`}
                    />
                    {recordForm.photo && (
                      <p className="text-xs text-gray-500">Selected: {recordForm.photo.name}</p>
                    )}
                  </div>

                  {/* ID Proof (Max 200KB, JPG/PNG) */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FileText size={16} className="text-[#00b4d8]" />
                      ID Proof (Max 200KB, JPG/PNG)
                    </label>
                    <input
                      type="file"
                      name="idProof"
                      onChange={handleRecordFormChange}
                      accept=".jpg,.jpeg,.png"
                      className={`${fieldBase} text-sm file:mr-3 file:px-4 file:h-8 file:my-1 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#00b4d8] file:text-white hover:file:bg-[#0096c7]`}
                    />
                    {recordForm.idProof && (
                      <p className="text-xs text-gray-500">Selected: {recordForm.idProof.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={handleCloseRecordForm}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveRecord}
                  className="flex-1 px-6 py-3 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096c7] transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={18} />
                  Save Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
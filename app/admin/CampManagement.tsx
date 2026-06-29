'use client';
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Calendar, MapPin, Users, FileSpreadsheet, Filter, Search } from 'lucide-react';

interface Camp {
  id: number;
  camp_name: string;
  date: string;
  location: string;
  services: string;
  status: string;
}

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
}

const CampManagement: React.FC = () => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [campParticipants, setCampParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [editingCamp, setEditingCamp] = useState<Camp | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [formData, setFormData] = useState({
    camp_name: '',
    date: '',
    location: '',
    services: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const API_URL = 'http://localhost:5000/camps';
  const PARTICIPANTS_API_URL = 'http://localhost:5000/participants';

  const fetchCamps = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCamps(data);
    } catch (err) {
      console.error('Error fetching camps:', err);
    }
  };

  const fetchParticipants = async () => {
    try {
      const res = await fetch(PARTICIPANTS_API_URL);
      const data = await res.json();
      setParticipants(data);
    } catch (err) {
      console.error('Error fetching participants:', err);
    }
  };

  useEffect(() => {
    fetchCamps();
    fetchParticipants();
    
    const handleCampsUpdated = () => {
      fetchCamps();
    };
    
    window.addEventListener('campsUpdated', handleCampsUpdated);
    return () => {
      window.removeEventListener('campsUpdated', handleCampsUpdated);
    };
  }, []);

  // Helper function to clean location - remove underscore and everything after it
  const cleanLocation = (location: string) => {
    if (!location) return '';
    const parts = location.split('_');
    return parts[0].trim();
  };

  // Get unique locations for filter
  const getUniqueLocations = () => {
    const locations = new Set<string>();
    camps.forEach(camp => {
      const cleaned = cleanLocation(camp.location);
      if (cleaned) locations.add(cleaned);
    });
    return Array.from(locations).sort();
  };

  // Get filtered camps based on location
  const getFilteredCamps = () => {
    return camps.filter(camp => {
      const locationMatch = locationFilter === '' || 
                           cleanLocation(camp.location).toLowerCase().includes(locationFilter.toLowerCase());
      return locationMatch;
    });
  };

  // Get participants for a specific camp
  const getCampParticipantsList = (camp: Camp) => {
    const exactCampName = camp.camp_name.trim();
    
    let campParticipantsList = participants.filter(p => {
      if (!p.registration_source) return false;
      const regSource = p.registration_source.trim();
      const exactMatch = regSource === exactCampName || 
                         regSource === exactCampName + '.xlsx' ||
                         regSource === exactCampName + '.xls' ||
                         regSource === exactCampName + '.csv' ||
                         regSource.startsWith(exactCampName);
      const containsExact = regSource.includes(exactCampName);
      return exactMatch || containsExact;
    });
    
    if (campParticipantsList.length === 0) {
      const locationPart = cleanLocation(camp.location);
      const locationWords = locationPart.split(/\s+/).filter(w => w.length > 2);
      
      if (locationWords.length > 0) {
        campParticipantsList = participants.filter(p => {
          if (!p.registration_source) return false;
          const regSource = p.registration_source.trim().toLowerCase();
          return locationWords.every(word => regSource.includes(word.toLowerCase()));
        });
      }
    }
    
    if (campParticipantsList.length > 0) {
      const otherCampNames = camps
        .filter(c => c.id !== camp.id)
        .map(c => c.camp_name.trim());
      
      campParticipantsList = campParticipantsList.filter(p => {
        if (!p.registration_source) return false;
        const regSource = p.registration_source.trim();
        const belongsToOtherCamp = otherCampNames.some(otherName => {
          return regSource.includes(otherName) || otherName.includes(regSource);
        });
        return !belongsToOtherCamp;
      });
    }
    
    return campParticipantsList;
  };

  // Get services based on participant data for a specific camp
  const getServicesForCamp = (camp: Camp) => {
    const campParticipantsList = getCampParticipantsList(camp);
    
    const servicesSet = new Set<string>();
    
    campParticipantsList.forEach(p => {
      if (p.blood_checkup === true || p.bp || p.height || p.weight || p.hb || p.rbs) {
        servicesSet.add('General');
      }
      
      if (p.dental_examination && p.dental_examination.trim() !== '') {
        servicesSet.add('Dental');
      }
      
      if (p.vision_left || p.vision_right) {
        servicesSet.add('Eye');
      }
      
      if (p.cancer_screening && p.cancer_screening.trim() !== '') {
        servicesSet.add('Cancer');
      }
    });
    
    return Array.from(servicesSet);
  };

  // Get participant count for a camp
  const getParticipantCount = (camp: Camp) => {
    return getCampParticipantsList(camp).length;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (service: string) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const servicesString = selectedServices.join(', ');
      const cleanedLocation = cleanLocation(formData.location);
      
      if (editingCamp) {
        const oldCampName = editingCamp.camp_name;
        const newCampName = formData.camp_name;
        
        const res = await fetch(`${API_URL}/${editingCamp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...formData, 
            location: cleanedLocation,
            services: servicesString, 
            status: 'Active' 
          }),
        });
        const updatedCamp = await res.json();
        setCamps((prev) => prev.map((camp) => (camp.id === updatedCamp.id ? updatedCamp : camp)));
        
        if (oldCampName !== newCampName) {
          const participantsToUpdate = participants.filter(p => {
            if (!p.registration_source) return false;
            const regSource = p.registration_source.trim();
            const oldName = oldCampName.trim();
            return regSource.includes(oldName) || oldName.includes(regSource);
          });
          
          for (const participant of participantsToUpdate) {
            let newRegistrationSource = participant.registration_source;
            const oldNameRegex = new RegExp(oldCampName.trim(), 'gi');
            newRegistrationSource = newRegistrationSource.replace(oldNameRegex, newCampName.trim());
            
            if (newRegistrationSource !== participant.registration_source) {
              await fetch(`${PARTICIPANTS_API_URL}/${participant.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...participant,
                  registration_source: newRegistrationSource
                }),
              });
            }
          }
          await fetchParticipants();
        }
        setEditingCamp(null);
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...formData, 
            location: cleanedLocation,
            services: servicesString, 
            status: 'Active' 
          }),
        });
        const newCamp = await res.json();
        setCamps((prev) => [newCamp, ...prev]);
      }
      setFormData({ camp_name: '', date: '', location: '', services: '' });
      setSelectedServices([]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving camp:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (campId: number, campName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${campName}"?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${campId}`, { method: 'DELETE' });
      if (res.ok) {
        setCamps((prev) => prev.filter((camp) => camp.id !== campId));
      }
    } catch (err) {
      console.error('Error deleting camp:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (camp: Camp) => {
    setEditingCamp(camp);
    setFormData({
      camp_name: camp.camp_name,
      date: camp.date ? camp.date.split('T')[0] : '',
      location: cleanLocation(camp.location),
      services: camp.services,
    });
    if (camp.services) {
      setSelectedServices(camp.services.split(', '));
    } else {
      setSelectedServices([]);
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setFormData({ camp_name: '', date: '', location: '', services: '' });
    setSelectedServices([]);
    setEditingCamp(null);
    setIsModalOpen(false);
  };

  const handleViewCampDetails = (camp: Camp) => {
    setSelectedCamp(camp);
    const campParticipantList = getCampParticipantsList(camp);
    
    setCampParticipants(campParticipantList);
    setFilteredParticipants(campParticipantList);
    setAgeFilter('all');
    setIsParticipantsModalOpen(true);
  };

  const closeParticipantsModal = () => {
    setIsParticipantsModalOpen(false);
    setSelectedCamp(null);
    setCampParticipants([]);
    setFilteredParticipants([]);
    setAgeFilter('all');
  };

  const getAgeNumber = (age: string | number | undefined): number | null => {
    if (!age) return null;
    const num = typeof age === 'string' ? parseInt(age) : age;
    if (isNaN(num)) return null;
    return num;
  };

  const isMale = (gender: string | undefined): boolean => {
    if (!gender) return false;
    const g = gender.toLowerCase().trim();
    return g === 'male' || g === 'm';
  };

  const isFemale = (gender: string | undefined): boolean => {
    if (!gender) return false;
    const g = gender.toLowerCase().trim();
    return g === 'female' || g === 'f';
  };

  const applyAgeFilter = (participantsList: Participant[], filter: string) => {
    if (filter === 'all') return participantsList;
    
    return participantsList.filter(p => {
      const age = getAgeNumber(p.age);
      if (age === null) return filter === 'unknown';
      
      switch(filter) {
        case '0-18':
          return age >= 0 && age <= 18;
        case '19-30':
          return age >= 19 && age <= 30;
        case '31-45':
          return age >= 31 && age <= 45;
        case '46-60':
          return age >= 46 && age <= 60;
        case '60+':
          return age >= 61;
        case 'unknown':
          return age === null;
        default:
          return true;
      }
    });
  };

  const handleAgeFilterChange = (filter: string) => {
    setAgeFilter(filter);
    const filtered = applyAgeFilter(campParticipants, filter);
    setFilteredParticipants(filtered);
  };

  const getAgeDistribution = (participantsList: Participant[]) => {
    const distribution = {
      '0-18': 0,
      '19-30': 0,
      '31-45': 0,
      '46-60': 0,
      '60+': 0,
      'Unknown': 0
    };
    
    participantsList.forEach(p => {
      const age = getAgeNumber(p.age);
      if (age === null) {
        distribution['Unknown']++;
      } else if (age <= 18) {
        distribution['0-18']++;
      } else if (age <= 30) {
        distribution['19-30']++;
      } else if (age <= 45) {
        distribution['31-45']++;
      } else if (age <= 60) {
        distribution['46-60']++;
      } else {
        distribution['60+']++;
      }
    });
    
    return distribution;
  };

  const filteredCamps = getFilteredCamps();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Camp Management</h1>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-[#90e0ef] rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Quick Location:</span>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 min-w-[150px]"
            >
              <option value="">All Locations</option>
              {getUniqueLocations().map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setLocationFilter('')}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-4 gap-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition"
          disabled={isLoading}
        >
          <Plus size={18} /> Add Camp
        </button>
      </div>

      <div className="bg-white border border-[#90e0ef] rounded-lg p-6 shadow-sm mb-6 overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="bg-[#caf0f8] text-[#0077b6] border-b border-[#90e0ef]">
              <th className="p-3 font-semibold text-center">Sl.No</th>
              <th className="p-3 font-semibold text-center">Camp Name</th>
              <th className="p-3 font-semibold text-center">Count</th>
              <th className="p-3 font-semibold text-center">Date</th>
              <th className="p-3 font-semibold text-center">Location</th>
              <th className="p-3 font-semibold text-center">Services</th>
              <th className="p-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCamps.map((camp, index) => {
              const displayLocation = cleanLocation(camp.location);
              const services = getServicesForCamp(camp);
              const participantCount = getParticipantCount(camp);
              
              return (
                <tr key={camp.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleViewCampDetails(camp)}
                      className="text-blue-700 font-medium hover:text-blue-900 hover:underline cursor-pointer transition-colors flex items-center justify-center gap-2 w-full"
                    >
                      <FileSpreadsheet size={16} className="text-green-600 flex-shrink-0" />
                      <span className="break-words">{camp.camp_name}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full">
                      {participantCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {camp.date ? new Date(camp.date).toLocaleDateString('en-GB') : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="break-words font-medium text-gray-700">{displayLocation || 'N/A'}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {services.length > 0 ? (
                        services.map((service, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {service}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No services</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        type="button"
                        onClick={() => handleEdit(camp)} 
                        className="text-gray-600 hover:text-blue-500"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDelete(camp.id, camp.camp_name)} 
                        className="text-gray-600 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredCamps.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            {locationFilter ? 'No camps found matching the location filter' : 'No camps found'}
          </div>
        )}
      </div>

      {/* Camp Participants Modal */}
      {isParticipantsModalOpen && selectedCamp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
              <div className="flex-1 mr-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FileSpreadsheet className="text-green-600" size={28} />
                  {selectedCamp.camp_name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} className="text-gray-500" />
                    {cleanLocation(selectedCamp.location)}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    Total: {campParticipants.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {getServicesForCamp(selectedCamp).length > 0 ? (
                    getServicesForCamp(selectedCamp).map((service, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {service}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No services available</span>
                  )}
                </div>
              </div>
              <button 
                type="button"
                onClick={closeParticipantsModal} 
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {campParticipants.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No participants registered for this camp yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Make sure participants have the Excel filename in their 'registration_source' field
                  </p>
                  <p className="text-gray-400 text-sm">
                    Expected registration_source: <span className="font-mono font-semibold">{selectedCamp.camp_name}</span>
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="text-3xl font-bold text-blue-700">{filteredParticipants.length}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                      <div className="text-sm text-gray-600">Male</div>
                      <div className="text-3xl font-bold text-green-700">
                        {filteredParticipants.filter(p => isMale(p.gender)).length}
                      </div>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-200 text-center">
                      <div className="text-sm text-gray-600">Female</div>
                      <div className="text-3xl font-bold text-pink-700">
                        {filteredParticipants.filter(p => isFemale(p.gender)).length}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Age Filter:</span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {['all', '0-18', '19-30', '31-45', '46-60', '60+', 'unknown'].map((filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => handleAgeFilterChange(filter)}
                            className={`px-3 py-1 text-sm rounded-full transition ${
                              ageFilter === filter 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {filter === 'all' ? 'All' : 
                             filter === 'unknown' ? 'Unknown' : filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">Age Distribution</h4>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                        {Object.entries(getAgeDistribution(filteredParticipants)).map(([group, count]) => (
                          <div key={group} className="text-center bg-white p-2 rounded border border-gray-200">
                            <div className="text-xs text-gray-500">{group}</div>
                            <div className="text-lg font-bold text-gray-800">{count}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Gender Distribution</h4>
                    <div className="flex items-center justify-center gap-6">
                      <div className="flex-1 max-w-2xl h-6 bg-gray-200 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-green-500 transition-all duration-500 flex items-center justify-center text-xs text-white font-bold"
                          style={{ 
                            width: `${filteredParticipants.length > 0 ? (filteredParticipants.filter(p => isMale(p.gender)).length / filteredParticipants.length) * 100 : 0}%`,
                            minWidth: filteredParticipants.filter(p => isMale(p.gender)).length > 0 ? '30px' : '0'
                          }}
                        >
                          {filteredParticipants.filter(p => isMale(p.gender)).length > 0 && 
                            `${Math.round((filteredParticipants.filter(p => isMale(p.gender)).length / filteredParticipants.length) * 100)}%`
                          }
                        </div>
                        <div 
                          className="h-full bg-pink-500 transition-all duration-500 flex items-center justify-center text-xs text-white font-bold"
                          style={{ 
                            width: `${filteredParticipants.length > 0 ? (filteredParticipants.filter(p => isFemale(p.gender)).length / filteredParticipants.length) * 100 : 0}%`,
                            minWidth: filteredParticipants.filter(p => isFemale(p.gender)).length > 0 ? '30px' : '0'
                          }}
                        >
                          {filteredParticipants.filter(p => isFemale(p.gender)).length > 0 && 
                            `${Math.round((filteredParticipants.filter(p => isFemale(p.gender)).length / filteredParticipants.length) * 100)}%`
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                        Male: {filteredParticipants.filter(p => isMale(p.gender)).length} 
                        ({filteredParticipants.length > 0 ? Math.round((filteredParticipants.filter(p => isMale(p.gender)).length / filteredParticipants.length) * 100) : 0}%)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-pink-500 rounded-full inline-block"></span>
                        Female: {filteredParticipants.filter(p => isFemale(p.gender)).length}
                        ({filteredParticipants.length > 0 ? Math.round((filteredParticipants.filter(p => isFemale(p.gender)).length / filteredParticipants.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-center">
                      <thead className="bg-gray-50">
                        <tr className="border-b">
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sl.No</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Age</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Gender</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Phone</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aadhar</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Village</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">District</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredParticipants.map((p, idx) => (
                          <tr key={p.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-center text-sm">{idx + 1}</td>
                            <td className="px-4 py-3 text-center text-sm font-medium text-gray-800 break-words">{p.name}</td>
                            <td className="px-4 py-3 text-center text-sm">{p.age || 'N/A'}</td>
                            <td className="px-4 py-3 text-center text-sm">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                isMale(p.gender) ? 'bg-blue-100 text-blue-800' :
                                isFemale(p.gender) ? 'bg-pink-100 text-pink-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {p.gender || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-sm">{p.phone}</td>
                            <td className="px-4 py-3 text-center text-sm">{p.aadhar}</td>
                            <td className="px-4 py-3 text-center text-sm break-words">{p.village || 'N/A'}</td>
                            <td className="px-4 py-3 text-center text-sm break-words">{p.district || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredParticipants.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No participants found for the selected age filter
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end p-6 border-t bg-gray-50 rounded-b-lg">
              <button
                type="button"
                onClick={closeParticipantsModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-center">{editingCamp ? 'Edit Camp' : 'Add New Camp'}</h2>
              <button 
                type="button"
                onClick={handleClose} 
                className="text-gray-400 hover:text-gray-600" 
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Camp Name (Excel Filename)</label>
                <input 
                  type="text" 
                  name="camp_name" 
                  value={formData.camp_name} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 text-center" 
                  required 
                  disabled={isLoading}
                  placeholder="e.g., GUMMADIDURU VELDURTHIPADU_Nov 26 2026"
                />
                <p className="text-xs text-gray-500 mt-1 text-center">This should match the Excel filename exactly</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Services</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      id="general-checkup" 
                      checked={selectedServices.includes('General CheckUp')} 
                      onChange={() => handleCheckboxChange('General CheckUp')} 
                      className="h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" 
                      disabled={isLoading}
                    />
                    <label htmlFor="general-checkup" className="ml-2 text-sm text-gray-700">General CheckUp</label>
                  </div>
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      id="blood-test" 
                      checked={selectedServices.includes('Blood Test')} 
                      onChange={() => handleCheckboxChange('Blood Test')} 
                      className="h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" 
                      disabled={isLoading}
                    />
                    <label htmlFor="blood-test" className="ml-2 text-sm text-gray-700">Blood Test</label>
                  </div>
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      id="eye-checkup" 
                      checked={selectedServices.includes('Eye CheckUp')} 
                      onChange={() => handleCheckboxChange('Eye CheckUp')} 
                      className="h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" 
                      disabled={isLoading}
                    />
                    <label htmlFor="eye-checkup" className="ml-2 text-sm text-gray-700">Eye CheckUp</label>
                  </div>
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      id="dental-checkup" 
                      checked={selectedServices.includes('Dental CheckUp')} 
                      onChange={() => handleCheckboxChange('Dental CheckUp')} 
                      className="h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" 
                      disabled={isLoading}
                    />
                    <label htmlFor="dental-checkup" className="ml-2 text-sm text-gray-700">Dental CheckUp</label>
                  </div>
                  <div className="flex items-center justify-center col-span-2">
                    <input 
                      type="checkbox" 
                      id="cancer-screening" 
                      checked={selectedServices.includes('Cancer Screening')} 
                      onChange={() => handleCheckboxChange('Cancer Screening')} 
                      className="h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" 
                      disabled={isLoading}
                    />
                    <label htmlFor="cancer-screening" className="ml-2 text-sm text-gray-700">Cancer Screening</label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 text-center" 
                  required 
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 text-center" 
                  required 
                  disabled={isLoading}
                  placeholder="e.g., GUMMADIDURU VELDURTHIPADU"
                />
                <p className="text-xs text-gray-500 mt-1 text-center">Only the location name, without underscore and date</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Services Offered</label>
                <textarea 
                  name="services" 
                  value={formData.services} 
                  onChange={handleInputChange} 
                  rows={3} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 text-center" 
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-center gap-3 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={handleClose} 
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400" 
                  disabled={isLoading}
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2" 
                  disabled={isLoading}
                >
                  {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (editingCamp ? 'Update Camp' : 'Save Camp')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default CampManagement;
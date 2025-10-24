'use client';

import { useState, useEffect } from 'react';
import ProgramOverview from './ProgramOverview';
import SponsorshipsList from './SponsorshipsList';
import SponsorshipType from './SponsorshipType';

interface EducationSponsorshipProgramProps {
  initialTab?: string;
}

const EducationSponsorshipProgram = ({ initialTab }: EducationSponsorshipProgramProps) => {
  // Map sidebar sub-items to tab IDs
  const getTabId = (subItem: string) => {
    switch (subItem) {
      case 'Program Statistics':
        return 'program-statistics';
      case 'Sponsorships':
        return 'sponsorships';
      case 'Sponsorship Types':
        return 'sponsorship-types';
      default:
        return 'program-statistics';
    }
  };

  const [activeTab, setActiveTab] = useState(getTabId(initialTab || ''));

  // Update tab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(getTabId(initialTab));
    }
  }, [initialTab]);

  const tabs = [
    { id: 'program-statistics', label: 'Program Statistics' },
    { id: 'sponsorships', label: 'Sponsorships' },
    { id: 'sponsorship-types', label: 'Sponsorship Types' }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'program-statistics':
        return <ProgramOverview />;
      case 'sponsorships':
        return <SponsorshipsList />;
      case 'sponsorship-types':
        return <SponsorshipType />;
      default:
        return <ProgramOverview />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Education Sponsorship Program</h1>
        <p className="text-gray-600 mt-2">Track and manage educational sponsorships and funding</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Active Component */}
      {renderActiveComponent()}
    </div>
  );
};

export default EducationSponsorshipProgram;

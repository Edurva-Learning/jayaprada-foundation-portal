

// 'use client';
// import React, { useState } from 'react';
// import UserManagement from './UserManagement';
// import CampManagement from './CampManagement';
// import SponsorshipTypes from './SponsorshipTypes';
// import ParticipantManagement from './ParticipantManagement';

// const AdminControls: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('User Management');

//   const tabs = [
//     'User Management',
//     'Camp Management',
//     'Sponsorship Types',
//     'Participant Management',
//   ];

//   const renderTab = () => {
//     switch (activeTab) {
//       case 'User Management':
//         return <UserManagement />;
//       case 'Camp Management':
//         return <CampManagement />;
//       case 'Sponsorship Types':
//         return <SponsorshipTypes />;
//       case 'Participant Management':
//         return <ParticipantManagement />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen font-sans">
//       {/* Header */}
//       <div className="mb-2">
//         <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
//           Admin Controls
//         </h1>
//       </div>

//       <p className="text-gray-500 mb-6 text-lg">
//         Manage system users, camps, sponsorships, and participants
//       </p>

//       {/* Simple Text Tabs - Matching Screenshot */}
//       <div className="flex space-x-8 mb-8">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`text-lg font-medium transition-all duration-200 ${
//               activeTab === tab
//                 ? 'text-blue-600 underline underline-offset-4 decoration-2'
//                 : 'text-gray-600 hover:text-gray-800'
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Dynamic Content */}
//       <div>{renderTab()}</div>
//     </div>
//   );
// };

// export default AdminControls;
'use client';
import React, { useState, useEffect } from 'react';
import UserManagement from "@/app/admin/UserManagement";
import CampManagement from '@/app/admin/CampManagement';
import SponsorshipTypes from '@/app/admin/SponsorshipTypes';
import ParticipantManagement from '@/app/admin/ParticipantManagement';

interface AdminControlsProps {
  initialTab?: string;
}

const AdminControls: React.FC<AdminControlsProps> = ({ initialTab = 'User Management' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    'User Management',
    'Camp Management',
    'Sponsorship Types',
    'Participant Management',
  ];

  // Update active tab when initialTab prop changes
  useEffect(() => {
    if (initialTab && tabs.includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'User Management':
        return <UserManagement />;
      case 'Camp Management':
        return <CampManagement />;
      case 'Sponsorship Types':
        return <SponsorshipTypes />;
      case 'Participant Management':
        return <ParticipantManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Admin Controls
        </h1>
      </div>

      <p className="text-gray-500 mb-6 text-lg">
        Manage system users, camps, sponsorships, and participants
      </p>

      {/* Simple Text Tabs - Matching Screenshot */}
      <div className="flex space-x-8 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-lg font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'text-blue-600 underline underline-offset-4 decoration-2'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div>{renderTab()}</div>
    </div>
  );
};

export default AdminControls;

// 'use client'
// import React, { useState, useEffect } from "react";
// import { Home, Shield, Users, Calendar, FileText, Heart, GraduationCap, User, Sprout, HandHeart, Settings, Menu, IndianRupee, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
// import Dashboard from "@/app/components/Dashboard" // Adjust path as needed
// import UserManagement from "@/app/admin/UserManagement";
// import CampManagement from "@/app/admin/CampManagement";
// import SponsorshipTypes from "@/app/admin/SponsorshipTypes";
// import ParticipantManagement from "@/app/admin/ParticipantManagement";
// import HealthCampPage from "../components/HealthCamps";
// import OrganicAgriculture from "../components/OraganicAgriculture";
// import CommunityPage from "../components/CommunityOutreach";
// import WomenEmpowerment from "../components/WomenEmpowerment";
// import ProgramOverview from "../components/ProgramOverview";
// import SponsorshipsList from "../components/SponsorshipsList";
// import SponsorshipType from "../components/SponsorshipType";
// import FinancePage from "../components/FinancePage";
// import EducationSponsorshipProgram from "../components/EducationSponsorshipProgram";


// // Import other components as needed (e.g., HealthCamps, EducationSponsorship)

// const sidebarItems = [
//   {
//     label: "Dashboard",
//     icon: Home,
//     subItems: [], // No subs for dashboard
//   },
//   {
//     label: "Admin Controls",
//     icon: Shield,
//     subItems: [
//       "User Management",
//       "Camp Management",
//       "Sponsorship Types",
//       "Participant Management",
//     ],
//   },
//   {
//     label: "Health Camps",
//     icon: Heart,
//     subItems: [],
//   },
//   {
//     label: "Education Sponsorship",
//     icon: GraduationCap,
//     subItems: [
//       "Program Statistics",
//       "Sponsorships",
//       "Sponsorship Types",
//     ],
//   },
//   {
//     label: "Women Empowerment",
//     icon: User,
//     subItems: [],
//   },
//   {
//     label: "Organic Agriculture",
//     icon: Sprout,
//     subItems: [],
//   },
//   {
//     label: "Finance And Audit",
//     icon: IndianRupee,
//     subItems: [],
//   },
//   {
//     label: "Community Outreach",
//     icon: HandHeart,
//     subItems: [],
//   },
// ];

// export default function DashboardLayout() {
//   const [openGroup, setOpenGroup] = useState<string | null>(null); // Default no group open
//   const [selected, setSelected] = useState<{ group: string; sub: string } | null>({
//     group: "Dashboard",
//     sub: "Dashboard", // Default to Dashboard content
//   });
//   const [isCollapsed, setIsCollapsed] = useState(false); // Collapsed state
//   // Sidebar widths in pixels for smooth transitions
//   const SIDEBAR_EXPANDED = 256; // 16rem
//   const SIDEBAR_COLLAPSED = 64; // 4rem

//   const handleGroupClick = (label: string) => {

//     const clickedItem = sidebarItems.find((item) => item.label === label);

//     if (!clickedItem) return;

//     if (clickedItem.subItems.length === 0) {
//       // Direct item — select it
//       setSelected({ group: label, sub: label });
//       setOpenGroup(null);
//     } else if (label === "Dashboard") {
//       setSelected({ group: label, sub: label });
//       setOpenGroup(null);
//     } else {
//       setOpenGroup((prev) => (prev === label ? null : label));
//     }
//   };

//   const handleSubClick = (group: string, sub: string) => {
//     setSelected({ group, sub });
//   };

//   const toggleCollapse = () => {
//     setIsCollapsed((prev) => !prev);
//     // Close any open groups when collapsing
//     if (!isCollapsed) {
//       setOpenGroup(null);
//     }
//   };

//   // Render content based on selection
//   const renderContent = () => {
//     if (!selected) return <div className="text-2xl text-gray-400 p-8">Select a menu item</div>;

//     switch (selected.group) {
//       case "Dashboard":
//         return <Dashboard />; // Your dashboard content loads here
//       case "Admin Controls":
//         if (selected.sub === "User Management") return <UserManagement />;
//         if (selected.sub === "Camp Management") return <CampManagement />;
//         if (selected.sub === "Sponsorship Types") return <SponsorshipTypes />;
//         if (selected.sub === "Participant Management") return <ParticipantManagement />;
//         break;
//       // Add cases for other groups (e.g., Health Camps)
//       case "Health Camps":
//         if(selected.sub === "Health Camps") return <HealthCampPage />
//         return <div className="p-6"><h1>Health Camps Content</h1></div>; // Placeholder—replace with component
//       case "Education Sponsorship":
//         if (selected.sub === "Program Statistics") return <EducationSponsorshipProgram initialTab="Program Statistics" />;
//         if (selected.sub === "Sponsorships") return <EducationSponsorshipProgram initialTab="Sponsorships" />;
//         if (selected.sub === "Sponsorship Types") return <EducationSponsorshipProgram initialTab="Sponsorship Types" />;
//         // Default to Program Statistics if no sub-item is selected
//         return <EducationSponsorshipProgram initialTab="Program Statistics" />;
//       // ... Add similar for Women Empowerment, etc.
//       case "Organic Agriculture" :
//         if(selected.sub === "Organic Agriculture") return <OrganicAgriculture />
//          return <div className="p-6"><h1>Organic Agriculture Content</h1></div>;
//       case "Community Outreach" :
//         if(selected.sub === "Community Outreach") return <CommunityPage />
//          return <div className="p-6"><h1>Community Outreach Content</h1></div>;

//        case "Finance And Audit" :
//         if(selected.sub === "Finance And Audit") return <FinancePage/>
//          return <div className="p-6"><h1>Finance Content</h1></div>;
         
//        case "Women Empowerment" :
//         if(selected.sub === "Women Empowerment") return <WomenEmpowerment/>
//          return <div className="p-6"><h1>Women Empowerment Content</h1></div>;

//       default:
//         return <div className="p-6 text-gray-500">Content for {selected.group} - {selected.sub} will render here.</div>;
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden overflow-y-auto">
//       {/* Top Bar - Always Visible */}
//       {/* <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between"> */}
//         {/* <div className="flex items-center space-x-2">
//           <button
//             onClick={toggleCollapse}
//             className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
//             aria-label="Toggle sidebar"
//           >
//             <Menu className="w-6 h-6" />
//           </button>
//           <div className="text-xl font-bold text-cyan-600">Jayaprada</div>
//           <div className="text-sm text-gray-600">Foundation Portal</div>
//         </div> */}
//         {/* Optional: Add user info or other top bar elements here */}
//       {/* </header> */}

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside

//           className={`bg-white text-gray-900 flex flex-col border-r border-gray-200 z-10 overflow-hidden flex-shrink-0`}
//           style={{ width: isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED, transition: 'width 250ms ease-in-out' }}
//         >
//              <div className="mt-auto px-3 pb-3 border-t border-gray-200">
//             <button
//               onClick={toggleCollapse}
//               aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//               className="w-full p-2 mt-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center"
//             >
//               {isCollapsed ? (
//                 <ChevronRight className="w-5 h-5" />
//               ) : (
//                 <ChevronLeft className="w-5 h-5" />
//               )}
//             </button>
//           </div>
//           <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4">
//             <ul className="space-y-2">
//               {sidebarItems.map((item) => {
//                 const Icon = item.icon;
//                 const isSelectedGroup = selected?.group === item.label;
//                 const hasSubs = item.subItems.length > 0;
//                 const showSubs = openGroup === item.label && !isCollapsed; // Hide subs when collapsed

//                 return (
//                   <li key={item.label}>
//                     <div
//                       className={`flex items-center min-h-10 py-2 px-3 rounded-lg cursor-pointer font-medium transition-colors ${
//                         isSelectedGroup || openGroup === item.label
//                           ? "bg-cyan-50 text-cyan-700 border border-cyan-200" 
//                           : "text-gray-700 hover:bg-gray-100"
//                       }`}
//                       onClick={() => handleGroupClick(item.label)}
//                     >
//                       <span className="flex items-center min-w-0 flex-1 gap-3">
//                         <Icon className="w-5 h-5 text-current shrink-0" />
//                         <span
//                           className={`text-current whitespace-normal break-words transition-opacity duration-200 ${
//                             isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
//                           } pr-2`}
//                         >
//                           {item.label}
//                         </span>
//                       </span>
//                       {!isCollapsed && hasSubs && (
//                       <span className="text-xs transform transition-transform">

//                           {showSubs ? (
//                             <ChevronUp className="w-4 h-4 text-current" />
//                           ) : (
//                             <ChevronDown className="w-4 h-4 text-current" />
//                           )}
//                         </span>
//                       )}
//                     </div>
//                     {!isCollapsed && hasSubs && showSubs && (
//                       <ul className="pl-11 mt-2 space-y-1 border-l border-gray-200">
//                         {item.subItems.map((sub) => (
//                           <li
//                             key={sub}
//                             className={`text-sm py-2 px-3 rounded cursor-pointer transition-colors ${
//                               selected?.group === item.label && selected?.sub === sub
//                                 ? "bg-cyan-100 text-cyan-700" 
//                                 : "text-gray-600 hover:bg-gray-100"
//                             }`}
//                             onClick={(e) => {
//                               e.stopPropagation(); // Prevent group toggle
//                               handleSubClick(item.label, sub);
//                             }}
//                           >
//                             {sub}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>
//           {/* User Profile - Shown above toggle when expanded */}
//           {!isCollapsed && (
//             <div className="pt-6 px-3 pb-6">
//               <div className="flex items-center space-x-3">
//                 {/* <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
//                   <span className="text-white font-semibold text-sm">A</span>
//                 </div> */}
//                 {/* <div>
//                   <p className="text-sm font-medium text-gray-900">Admin User</p>
//                   <p className="text-xs text-gray-500">admin@jayaprada.org</p>
//                 </div> */}
//               </div>
//             </div>
//           )}
//           {/* Collapse/Expand control pinned to the bottom of sidebar */}
//           {/* <div className="mt-auto px-3 pb-3 border-t border-gray-200">
//             <button
//               onClick={toggleCollapse}
//               aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//               className="w-full p-2 mt-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center"
//             >
//               {isCollapsed ? (
//                 <ChevronRight className="w-5 h-5" />
//               ) : (
//                 <ChevronLeft className="w-5 h-5" />
//               )}
//             </button>
//           </div> */}
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 min-w-0 bg-white">
//           <div className="p-6">
//             {renderContent()}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


'use client'
import React, { useState } from "react";
import {
  Home,
  Shield,
  Heart,
  GraduationCap,
  User,
  Sprout,
  HandHeart,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import Dashboard from "@/app/components/Dashboard";
import UserManagement from "@/app/admin/UserManagement";
import CampManagement from "@/app/admin/CampManagement";
import SponsorshipTypes from "@/app/admin/SponsorshipTypes";
import ParticipantManagement from "@/app/admin/ParticipantManagement";
import HealthCampPage from "../components/HealthCamps";
import OrganicAgriculture from "../components/OraganicAgriculture";
import CommunityPage from "../components/CommunityOutreach";
import WomenEmpowerment from "../components/WomenEmpowerment";
import ProgramOverview from "../components/ProgramOverview";
import SponsorshipsList from "../components/SponsorshipsList";
import SponsorshipType from "../components/SponsorshipType";
import FinancePage from "../components/FinancePage";
import EducationSponsorshipProgram from "../components/EducationSponsorshipProgram";

// ✅ Sidebar items (renamed Admin Controls → Participant Management)
const sidebarItems = [
  {
    label: "Dashboard",
    icon: Home,
    subItems: [],
  },
  {
    label: "Participant Management",
    icon: Shield,
    subItems: [], //"participant management"
  },
  {
    label: "Health Camps",
    icon: Heart,
    subItems: [],
  },
];

export default function DashboardLayout() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ group: string; sub: string } | null>({
    group: "Dashboard",
    sub: "Dashboard",
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const SIDEBAR_EXPANDED = 256;
  const SIDEBAR_COLLAPSED = 64;

  const handleGroupClick = (label: string) => {
    const clickedItem = sidebarItems.find((item) => item.label === label);
    if (!clickedItem) return;

    if (clickedItem.subItems.length === 0) {
      setSelected({ group: label, sub: label });
      setOpenGroup(null);
    } else {
      setOpenGroup((prev) => (prev === label ? null : label));
    }
  };

  const handleSubClick = (group: string, sub: string) => {
    setSelected({ group, sub });
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
    if (!isCollapsed) {
      setOpenGroup(null);
    }
  };

  const renderContent = () => {
    if (!selected)
      return <div className="text-2xl text-gray-400 p-8">Select a menu item</div>;

    switch (selected.group) {
      case "Dashboard":
        return <Dashboard />;
      case "Participant Management":
        // ✅ Directly render ParticipantManagement
        return <ParticipantManagement />;
      case "Health Camps":
        return <HealthCampPage />;
      default:
        return (
          <div className="p-6 text-gray-500">
            Content for {selected.group} - {selected.sub} will render here.
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden overflow-y-auto">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-white text-gray-900 flex flex-col border-r border-gray-200 z-10 overflow-hidden flex-shrink-0`}
          style={{
            width: isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
            transition: "width 250ms ease-in-out",
          }}
        >
          {/* Sidebar Items */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isSelectedGroup = selected?.group === item.label;
                const hasSubs = item.subItems.length > 0;
                const showSubs = openGroup === item.label && !isCollapsed;

                return (
                  <li key={item.label}>
                    <div
                      className={`flex items-center min-h-10 py-2 px-3 rounded-lg cursor-pointer font-medium transition-colors ${
                        isSelectedGroup || openGroup === item.label
                          ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => handleGroupClick(item.label)}
                    >
                      <span className="flex items-center min-w-0 flex-1 gap-3">
                        <Icon className="w-5 h-5 text-current shrink-0" />
                        <span
                          className={`text-current whitespace-normal break-words transition-opacity duration-200 ${
                            isCollapsed
                              ? "opacity-0 pointer-events-none"
                              : "opacity-100"
                          } pr-2`}
                        >
                          {item.label}
                        </span>
                      </span>
                      {!isCollapsed && hasSubs && (
                        <span className="text-xs transform transition-transform">
                          {showSubs ? (
                            <ChevronUp className="w-4 h-4 text-current" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-current" />
                          )}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && hasSubs && showSubs && (
                      <ul className="pl-11 mt-2 space-y-1 border-l border-gray-200">
                        {item.subItems.map((sub) => (
                          <li
                            key={sub}
                            className={`text-sm py-2 px-3 rounded cursor-pointer transition-colors ${
                              selected?.group === item.label &&
                              selected?.sub === sub
                                ? "bg-cyan-100 text-cyan-700"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubClick(item.label, sub);
                            }}
                          >
                            {sub}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Collapse Button */}
          <div className="mt-auto px-3 pb-3 border-t border-gray-200">
            <button
              onClick={toggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="w-full p-2 mt-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 bg-white">
          <div className="p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
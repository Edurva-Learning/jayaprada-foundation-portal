'use client'
import React, { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
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
  BarChart,
  BarChart2Icon,
  BarChartHorizontal,
  UserCheck2Icon,
  HousePlug,
  UserCog2Icon,
  CreativeCommonsIcon,
  CreativeCommons,
  TrendingUp,
  Building2Icon,
  TentIcon,
  StethoscopeIcon,
  TentTreeIcon,
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
import ReportsPage from "../components/Reports";
import CampCategories from "../components/CampCategories";
import UsersPage from "../components/Users";
import VendorPage from "../components/Vendor";
import StockInward from "../components/StockInward";
import CampAllocation from "../components/CampAllocation";
import ReturnApproval from "../components/ReturnApproval";
// import IssueMedicine from "../components/IssueMedicine";
import StockAdjustment from "../components/StockAdjustment";
import ReturnStock from "../components/ReturnStock";
import ItemMaster from "../components/ItemMaster";
//import CampCreation from "../components/CreateCamp";
import PatientHistory from "../components/PatientHistory";

// ✅ All sidebar items for admin (role: "Admin")
const adminSidebarItems = [
  {
    label: "Dashboard",
    icon: Home,
    subItems: [],
  },
  {
    label: "Camp Management",
    icon: TentIcon,
    subItems: [],
  },
  {
    label: "Participant Management",
    icon: UserCheck2Icon,
    subItems: [],
  },
  {
    label: "Health Camps",
    icon: Heart,
    subItems: [],
  },
  {
    label: "Patient History",
    icon: StethoscopeIcon,
    subItems: [],
  },
  {
    label: "Reports",
    icon: BarChartHorizontal,
    subItems: [],
  },
  {
    label: "Camp Categories",
    icon: HousePlug,
    subItems: [],
  },
  {
    label: "Users",
    icon: UserCog2Icon,
    subItems: [],
  },
  {
    label: "Inventory",
    icon: CreativeCommons,
    subItems: [
      "Vendor",
      "Item Master",
      "Stock Inward",
      "Camp Allocation",
      "Return Approval",
      "Issue Medicine",
      "Return Stock",
      "Stock Adjustment"
    ],
  },
  {
    label: "Stock Reports",
    icon: TrendingUp,
    subItems: [
      "Stock Reports"
    ]
  }
];

// ✅ Limited sidebar items for staff (role: "staff")
const staffSidebarItems = [
  {
    label: "Dashboard",
    icon: Home,
    subItems: [],
  },
  {
    label: "Participant Management",
    icon: UserCheck2Icon,
    subItems: [],
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sidebarItems, setSidebarItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const SIDEBAR_EXPANDED = 256;
  const SIDEBAR_COLLAPSED = 64;

  // Use user from context (role_id: 1 = Admin, 2 = staff)
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    setIsLoading(userLoading);

    if (user) {
      // Some user objects may provide `role_id` (number) or `role` (string).
      const roleId = (user as any).role_id;
      const roleStr = (user as any).role;

      if (roleId === 1) {
        setUserRole("Admin");
        setSidebarItems(adminSidebarItems);
      } else if (roleId === 2) {
        setUserRole("staff");
        setSidebarItems(staffSidebarItems);
        setSelected({ group: "Dashboard", sub: "Dashboard" });
      } else if (typeof roleStr === "string") {
        // Backwards compatibility: if API returns role string
        if (roleStr.toLowerCase() === "admin") {
          setUserRole("Admin");
          setSidebarItems(adminSidebarItems);
        } else {
          setUserRole("staff");
          setSidebarItems(staffSidebarItems);
          setSelected({ group: "Dashboard", sub: "Dashboard" });
        }
      } else {
        // Fallback to staff
        setUserRole("staff");
        setSidebarItems(staffSidebarItems);
        setSelected({ group: "Dashboard", sub: "Dashboard" });
      }
    } else {
      // No user: try to fallback to localStorage or set staff-safe defaults
      const stored = localStorage.getItem('user');
      try {
        if (stored) {
          const parsed = JSON.parse(stored);
          const roleId = parsed?.role_id;
          const roleStr = parsed?.role;
          if (roleId === 1 || (typeof roleStr === 'string' && roleStr.toLowerCase() === 'admin')) {
            setUserRole('Admin');
            setSidebarItems(adminSidebarItems);
            return;
          }
        }
      } catch (err) {
        // ignore parsing error
      }

      setUserRole('staff');
      setSidebarItems(staffSidebarItems);
      setSelected({ group: 'Dashboard', sub: 'Dashboard' });
    }
  }, [user, userLoading]);

  const handleGroupClick = (label: string) => {
    const clickedItem = sidebarItems.find((item) => item.label === label);
    if (!clickedItem) return;

    if (clickedItem.subItems.length === 0) {
      setSelected({ group: label, sub: label });
      setOpenGroup(null);
    } else if (label === "Dashboard") {
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

    // Role-based content access control
    if (userRole === "staff") {
      const allowedGroups = ["Dashboard", "Participant Management", "Health Camps"];
      if (!allowedGroups.includes(selected.group)) {
        return (
          <div className="p-6 text-red-500 text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <p className="text-sm mt-2">Contact administrator for access.</p>
          </div>
        );
      }
    }

    switch (selected.group) {
      case "Dashboard":
        return <Dashboard />;
      case "Participant Management":
        return <ParticipantManagement />;
      case "Health Camps":
        return <HealthCampPage />;
      case "Reports":
        return userRole === "Admin" ? <ReportsPage /> : <AccessDenied />;
      case "Camp Categories":
        return userRole === "Admin" ? <CampCategories /> : <AccessDenied />;
      case "Users":
        return userRole === "Admin" ? <UsersPage /> : <AccessDenied />;
      case "Inventory":
        // Inventory is admin-only
        if (userRole !== "Admin") return <AccessDenied />;
        
        if (selected.sub === "Vendor") return <VendorPage />;
        if (selected.sub === "Item Master") return <ItemMaster />;
        if (selected.sub === "Stock Inward") return <StockInward />;
        if (selected.sub === "Camp Allocation") return <CampAllocation />;
        if (selected.sub === "Return Approval") return <ReturnApproval />;
        // if (selected.sub === "Issue Medicine") return <IssueMedicine />;
        if (selected.sub === "Return Stock") return <ReturnStock />;
        if (selected.sub === "Stock Adjustment") return <StockAdjustment />;
        return <div className="p-6 text-gray-500">Select an Inventory option</div>;
      case "Stock Reports":
        return userRole === "Admin" ? <div className="p-6"><h1>Stock Reports</h1></div> : <AccessDenied />;
      case "Patient History":
        return userRole === "Admin" ? <PatientHistory /> : <AccessDenied />;
      case "Camp Management":
        return userRole === "Admin" ? <CampManagement /> : <AccessDenied />;
      default:
        return (
          <div className="p-6 text-gray-500">
            Content for {selected.group} - {selected.sub} will render here.
          </div>
        );
    }
  };

  // Access Denied Component
  const AccessDenied = () => (
    <div className="p-6 text-red-500 text-center">
      <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
      <p>You don't have permission to access this page.</p>
      <p className="text-sm mt-2">Contact administrator for access.</p>
    </div>
  );

  // Show loading while determining user role
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden overflow-y-auto">
      {/* Role Indicator - Optional, can be removed */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-2 text-sm text-blue-700">
        Logged in as: {userRole === "Admin" ? 'Administrator' : 'Staff'}
      </div>

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
                        {item.subItems.map((sub: string) => (
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
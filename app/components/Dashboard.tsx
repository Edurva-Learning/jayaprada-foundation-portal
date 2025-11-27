// 'use client';
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   Users,
//   UserPlus,
//   Activity,
//   GraduationCap,
//   DollarSign,
//   Heart,
//   BookOpen,
//   Leaf,
// } from 'lucide-react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Label,
// } from 'recharts';

// const Dashboard: React.FC = () => {
//   const [stats, setStats] = useState({
//     total: 0,
//     todayCount: 0,
//     healthCampCount: 0,
//     eyeCamps: 0,
//     dentalCamps: 0,
//     generalHealth: 0,
//     cancerScreening: 0
//   });
//   const [participants, setParticipants] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchParticipants = async () => {
//       try {
//         setIsLoading(true);
//         const res = await fetch('https://api.jpf-portal-api.com/participants');
//         const data = await res.json();

//         setParticipants(data);

//         // ✅ Calculate total participants
//         const total = data.length;

//         // ✅ Participants created today
//         const today = new Date().toISOString().split('T')[0];
//         const todayCount = data.filter((p: any) =>
//           p.created_at?.startsWith(today)
//         ).length;

//         // ✅ Participants registered in "Health Camp"
//         const healthCampCount = data.filter(
//           (p: any) => p.registration_source === 'Health Camp'
//         ).length;

//         // ✅ Now calculate camp-type-wise counts
//         const eyeCamps = data.filter(
//           (p: any) => p.campcategory === 'Eye CheckUp'
//         ).length;

//         const dentalCamps = data.filter(
//           (p: any) => p.campcategory === 'Dental CheckUp'
//         ).length;

//         const generalHealth = data.filter(
//           (p: any) => p.campcategory === 'General CheckUp'
//         ).length;

//         const cancerScreening = data.filter(
//           (p: any) => p.campcategory === 'Cancer Screening'
//         ).length;

//         // ✅ Store computed stats
//         setStats({
//           total,
//           todayCount,
//           healthCampCount,
//           eyeCamps,
//           dentalCamps,
//           generalHealth,
//           cancerScreening,
//         });
//       } catch (err) {
//         console.error('Error fetching participants:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchParticipants();
//   }, []);

//   // Dynamic trend data calculation
//   const trendData = useMemo(() => {
//     if (participants.length === 0) return [];

//     // Get current date and calculate last 12 months
//     const currentDate = new Date();
//     const months: { year: number; month: number; monthName: string; Health: number; Education: number; Women: number; Agriculture: number; GirlChild: number; Covid: number; }[] = [];

//     // Create array of last 12 months
//     for (let i = 11; i >= 0; i--) {
//       const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
//       months.push({
//         year: date.getFullYear(),
//         month: date.getMonth(),
//         monthName: date.toLocaleString('default', { month: 'short' }),
//         Health: 0,
//         Education: 0,
//         Women: 0,
//         Agriculture: 0,
//         GirlChild: 0,
//         Covid: 0
//       });
//     }

//     // Count participants by month and program
//     participants.forEach((participant) => {
//       if (!participant.created_at) return;

//       const participantDate = new Date(participant.created_at);
//       const participantYear = participantDate.getFullYear();
//       const participantMonth = participantDate.getMonth();

//       // Find the corresponding month in our trend data
//       const monthData = months.find(m =>
//         m.year === participantYear && m.month === participantMonth
//       );

//       if (monthData) {
//         // Map registration_source to the appropriate category
//         const source = participant.registration_source;

//         switch (source) {
//           case 'Health Camp':
//             monthData.Health += 1;
//             break;
//           case 'Education Sponsorship':
//             monthData.Education += 1;
//             break;
//           case 'Women Empowerment':
//             monthData.Women += 1;
//             break;
//           case 'Organic Agriculture':
//             monthData.Agriculture += 1;
//             break;
//           case 'Girl Child Support':
//             monthData.GirlChild += 1;
//             break;
//           case 'Covid Relief':
//             monthData.Covid += 1;
//             break;
//           default:
//             // If no specific category, count as Health (or adjust as needed)
//             monthData.Health += 1;
//         }
//       }
//     });

//     // Return only the data needed for the chart
//     return months.map(month => ({
//       month: month.monthName,
//       Health: month.Health,
//       Education: month.Education,
//       Women: month.Women,
//       Agriculture: month.Agriculture,
//       GirlChild: month.GirlChild,
//       Covid: month.Covid
//     }));
//   }, [participants]);

//   // --- Static demo data ---
//   const totalBeneficiaries = stats.total;
//   const newParticipants = stats.todayCount;
//   const activeCamps = 1;
//   const totalSponsorships = 0;

//   const barData = [
//     { name: 'Health Camp', value: stats.healthCampCount, color: '#3B82F6' },
//     { name: 'Education Sponsorship', value: 0, color: '#10B981' },
//     { name: 'Women Empowerment', value: 0, color: '#8B5CF6' },
//     { name: 'Organic Agriculture', value: 0, color: '#6EE7B7' },
//     { name: 'Girl Child Support', value: 0, color: '#EF4444' },
//     { name: 'Covid Relief', value: 0, color: '#60A5FA' },
//   ];

//   const pieData = [
//     { name: 'Eye CheckUps', value: stats.eyeCamps, color: '#3B82F6' },
//     { name: 'Dental CheckUps', value: stats.dentalCamps, color: '#22C55E' },
//     { name: 'General CheckUps', value: stats.generalHealth, color: '#A855F7' },
//     { name: 'Cancer Screening', value: stats.cancerScreening, color: '#F97316' },
//   ];

//   const recentActivity = [
//     {
//       icon: <DollarSign className="text-orange-500 w-5 h-5" />,
//       text: 'Donation Received: $500 from Sarah M.',
//       time: '2 min ago',
//     },
//     {
//       icon: <Heart className="text-blue-500 w-5 h-5" />,
//       text: 'Health Camp completed in Riverside Village, 150 people served.',
//       time: '15 min ago',
//     },
//     {
//       icon: <Users className="text-purple-500 w-5 h-5" />,
//       text: '25 new women joined the Empowerment program.',
//       time: '1 hour ago',
//     },
//     {
//       icon: <BookOpen className="text-green-500 w-5 h-5" />,
//       text: 'New Education Sponsorship for student in Metro City.',
//       time: '2 hours ago',
//     },
//     {
//       icon: <Leaf className="text-lime-600 w-5 h-5" />,
//       text: 'Organic Agriculture training workshop completed in Green Valley.',
//       time: '3 hours ago',
//     },
//   ];

//   const totalPie = pieData.reduce((acc, item) => acc + item.value, 0);

//   return (
//     <div className="p-6 space-y-8">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-1">
//           Welcome back, Admin
//         </h1>
//         <p className="text-gray-500">
//           Here's what's happening with your foundation today
//         </p>
//       </div>

//       {/* Top Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {/* Total Beneficiaries */}
//         <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">
//               Total Beneficiaries
//             </h3>
//             <Users className="w-6 h-6 text-blue-600" />
//           </div>
//           <div className="text-3xl font-bold mt-2 text-gray-900">
//             {totalBeneficiaries.toLocaleString()}
//           </div>
//           <p className="text-sm text-green-600 mt-1">↑ 5.2% this month</p>
//         </div>

//         {/* New Participants */}
//         <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">
//               New Participants Today
//             </h3>
//             <UserPlus className="w-6 h-6 text-green-600" />
//           </div>
//           <div className="text-3xl font-bold mt-2 text-gray-900">
//             {newParticipants}
//           </div>
//           <p className="text-sm text-green-600 mt-1">
//             ↑ 12.5% vs yesterday
//           </p>
//         </div>

//         {/* Active Health Camps */}
//         <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">
//               Active Health Camps
//             </h3>
//             <Activity className="w-6 h-6 text-orange-500" />
//           </div>
//           <div className="text-3xl font-bold mt-2 text-gray-900">
//             {activeCamps}
//           </div>
//           <p className="text-sm text-green-600 mt-1">↑ 3% vs last week</p>
//         </div>

//         {/* Total Sponsorships */}
//         <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">
//               Total Sponsorships
//             </h3>
//             <GraduationCap className="w-6 h-6 text-indigo-500" />
//           </div>
//           <div className="text-3xl font-bold mt-2 text-gray-900">
//             {totalSponsorships.toLocaleString()}
//           </div>
//           <p className="text-sm text-green-600 mt-1">↑ 7.8% this quarter</p>
//         </div>
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Bar Chart */}
//         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">
//             Beneficiaries by Program
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={barData} layout="vertical">
//               <XAxis type="number" hide />
//               <YAxis
//                 dataKey="name"
//                 type="category"
//                 width={160}
//                 tick={{ fontSize: 13, fill: '#4B5563' }}
//               />
//               <Tooltip />
//               <Bar dataKey="value" radius={[4, 4, 4, 4]}>
//                 {barData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>

//           {/* Data under chart */}
//           <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-y-4 text-sm text-gray-700">
//             {barData.map((item, i) => (
//               <div key={i} className="flex items-center gap-4">
//                 <div
//                   className="w-3 h-3 rounded-full"
//                   style={{ backgroundColor: item.color }}
//                 />
//                 <span>{item.name}: </span>
//                 <span className="font-semibold">
//                   {item.value.toLocaleString()}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pie Chart */}
//         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">
//             Health Camp Types Distribution
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={pieData}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={70}
//                 outerRadius={100}
//                 dataKey="value"
//                 paddingAngle={3}
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//                 <Label
//                   position="center"
//                   content={() => (
//                     <text
//                       x="50%"
//                       y="50%"
//                       textAnchor="middle"
//                       dominantBaseline="middle"
//                       className="text-2xl font-bold fill-gray-800"
//                     >
//                       {totalPie.toLocaleString()}
//                     </text>
//                   )}
//                 />
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>

//           {/* Legends below chart */}
//           <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-y-2 text-sm text-gray-700">
//             {pieData.map((item, i) => (
//               <div key={i} className="flex items-center gap-2">
//                 <div
//                   className="w-3 h-3 rounded-full"
//                   style={{ backgroundColor: item.color }}
//                 />
//                 <span>{item.name}: </span>
//                 <span className="font-semibold">
//                   {item.value.toLocaleString()} (
//                   {((item.value / totalPie) * 100).toFixed(1)}%)
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Program Participation & Recent Activity */}
//       <div className="space-y-8">
//         {/* Program Participation Trend */}
//         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">
//             Program Participation Trend (Last 12 Months)
//           </h2>
//           {isLoading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="text-gray-500">Loading trend data...</div>
//             </div>
//           ) : (
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={trendData}>
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="Health" fill="#3B82F6" />
//                 <Bar dataKey="Education" fill="#10B981" />
//                 <Bar dataKey="Women" fill="#8B5CF6" />
//                 <Bar dataKey="Agriculture" fill="#6EE7B7" />
//                 <Bar dataKey="GirlChild" fill="#EF4444" />
//                 <Bar dataKey="Covid" fill="#60A5FA" />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </div>


//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//           {/* Recent Activity */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">
//               Recent Activity
//             </h2>
//             <div className="space-y-4">
//               {recentActivity.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex items-start gap-3 border-b pb-3 last:border-none"
//                 >
//                   <div className="mt-1">{item.icon}</div>
//                   <div>
//                     <p className="text-gray-800 font-medium">{item.text}</p>
//                     <p className="text-sm text-gray-500">{item.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">
//               Quick Actions
//             </h2><br/>

//             <div className="space-y-4">
//               <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50">
//                 + Create New Camp
//               </button>

//               <button className="w-full py-2 px-4 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50">
//                 Add New User
//               </button>

//               <button className="w-full py-2 px-4 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50">
//                 Manage Categories
//               </button>

//               <button className="w-full py-2 px-4 border border-yellow-600 text-yellow-600 rounded-lg font-medium hover:bg-yellow-50">
//                 Map Users to Camps
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// Dashboard component: add optional `showWelcome` prop so it can be used
// as a public landing (no welcome header) before login.
'use client';
import React from 'react';
import {
  Users,
  UserPlus,
  Activity,
  GraduationCap,
  DollarSign,
  Heart,
  BookOpen,
  Leaf,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from 'recharts';

interface DashboardProps {
  showWelcome?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ showWelcome = true }) => {
  // Static data - replace dynamic data with fixed values
  const totalBeneficiaries = 1250;
  const newParticipants = 25;
  const activeCamps = 12;
  const totalSponsorships = 89;

  // Static bar chart data
  const barData = [
    { name: 'Health Camp', value: 800, color: '#3B82F6' },
    { name: 'Education Sponsorship', value: 150, color: '#10B981' },
    { name: 'Women Empowerment', value: 120, color: '#8B5CF6' },
    { name: 'Organic Agriculture', value: 80, color: '#6EE7B7' },
    { name: 'Girl Child Support', value: 60, color: '#EF4444' },
    { name: 'Covid Relief', value: 40, color: '#60A5FA' },
  ];

  // Static pie chart data
  const pieData = [
    { name: 'Eye CheckUps', value: 350, color: '#3B82F6' },
    { name: 'Dental CheckUps', value: 280, color: '#22C55E' },
    { name: 'General CheckUps', value: 420, color: '#A855F7' },
    { name: 'Cancer Screening', value: 200, color: '#F97316' },
  ];

  // Static trend data for program participation
  const trendData = [
    { month: 'Dec', Health: 65, Education: 12, Women: 8, Agriculture: 5, GirlChild: 3, Covid: 7 },
    { month: 'Jan', Health: 78, Education: 15, Women: 10, Agriculture: 6, GirlChild: 4, Covid: 9 },
    { month: 'Feb', Health: 82, Education: 18, Women: 12, Agriculture: 7, GirlChild: 5, Covid: 11 },
    { month: 'Mar', Health: 95, Education: 22, Women: 15, Agriculture: 9, GirlChild: 6, Covid: 13 },
    { month: 'Apr', Health: 110, Education: 25, Women: 18, Agriculture: 11, GirlChild: 7, Covid: 15 },
    { month: 'May', Health: 125, Education: 28, Women: 20, Agriculture: 13, GirlChild: 8, Covid: 17 },
    { month: 'Jun', Health: 140, Education: 32, Women: 22, Agriculture: 15, GirlChild: 9, Covid: 19 },
    { month: 'Jul', Health: 155, Education: 35, Women: 25, Agriculture: 17, GirlChild: 10, Covid: 21 },
    { month: 'Aug', Health: 170, Education: 38, Women: 28, Agriculture: 19, GirlChild: 11, Covid: 23 },
    { month: 'Sep', Health: 185, Education: 42, Women: 30, Agriculture: 21, GirlChild: 12, Covid: 25 },
    { month: 'Oct', Health: 200, Education: 45, Women: 32, Agriculture: 23, GirlChild: 13, Covid: 27 },
    { month: 'Nov', Health: 215, Education: 48, Women: 35, Agriculture: 25, GirlChild: 14, Covid: 29 },
  ];

  const recentActivity = [
    {
      icon: <DollarSign className="text-orange-500 w-5 h-5" />,
      text: 'Donation Received: $500 from Sarah M.',
      time: '2 min ago',
    },
    {
      icon: <Heart className="text-blue-500 w-5 h-5" />,
      text: 'Health Camp completed in Riverside Village, 150 people served.',
      time: '15 min ago',
    },
    {
      icon: <Users className="text-purple-500 w-5 h-5" />,
      text: '25 new women joined the Empowerment program.',
      time: '1 hour ago',
    },
    {
      icon: <BookOpen className="text-green-500 w-5 h-5" />,
      text: 'New Education Sponsorship for student in Metro City.',
      time: '2 hours ago',
    },
    {
      icon: <Leaf className="text-lime-600 w-5 h-5" />,
      text: 'Organic Agriculture training workshop completed in Green Valley.',
      time: '3 hours ago',
    },
  ];

  const totalPie = pieData.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="p-6 space-y-8">
      {/* Header (optional) */}
      {showWelcome && (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, Admin</h1>
          <p className="text-gray-500">Here's what's happening with your foundation today</p>
        </div>
      )}

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Beneficiaries */}
        <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Total Beneficiaries
            </h3>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold mt-2 text-gray-900">
            {totalBeneficiaries.toLocaleString()}
          </div>
          <p className="text-sm text-green-600 mt-1">↑ 5.2% this month</p>
        </div>

        {/* New Participants */}
        <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              New Participants Today
            </h3>
            <UserPlus className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold mt-2 text-gray-900">
            {newParticipants}
          </div>
          <p className="text-sm text-green-600 mt-1">
            ↑ 12.5% vs yesterday
          </p>
        </div>

        {/* Active Health Camps */}
        <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Active Health Camps
            </h3>
            <Activity className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-3xl font-bold mt-2 text-gray-900">
            {activeCamps}
          </div>
          <p className="text-sm text-green-600 mt-1">↑ 3% vs last week</p>
        </div>

        {/* Total Sponsorships */}
        <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Total Sponsorships
            </h3>
            <GraduationCap className="w-6 h-6 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold mt-2 text-gray-900">
            {totalSponsorships.toLocaleString()}
          </div>
          <p className="text-sm text-green-600 mt-1">↑ 7.8% this quarter</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Beneficiaries by Program
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={160}
                tick={{ fontSize: 13, fill: '#4B5563' }}
              />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Data under chart */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-y-4 text-sm text-gray-700">
            {barData.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}: </span>
                <span className="font-semibold">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Health Camp Types Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                paddingAngle={3}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Label
                  position="center"
                  content={() => (
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-2xl font-bold fill-gray-800"
                    >
                      {totalPie.toLocaleString()}
                    </text>
                  )}
                />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Legends below chart */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-y-2 text-sm text-gray-700">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}: </span>
                <span className="font-semibold">
                  {item.value.toLocaleString()} (
                  {((item.value / totalPie) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program Participation & Recent Activity */}
      <div className="space-y-8">
        {/* Program Participation Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Program Participation Trend (Last 12 Months)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Health" fill="#3B82F6" />
              <Bar dataKey="Education" fill="#10B981" />
              <Bar dataKey="Women" fill="#8B5CF6" />
              <Bar dataKey="Agriculture" fill="#6EE7B7" />
              <Bar dataKey="GirlChild" fill="#EF4444" />
              <Bar dataKey="Covid" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 border-b pb-3 last:border-none"
                >
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <p className="text-gray-800 font-medium">{item.text}</p>
                    <p className="text-sm text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <br/>

            <div className="space-y-4">
              <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50">
                + Create New Camp
              </button>

              <button className="w-full py-2 px-4 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50">
                Add New User
              </button>

              <button className="w-full py-2 px-4 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50">
                Manage Categories
              </button>

              <button className="w-full py-2 px-4 border border-yellow-600 text-yellow-600 rounded-lg font-medium hover:bg-yellow-50">
                Map Users to Camps
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// // 'use client';
// // import React from 'react';
// // import {
// //   Users, UserPlus, Activity, GraduationCap, DollarSign, Heart, BookOpen, Leaf
// // } from 'lucide-react';
// // import {
// //   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Label
// // } from 'recharts';

// // const Dashboard: React.FC = () => {
// //   // --- Static demo data ---
// //   const totalBeneficiaries = 9500;
// //   const newParticipants = 47;
// //   const activeCamps = 12;
// //   const totalSponsorships = 3250;

// //   const barData = [
// //     { name: 'Health Camp', value: 2840, color: '#3B82F6' },
// //     { name: 'Education Sponsorship', value: 3250, color: '#10B981' },
// //     { name: 'Women Empowerment', value: 1890, color: '#8B5CF6' },
// //     { name: 'Organic Agriculture', value: 1520, color: '#6EE7B7' },
// //     { name: 'Girl Child Support', value: 1350, color: '#EF4444' },
// //     { name: 'Covid Relief', value: 650, color: '#60A5FA' },
// //   ];

// //   const pieData = [
// //     { name: 'Eye Camps', value: 840, color: '#3B82F6' },
// //     { name: 'Dental Camps', value: 650, color: '#22C55E' },
// //     { name: 'General Health', value: 980, color: '#A855F7' },
// //     { name: 'Cancer Screening', value: 370, color: '#F97316' },
// //   ];

// //   const trendData = [
// //     { month: 'Jan', Health: 230, Education: 270, Women: 150, Agriculture: 110, GirlChild: 90, Covid: 70 },
// //     { month: 'Feb', Health: 220, Education: 260, Women: 140, Agriculture: 115, GirlChild: 95, Covid: 65 },
// //     { month: 'Mar', Health: 225, Education: 280, Women: 145, Agriculture: 118, GirlChild: 100, Covid: 60 },
// //     { month: 'Apr', Health: 230, Education: 275, Women: 148, Agriculture: 120, GirlChild: 102, Covid: 58 },
// //     { month: 'May', Health: 228, Education: 272, Women: 147, Agriculture: 117, GirlChild: 98, Covid: 55 },
// //     { month: 'Jun', Health: 230, Education: 274, Women: 149, Agriculture: 119, GirlChild: 99, Covid: 53 },
// //     { month: 'Jul', Health: 233, Education: 277, Women: 150, Agriculture: 120, GirlChild: 100, Covid: 52 },
// //     { month: 'Aug', Health: 235, Education: 278, Women: 151, Agriculture: 121, GirlChild: 101, Covid: 50 },
// //     { month: 'Sep', Health: 232, Education: 276, Women: 150, Agriculture: 119, GirlChild: 99, Covid: 48 },
// //     { month: 'Oct', Health: 234, Education: 279, Women: 152, Agriculture: 120, GirlChild: 101, Covid: 47 },
// //     { month: 'Nov', Health: 237, Education: 270, Women: 158, Agriculture: 126, GirlChild: 109, Covid: 42 },
// //     { month: 'Dec', Health: 270, Education: 280, Women: 158, Agriculture: 126, GirlChild: 109, Covid: 40 },
// //   ];

// //   const recentActivity = [
// //     { icon: <DollarSign className="text-orange-500 w-5 h-5" />, text: 'Donation Received: $500 from Sarah M.', time: '2 min ago' },
// //     { icon: <Heart className="text-blue-500 w-5 h-5" />, text: 'Health Camp completed in Riverside Village, 150 people served.', time: '15 min ago' },
// //     { icon: <Users className="text-purple-500 w-5 h-5" />, text: '25 new women joined the Empowerment program.', time: '1 hour ago' },
// //     { icon: <BookOpen className="text-green-500 w-5 h-5" />, text: 'New Education Sponsorship for student in Metro City.', time: '2 hours ago' },
// //     { icon: <Leaf className="text-lime-600 w-5 h-5" />, text: 'Organic Agriculture training workshop completed in Green Valley.', time: '3 hours ago' },
// //   ];

// //   const totalPie = pieData.reduce((acc, item) => acc + item.value, 0);

// //   return (
// //     <div className="p-6 space-y-8">
// //       {/* Header */}
// //       <div>
// //         <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, Admin</h1>
// //         <p className="text-gray-500">Here's what's happening with your foundation today</p>
// //       </div>

// //       {/* Top Stats */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// //         {/* Total Beneficiaries */}
// //         <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
// //           <div className="flex justify-between items-center">
// //             <h3 className="text-sm font-medium text-gray-600">Total Beneficiaries</h3>
// //             <Users className="w-6 h-6 text-blue-600" />
// //           </div>
// //           <div className="text-3xl font-bold mt-2 text-gray-900">{totalBeneficiaries.toLocaleString()}</div>
// //           <p className="text-sm text-green-600 mt-1">↑ 5.2% this month</p>
// //         </div>

// //         {/* New Participants */}
// //         <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
// //           <div className="flex justify-between items-center">
// //             <h3 className="text-sm font-medium text-gray-600">New Participants Today</h3>
// //             <UserPlus className="w-6 h-6 text-green-600" />
// //           </div>
// //           <div className="text-3xl font-bold mt-2 text-gray-900">{newParticipants}</div>
// //           <p className="text-sm text-green-600 mt-1">↑ 12.5% vs yesterday</p>
// //         </div>

// //         {/* Active Health Camps */}
// //         <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
// //           <div className="flex justify-between items-center">
// //             <h3 className="text-sm font-medium text-gray-600">Active Health Camps</h3>
// //             <Activity className="w-6 h-6 text-orange-500" />
// //           </div>
// //           <div className="text-3xl font-bold mt-2 text-gray-900">{activeCamps}</div>
// //           <p className="text-sm text-green-600 mt-1">↑ 3% vs last week</p>
// //         </div>

// //         {/* Total Sponsorships */}
// //         <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
// //           <div className="flex justify-between items-center">
// //             <h3 className="text-sm font-medium text-gray-600">Total Sponsorships</h3>
// //             <GraduationCap className="w-6 h-6 text-indigo-500" />
// //           </div>
// //           <div className="text-3xl font-bold mt-2 text-gray-900">{totalSponsorships.toLocaleString()}</div>
// //           <p className="text-sm text-green-600 mt-1">↑ 7.8% this quarter</p>
// //         </div>
// //       </div>

// //       {/* Charts Row */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //         {/* Bar Chart */}
// //         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
// //           <h2 className="text-lg font-semibold text-gray-900 mb-4">Beneficiaries by Program</h2>
// //           <ResponsiveContainer width="100%" height={300}>
// //             <BarChart data={barData} layout="vertical">
// //               <XAxis type="number" hide />
// //               <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 13, fill: '#4B5563' }} />
// //               <Tooltip />
// //               <Bar dataKey="value" radius={[4, 4, 4, 4]}>
// //                 {barData.map((entry, index) => (
// //                   <Cell key={`cell-${index}`} fill={entry.color} />
// //                 ))}
// //               </Bar>
// //             </BarChart>
// //           </ResponsiveContainer>

// //           {/* Data under chart */}
// //           <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm text-gray-700">
// //             {barData.map((item, i) => (
// //               <div key={i} className="flex items-center gap-2">
// //                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
// //                 <span>{item.name}: </span>
// //                 <span className="font-semibold">{item.value.toLocaleString()}</span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Pie Chart */}
// //         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
// //           <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Camp Types Distribution</h2>
// //           <ResponsiveContainer width="100%" height={300}>
// //             <PieChart>
// //               <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={3}>
// //                 {pieData.map((entry, index) => (
// //                   <Cell key={`cell-${index}`} fill={entry.color} />
// //                 ))}
// //                 <Label position="center" content={() => (
// //                   <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-800">
// //                     {totalPie.toLocaleString()}
// //                   </text>
// //                 )} />
// //               </Pie>
// //               <Tooltip />
// //             </PieChart>
// //           </ResponsiveContainer>

// //           {/* Legends below chart */}
// //           <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-y-2 text-sm text-gray-700">
// //             {pieData.map((item, i) => (
// //               <div key={i} className="flex items-center gap-2">
// //                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
// //                 <span>{item.name}: </span>
// //                 <span className="font-semibold">{item.value.toLocaleString()} ({((item.value / totalPie) * 100).toFixed(1)}%)</span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Program Participation & Recent Activity */}
// //       <div className="space-y-8">
// //         {/* Program Participation Trend */}
// //         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
// //           <h2 className="text-lg font-semibold text-gray-900 mb-4">
// //             Program Participation Trend (Last 12 Months)
// //           </h2>
// //           <ResponsiveContainer width="100%" height={300}>
// //             <BarChart data={trendData}>
// //               <XAxis dataKey="month" />
// //               <YAxis />
// //               <Tooltip />
// //               <Bar dataKey="Health" fill="#3B82F6" />
// //               <Bar dataKey="Education" fill="#10B981" />
// //               <Bar dataKey="Women" fill="#8B5CF6" />
// //               <Bar dataKey="Agriculture" fill="#6EE7B7" />
// //               <Bar dataKey="GirlChild" fill="#EF4444" />
// //               <Bar dataKey="Covid" fill="#60A5FA" />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>

// //         {/* Recent Activity */}
// //         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
// //           <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
// //           <div className="space-y-4">
// //             {recentActivity.map((item, index) => (
// //               <div
// //                 key={index}
// //                 className="flex items-start gap-3 border-b pb-3 last:border-none"
// //               >
// //                 <div className="mt-1">{item.icon}</div>
// //                 <div>
// //                   <p className="text-gray-800 font-medium">{item.text}</p>
// //                   <p className="text-sm text-gray-500">{item.time}</p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;
// 'use client';
// import React, {useState, useEffect} from 'react';
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

//   // useEffect(() => {
//   //   const fetchParticipants = async () => {
//   //     try {
//   //       const res = await fetch('http://localhost:5000/participants'); // ✅ your API endpoint
//   //       const data = await res.json();

//   //       setParticipants(data);

//   //       // ✅ Calculate stats
//   //       const total = data.length;

//   //       const today = new Date().toISOString().split('T')[0]; // "2025-10-29"
//   //       const todayCount = data.filter((p: any) =>
//   //         p.created_at?.startsWith(today)
//   //       ).length;

//   //       const healthCampCount = data.filter(
//   //         (p: any) => p.registration_source === 'Health Camp'
//   //       ).length;

//   //       setStats({ total, todayCount, healthCampCount });
//   //     } catch (err) {
//   //       console.error('Error fetching participants:', err);
//   //     }
//   //   };

//   //   fetchParticipants();
//   // }, []);


//   useEffect(() => {
//   const fetchParticipants = async () => {
//     try {
//       const res = await fetch('https://api.jpf-portal-api.com/participants');
//       const data = await res.json();

//       setParticipants(data);

//       // ✅ Calculate total participants
//       const total = data.length;

//       // ✅ Participants created today
//       const today = new Date().toISOString().split('T')[0];
//       const todayCount = data.filter((p: any) =>
//         p.created_at?.startsWith(today)
//       ).length;

//       // ✅ Participants registered in "Health Camp"
//       const healthCampCount = data.filter(
//         (p: any) => p.registration_source === 'Health Camp'
//       ).length;

//       // ✅ Now calculate camp-type-wise counts
//       const eyeCamps = data.filter(
//         (p: any) => p.campcategory === 'Eye CheckUp'
//       ).length;

//       const dentalCamps = data.filter(
//         (p: any) => p.campcategory === 'Dental CheckUp'
//       ).length;

//       const generalHealth = data.filter(
//         (p: any) => p.campcategory === 'General CheckUp'
//       ).length;

//       const cancerScreening = data.filter(
//         (p: any) => p.campcategory === 'Cancer Screening'
//       ).length;

//       // ✅ Store computed stats
//       setStats({
//         total,
//         todayCount,
//         healthCampCount,
//         eyeCamps,
//         dentalCamps,
//         generalHealth,
//         cancerScreening,
//       });
//     } catch (err) {
//       console.error('Error fetching participants:', err);
//     }
//   };

//   fetchParticipants();
// }, []);

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

//   const trendData = [
//     { month: 'Jan', Health: 230, Education: 270, Women: 150, Agriculture: 110, GirlChild: 90, Covid: 70 },
//     { month: 'Feb', Health: 220, Education: 260, Women: 140, Agriculture: 115, GirlChild: 95, Covid: 65 },
//     { month: 'Mar', Health: 225, Education: 280, Women: 145, Agriculture: 118, GirlChild: 100, Covid: 60 },
//     { month: 'Apr', Health: 230, Education: 275, Women: 148, Agriculture: 120, GirlChild: 102, Covid: 58 },
//     { month: 'May', Health: 228, Education: 272, Women: 147, Agriculture: 117, GirlChild: 98, Covid: 55 },
//     { month: 'Jun', Health: 230, Education: 274, Women: 149, Agriculture: 119, GirlChild: 99, Covid: 53 },
//     { month: 'Jul', Health: 233, Education: 277, Women: 150, Agriculture: 120, GirlChild: 100, Covid: 52 },
//     { month: 'Aug', Health: 235, Education: 278, Women: 151, Agriculture: 121, GirlChild: 101, Covid: 50 },
//     { month: 'Sep', Health: 232, Education: 276, Women: 150, Agriculture: 119, GirlChild: 99, Covid: 48 },
//     { month: 'Oct', Health: stats.healthCampCount, Education: 0, Women: 0, Agriculture: 0, GirlChild: 0, Covid: 0 },
//     { month: 'Nov', Health: 237, Education: 270, Women: 158, Agriculture: 126, GirlChild: 109, Covid: 42 },
//     { month: 'Dec', Health: 270, Education: 280, Women: 158, Agriculture: 126, GirlChild: 109, Covid: 40 },
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
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={trendData}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="Health" fill="#3B82F6" />
//               <Bar dataKey="Education" fill="#10B981" />
//               <Bar dataKey="Women" fill="#8B5CF6" />
//               <Bar dataKey="Agriculture" fill="#6EE7B7" />
//               <Bar dataKey="GirlChild" fill="#EF4444" />
//               <Bar dataKey="Covid" fill="#60A5FA" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">
//             Recent Activity
//           </h2>
//           <div className="space-y-4">
//             {recentActivity.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex items-start gap-3 border-b pb-3 last:border-none"
//               >
//                 <div className="mt-1">{item.icon}</div>
//                 <div>
//                   <p className="text-gray-800 font-medium">{item.text}</p>
//                   <p className="text-sm text-gray-500">{item.time}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


'use client';
import React, {useState, useEffect, useMemo} from 'react';
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

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    todayCount: 0,
    healthCampCount: 0,
    eyeCamps: 0,
    dentalCamps: 0,
    generalHealth: 0,
    cancerScreening: 0
  });
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('https://api.jpf-portal-api.com/participants');
        const data = await res.json();

        setParticipants(data);

        // ✅ Calculate total participants
        const total = data.length;

        // ✅ Participants created today
        const today = new Date().toISOString().split('T')[0];
        const todayCount = data.filter((p: any) =>
          p.created_at?.startsWith(today)
        ).length;

        // ✅ Participants registered in "Health Camp"
        const healthCampCount = data.filter(
          (p: any) => p.registration_source === 'Health Camp'
        ).length;

        // ✅ Now calculate camp-type-wise counts
        const eyeCamps = data.filter(
          (p: any) => p.campcategory === 'Eye CheckUp'
        ).length;

        const dentalCamps = data.filter(
          (p: any) => p.campcategory === 'Dental CheckUp'
        ).length;

        const generalHealth = data.filter(
          (p: any) => p.campcategory === 'General CheckUp'
        ).length;

        const cancerScreening = data.filter(
          (p: any) => p.campcategory === 'Cancer Screening'
        ).length;

        // ✅ Store computed stats
        setStats({
          total,
          todayCount,
          healthCampCount,
          eyeCamps,
          dentalCamps,
          generalHealth,
          cancerScreening,
        });
      } catch (err) {
        console.error('Error fetching participants:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  // Dynamic trend data calculation
  const trendData = useMemo(() => {
    if (participants.length === 0) return [];

    // Get current date and calculate last 12 months
    const currentDate = new Date();
    const months: { year: number; month: number; monthName: string; Health: number; Education: number; Women: number; Agriculture: number; GirlChild: number; Covid: number; }[] = [];
    
    // Create array of last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        monthName: date.toLocaleString('default', { month: 'short' }),
        Health: 0,
        Education: 0,
        Women: 0,
        Agriculture: 0,
        GirlChild: 0,
        Covid: 0
      });
    }

    // Count participants by month and program
    participants.forEach((participant) => {
      if (!participant.created_at) return;
      
      const participantDate = new Date(participant.created_at);
      const participantYear = participantDate.getFullYear();
      const participantMonth = participantDate.getMonth();
      
      // Find the corresponding month in our trend data
      const monthData = months.find(m =>
        m.year === participantYear && m.month === participantMonth
      );
      
      if (monthData) {
        // Map registration_source to the appropriate category
        const source = participant.registration_source;
        
        switch (source) {
          case 'Health Camp':
            monthData.Health += 1;
            break;
          case 'Education Sponsorship':
            monthData.Education += 1;
            break;
          case 'Women Empowerment':
            monthData.Women += 1;
            break;
          case 'Organic Agriculture':
            monthData.Agriculture += 1;
            break;
          case 'Girl Child Support':
            monthData.GirlChild += 1;
            break;
          case 'Covid Relief':
            monthData.Covid += 1;
            break;
          default:
            // If no specific category, count as Health (or adjust as needed)
            monthData.Health += 1;
        }
      }
    });

    // Return only the data needed for the chart
    return months.map(month => ({
      month: month.monthName,
      Health: month.Health,
      Education: month.Education,
      Women: month.Women,
      Agriculture: month.Agriculture,
      GirlChild: month.GirlChild,
      Covid: month.Covid
    }));
  }, [participants]);

  // --- Static demo data ---
  const totalBeneficiaries = stats.total;
  const newParticipants = stats.todayCount;
  const activeCamps = 1;
  const totalSponsorships = 0;

  const barData = [
    { name: 'Health Camp', value: stats.healthCampCount, color: '#3B82F6' },
    { name: 'Education Sponsorship', value: 0, color: '#10B981' },
    { name: 'Women Empowerment', value: 0, color: '#8B5CF6' },
    { name: 'Organic Agriculture', value: 0, color: '#6EE7B7' },
    { name: 'Girl Child Support', value: 0, color: '#EF4444' },
    { name: 'Covid Relief', value: 0, color: '#60A5FA' },
  ];

  const pieData = [
    { name: 'Eye CheckUps', value: stats.eyeCamps, color: '#3B82F6' },
    { name: 'Dental CheckUps', value: stats.dentalCamps, color: '#22C55E' },
    { name: 'General CheckUps', value: stats.generalHealth, color: '#A855F7' },
    { name: 'Cancer Screening', value: stats.cancerScreening, color: '#F97316' },
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Welcome back, Admin
        </h1>
        <p className="text-gray-500">
          Here's what's happening with your foundation today
        </p>
      </div>

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
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading trend data...</div>
            </div>
          ) : (
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
          )}
        </div>

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
      </div>
    </div>
  );
};

export default Dashboard;
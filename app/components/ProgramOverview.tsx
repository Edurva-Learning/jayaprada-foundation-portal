// components/education/ProgramOverview.tsx
import { TrendingUp, TrendingDown, Users, CheckCircle, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon }: {
  title: string;
  value: number;
  change: number;
  icon: React.ComponentType<any>;
}) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
        <div className={`flex items-center mt-2 ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span className="text-sm font-medium">
            {change >= 0 ? '+' : ''}{change}%
          </span>
        </div>
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
);

export default function ProgramOverview() {
  const statsData = {
    totalSponsorships: 142,
    totalSponsorshipsChange: 1.5,
    activeSponsorships: 128,
    activeSponsorshipsChange: 1.8,
    completedSponsorships: 14,
    completedSponsorshipsChange: 8,
    totalAmountSponsored: 3850000,
    totalAmountChange: 1.15,
  };

  const breakdownData = [
    { name: 'Education Fee Scholarship', count: 85, amount: 2500000 },
    { name: 'Book & Supplies Grant', count: 45, amount: 850000 },
    { name: 'Uniform Allowance', count: 26, amount: 500000 },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sponsorships"
          value={statsData.totalSponsorships}
          change={statsData.totalSponsorshipsChange}
          icon={Users}
        />
        <StatCard
          title="Active Sponsorships"
          value={statsData.activeSponsorships}
          change={statsData.activeSponsorshipsChange}
          icon={TrendingUp}
        />
        <StatCard
          title="Completed Sponsorships"
          value={statsData.completedSponsorships}
          change={statsData.completedSponsorshipsChange}
          icon={CheckCircle}
        />
        <StatCard
          title="Total Amount Sponsored"
          value={statsData.totalAmountSponsored}
          change={statsData.totalAmountChange}
          icon={DollarSign}
        />
      </div>

      {/* Sponsorship Type Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Sponsorship Type Breakdown
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {breakdownData.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{item.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Count:</span>
                    <span className="font-medium text-gray-900">{item.count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="font-medium text-gray-900">¥{item.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  DollarSign,
  Loader2,
} from 'lucide-react';

interface Sponsorship {
  id: number;
  name_of_sponsorship: string;
  sponsorship_type: string;
  amount: number;
  status: string;
  start_date?: string;
  end_date?: string;
}

interface SponsorshipType {
  id: number;
  name: string;
  description: string;
}

interface BreakdownItem {
  name: string;
  count: number;
  amount: number;
}

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ComponentType<any>;
}) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change !== undefined && (
          <div
            className={`flex items-center mt-2 ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">
              {change >= 0 ? '+' : ''}
              {change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
);

export default function ProgramOverview() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [types, setTypes] = useState<SponsorshipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sponsorshipRes, typeRes] = await Promise.all([
          fetch('https://api.jpf-portal-api.com/edu-sponsorships'),
          fetch('https://api.jpf-portal-api.com/sponsorshiptypes'),
        ]);

        if (!sponsorshipRes.ok || !typeRes.ok) throw new Error('Failed to fetch');

        setSponsorships(await sponsorshipRes.json());
        setTypes(await typeRes.json());
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --------------------
  // ✅ Helper: Calculate change %
  // --------------------
  const calcChange = (current: number, previous: number) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  };

  // --------------------
  // ✅ Compute Stats
  // --------------------
  const stats = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);

    const currentPeriod = sponsorships.filter(
      (s) => new Date(s.start_date || '') >= lastMonth
    );
    const previousPeriod = sponsorships.filter(
      (s) =>
        new Date(s.start_date || '') < lastMonth &&
        new Date(s.start_date || '') >= new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate())
    );

    const totalCurrent = sponsorships.length;
    const totalPrevious = previousPeriod.length;

    const activeCurrent = sponsorships.filter((s) => s.status === 'Active').length;
    const activePrevious = previousPeriod.filter((s) => s.status === 'Active').length;

    const completedCurrent = sponsorships.filter((s) => s.status === 'Completed').length;
    const completedPrevious = previousPeriod.filter((s) => s.status === 'Completed').length;

    const amountCurrent = sponsorships.reduce(
      (sum, s) => sum + (Number(s.amount) || 0),
      0
    );
    const amountPrevious = previousPeriod.reduce(
      (sum, s) => sum + (Number(s.amount) || 0),
      0
    );

    return {
      totalSponsorships: totalCurrent,
      totalChange: calcChange(totalCurrent, totalPrevious),
      activeSponsorships: activeCurrent,
      activeChange: calcChange(activeCurrent, activePrevious),
      completedSponsorships: completedCurrent,
      completedChange: calcChange(completedCurrent, completedPrevious),
      totalAmountSponsored: amountCurrent,
      amountChange: calcChange(amountCurrent, amountPrevious),
    };
  }, [sponsorships]);

  // --------------------
  // ✅ Type Breakdown
  // --------------------
  const breakdown: BreakdownItem[] = useMemo(() => {
    return types.map((type) => {
      const filtered = sponsorships.filter((s) => s.sponsorship_type === type.name);
      return {
        name: type.name,
        count: filtered.length,
        amount: filtered.reduce((sum, s) => sum + (Number(s.amount) || 0), 0),
      };
    });
  }, [sponsorships, types]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-600 ">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading program overview...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-600 font-medium">{error}</div>
    );

  return (
    
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        <StatCard
          title="Total Sponsorships"
          value={stats.totalSponsorships}
          change={stats.totalChange}
          icon={Users}
        />
        <StatCard
          title="Active Sponsorships"
          value={stats.activeSponsorships}
          change={stats.activeChange}
          icon={TrendingUp}
        />
        <StatCard
          title="Completed Sponsorships"
          value={stats.completedSponsorships}
          change={stats.completedChange}
          icon={CheckCircle}
        />
        <StatCard
          title="Total Amount Sponsored"
          value={`₹${stats.totalAmountSponsored.toLocaleString()}`}
          change={stats.amountChange}
          icon={DollarSign}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Sponsorship Type Breakdown
          </h2>
          <p className="text-sm text-gray-500">({breakdown.length} Types)</p>
        </div>
        <div className="p-6">
          {breakdown.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No sponsorship data available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {breakdown.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">{item.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Count:</span>
                      <span className="font-medium text-gray-900">{item.count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span className="font-medium text-cyan-600">₹{item.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

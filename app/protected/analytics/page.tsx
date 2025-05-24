'use client';

import { BarChart, LineChart, PieChart, TrendingUp, Users, Activity, DollarSign, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageLayout } from "@/components/layout/page-layout";

const stats = [
  { label: 'Total Views', value: '12,345', icon: 'mdi:eye' },
  { label: 'Active Users', value: '1,234', icon: 'mdi:account-group' },
  { label: 'Revenue', value: '$12,345', icon: 'mdi:currency-usd' },
  { label: 'Growth', value: '+23%', icon: 'mdi:trending-up' },
];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoading(false);
      } catch (err) {
        setError('Failed to load analytics data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageLayout
      title="Analytics"
      icon="mdi:chart-line"
      loading={loading}
      error={error}
      maxWidth="7xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-accent/50 backdrop-blur-sm border border-foreground/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-foreground/5">
                  <BarChart />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-accent/50 backdrop-blur-sm border border-foreground/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-foreground/5">
                  <Activity />
                  <div>
                    <p className="font-medium">Activity {i}</p>
                    <p className="text-sm text-foreground/60">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/50 backdrop-blur-sm border border-foreground/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Top Sources</h2>
            <div className="space-y-4">
              {[
                { source: 'Direct', value: '45%' },
                { source: 'Search', value: '30%' },
                { source: 'Social', value: '25%' },
              ].map((item) => (
                <div key={item.source} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{item.source}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-foreground/20"
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 
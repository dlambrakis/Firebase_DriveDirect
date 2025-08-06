import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@directdrive/ui';
import { Car, MessageSquare, Tag } from 'lucide-react';
import { DashboardSummary } from '@directdrive/core-types';

interface SummaryStatsProps {
  summary: DashboardSummary;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const SummaryStats: React.FC<SummaryStatsProps> = ({ summary }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Active Listings"
        value={summary.active_listings_count}
        icon={Car}
      />
      <StatCard
        title="Unread Messages"
        value={summary.unread_messages_count}
        icon={MessageSquare}
      />
      <StatCard
        title="Pending Offers"
        value={summary.active_offers_count}
        icon={Tag}
      />
    </div>
  );
};

export default SummaryStats;

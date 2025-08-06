import React from 'react';
import { Users, Car, Star, TrendingUp } from 'lucide-react';

// Interface for the props of a single StatCard
interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
}

// Data for the stat cards is now a separate, typed constant
const statsData: StatCardProps[] = [
  { icon: Users, value: '10,000+', label: 'Active Users' },
  { icon: Car, value: '2,500+', label: 'Cars Sold' },
  { icon: Star, value: '4.9', label: 'Average Rating' },
  { icon: TrendingUp, value: '98%', label: 'Success Rate' },
];

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label }) => (
  <div className="p-6 text-center flex flex-col items-center gap-2">
    <Icon className="w-8 h-8 text-primary mb-2" />
    <p className="text-heading-3 font-bold text-text-primary">{value}</p>
    <p className="text-body-sm text-text-secondary uppercase tracking-wider">
      {label}
    </p>
  </div>
);

const Stats: React.FC = () => {
  return (
    <section className="py-12 bg-transparent -mt-16 md:-mt-20 relative z-20">
      <div className="container-px">
        <div
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-4 divide-x divide-border animate-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          {/* Now we map over the data array */}
          {statsData.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

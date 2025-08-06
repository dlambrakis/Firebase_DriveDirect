import React from 'react';
import { ShieldCheck, Users, Zap, ArrowRightLeft } from 'lucide-react';

// Interface for the props of the FeatureCard component
interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  iconBgColor: string;
}

// Data for the feature cards is now a separate constant
const featuresData: FeatureCardProps[] = [
  {
    icon: ArrowRightLeft,
    title: 'Direct P2P Sales',
    description: 'Buy and sell cars directly with other users, no middlemen.',
    iconBgColor: 'bg-blue-100',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Verified',
    description: 'Advanced verification system ensures safe transactions.',
    iconBgColor: 'bg-green-100',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join a community of car enthusiasts.',
    iconBgColor: 'bg-purple-100',
  },
  {
    icon: Zap,
    title: 'Fast & Easy',
    description: 'Streamlined process makes buying and selling quick.',
    iconBgColor: 'bg-yellow-100',
  },
];

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  iconBgColor,
}) => (
  <div className="bg-white p-8 rounded-3xl shadow-xl text-center flex flex-col items-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
    <div className={`p-4 rounded-full mb-5 ${iconBgColor}`}>
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-heading-4 mb-2 text-text-primary">{title}</h3>
    <p className="text-text-secondary">{description}</p>
  </div>
);

const Features: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container-px text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-heading-2 mb-4">Why Choose DriveDirect?</h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto mb-12">
            We're revolutionizing the way people buy and sell cars with a
            secure, transparent, and user-friendly platform.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Now we map over the data array */}
            {featuresData.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconBgColor={feature.iconBgColor}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MessageSquare, LayoutDashboard, ArrowRight } from 'lucide-react';

// Interface for a single quick action item
interface ActionItem {
  name: string;
  description: string;
  href: string;
  icon: React.ElementType; // Use React.ElementType for component types
}

const actions: ActionItem[] = [
  {
    name: 'Sell Your Car',
    description:
      'List your vehicle in minutes and reach thousands of potential buyers.',
    href: '/create-listing',
    icon: Car,
  },
  {
    name: 'Check Messages',
    description: 'View and respond to inquiries from interested buyers.',
    href: '/messages',
    icon: MessageSquare,
  },
  {
    name: 'My Listings',
    description:
      'Manage your listings, view offers, and mark your car as sold.',
    href: '/my-listings',
    icon: LayoutDashboard,
  },
];

const QuickActions: React.FC = () => {
  return (
    <section>
      <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
        {actions.map((action) => (
          <Link
            to={action.href}
            key={action.name}
            className="group block bg-card p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
              <action.icon className="w-6 h-6" />
            </div>
            <h3 className="mt-6 text-heading-3 font-bold text-card-foreground">
              {action.name}
            </h3>
            <p className="mt-2 text-body-md text-muted-foreground">
              {action.description}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-medium text-primary group-hover:underline">
              Proceed{' '}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;

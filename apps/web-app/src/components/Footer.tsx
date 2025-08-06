import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

// Interface for a single navigation link
interface NavItem {
  href: string;
  name: string;
}

// Interface for a section of navigation links
interface NavSection {
  label: string;
  items: NavItem[];
}

const Footer: React.FC = () => {
  // Applied the explicit types to the footerNavs array
  const footerNavs: NavSection[] = [
    {
      label: 'Navigation',
      items: [{ href: '/search', name: 'Browse Cars' }],
    },
    {
      label: 'Account',
      items: [
        { href: '/login', name: 'Sign In' },
        { href: '/signup', name: 'Sign Up' },
      ],
    },
    {
      label: 'Company',
      items: [
        { href: '/about', name: 'About Us' },
        { href: '/contact', name: 'Contact' },
        { href: '/terms', name: 'Terms of Service' },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto container px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <Car className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-text-primary">
                DriveDirect
              </span>
            </Link>
            <p className="mt-4 text-sm text-text-secondary">
              Buy and sell cars person-to-person.
            </p>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerNavs.map((nav) => (
              <div key={nav.label}>
                <h3 className="text-sm font-semibold text-text-primary tracking-wider uppercase">
                  {nav.label}
                </h3>
                <ul className="mt-4 space-y-2">
                  {nav.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm text-text-secondary hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} DriveDirect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

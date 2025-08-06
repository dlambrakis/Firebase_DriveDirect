import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@directdrive/ui';

const CTA: React.FC = () => {
  return (
    <section className="pb-20 md:pb-28">
      <div className="container-px">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary-dark rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-heading-2 text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-body-lg max-w-2xl mx-auto mb-8 text-blue-100">
                Join thousands of users already buying and selling cars on
                DriveDirect.
              </p>
              {/* Refactored to use the Button component for visual consistency */}
              <Button asChild size="lg" className="shadow-button">
                <Link to="/signup">
                  Create Your Account{' '}
                  <ArrowRight className="inline-block ml-2" size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@directdrive/ui';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2940&auto=format&fit=crop';

/**
 * A full-width hero component for the landing page, featuring a prominent
 * call-to-action and a background image.
 */
const Hero: React.FC = () => {
  return (
    <section className="relative text-center pt-20 md:pt-32 lg:pt-40 pb-16 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="A luxury car driving on a winding road"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      </div>
      <div className="container-px relative z-10">
        <h1 className="text-heading-1 text-white mb-4 animate-fade-in-up">
          Buy & Sell Cars <br />
          <span className="text-primary">Person to Person</span>
        </h1>
        <p
          className="text-body-lg text-gray-200 max-w-2xl mx-auto mb-8 animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          Skip the dealership fees and connect directly with car owners. Find
          your perfect vehicle or sell your car quickly and securely.
        </p>
        <div
          className="flex justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <Button asChild size="lg" className="shadow-button gap-2">
            <Link to="/search">
              Browse Cars <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

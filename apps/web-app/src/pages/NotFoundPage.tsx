import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      {/* You can add a link back to the homepage or other relevant pages here */}
    </div>
  );
};

export default NotFoundPage;

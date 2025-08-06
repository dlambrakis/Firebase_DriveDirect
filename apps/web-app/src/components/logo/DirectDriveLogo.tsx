import React from 'react';

// The component's props are now extended to accept all standard SVG attributes
// for better flexibility (e.g., width, height, fill, etc.).
interface DirectDriveLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * A reusable SVG logo component for the DirectDrive brand.
 */
const DirectDriveLogo: React.FC<DirectDriveLogoProps> = ({
  className,
  ...props
}) => (
  <svg
    className={className}
    viewBox="0 0 200 40"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    {/* A more stylized version of the logo */}
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--primary)" />
        <stop offset="100%" stopColor="var(--primary-dark)" />
      </linearGradient>
    </defs>
    <text
      x="0"
      y="30"
      fontFamily="system-ui, sans-serif"
      fontSize="30"
      fontWeight="bold"
      fill="url(#logoGradient)"
    >
      Direct
    </text>
    <text
      x="95"
      y="30"
      fontFamily="system-ui, sans-serif"
      fontSize="30"
      fontWeight="300"
      fill="currentColor"
    >
      Drive
    </text>
    {/* A simple arrow element to represent direction and drive */}
    <path
      d="M185 20 l10 5 v-10 z"
      fill="url(#logoGradient)"
      transform="translate(0, -2)"
    />
  </svg>
);

export default DirectDriveLogo;

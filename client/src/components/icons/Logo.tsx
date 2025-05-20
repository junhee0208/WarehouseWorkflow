import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M20 5H8a2 2 0 0 0-2 2v2" />
        <path d="M20 5v6m0-6-4 6" />
        <path d="M4 11h12" />
        <path d="M4 15h12" />
        <path d="M8 19h12a2 2 0 0 0 2-2v-2" />
        <path d="M18 19v-6m0 6 4-6" />
      </svg>
      <span className="text-xl font-bold">WMS</span>
    </div>
  );
};

export default Logo;

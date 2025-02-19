import React from 'react';
const MapIcon: React.FC = () => {
    return (
        <svg
            data-testid="map-icon"
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h18v18H3V3z"
            />
        </svg>
    );
};

export default MapIcon;

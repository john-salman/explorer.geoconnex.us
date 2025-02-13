import React from 'react';

type Props = {
    handleClick: () => void;
};

const CloseButton: React.FC<Props> = (props) => {
    const { handleClick } = props;

    return (
        <button
            data-testid="close-button"
            onClick={handleClick}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
            <svg
                data-testid="close-button-icon"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    );
};

export default CloseButton;

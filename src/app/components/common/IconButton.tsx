import React from 'react';

type Props = {
    handleClick: () => void;
    children: React.ReactNode;
    title?: string;
    disabled?: boolean;
    className?: string;
};

const IconButton: React.FC<Props> = (props) => {
    const { handleClick, className = '', disabled = false, title = '' } = props;

    return (
        <button
            title={title}
            onClick={handleClick}
            disabled={disabled}
            className={`bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none ${className} ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
        >
            {props.children}
        </button>
    );
};

export default IconButton;

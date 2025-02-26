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
            className={`bg-white hover:bg-gray-100
                rounded-full p-2 shadow-md  focus:outline-none 
                w-11 h-11
                flex justify-center items-center

                ${className} 
                
                ${
                    disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100'
                }`}
        >
            {props.children}
        </button>
    );
};

export default IconButton;

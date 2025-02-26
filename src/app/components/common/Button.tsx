import React from 'react';

type Props = {
    children: React.ReactNode;
    handleClick: () => void;
};

const Button: React.FC<Props> = (props) => {
    const { handleClick } = props;

    return (
        <button
            onClick={handleClick}
            className={
                'bg-secondary hover:bg-secondary-hover text-white font-bold py-2 px-4 rounded'
            }
        >
            {props.children}
        </button>
    );
};

export default Button;

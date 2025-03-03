import { RightArrow } from '@/app/assets/icons/RightArrow';
import React, { useState } from 'react';

type Props = {
    title: string;
    children: React.ReactNode;
};

const Collapsible: React.FC<Props> = (props) => {
    const { title } = props;

    const [isOpen, setIsOpen] = useState(false);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="bg-primary border-b text-black border-gray-300">
            <button
                className="w-full flex justify-between items-center p-4 bg-primary font-bold text-lg hover:bg-primary-hover focus:outline-none"
                onClick={toggleCollapse}
            >
                {title}
                <span
                    data-testid="arrow-icon-wrapper"
                    className={`transform ${
                        isOpen ? '-rotate-90' : 'rotate-90'
                    }`}
                >
                    <RightArrow />
                </span>
            </button>
            <div
                data-testid="collapsible-content"
                className={`overflow-hidden transition-max-height duration-300 ${
                    isOpen ? 'max-h-screen' : 'max-h-0'
                }`}
            >
                <div className="p-4">{props.children}</div>
            </div>
        </div>
    );
};

export default Collapsible;

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
        <div className="bg-[#46AB9D] border-b text-white border-gray-300">
            <button
                className="w-full flex justify-between items-center p-4 bg-[#46AB9D] font-bold text-lg hover:bg-[#5AA9F0] focus:outline-none"
                onClick={toggleCollapse}
            >
                {title}
                {isOpen ? (
                    <span className={`transform -rotate-90`}>
                        <RightArrow />
                    </span>
                ) : (
                    <span className={`transform rotate-90`}>
                        <RightArrow />
                    </span>
                )}
            </button>
            <div
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

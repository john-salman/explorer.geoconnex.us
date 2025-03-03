import React, { useState } from 'react';

type Props = {
    options: string[];
    selectedOptions: string[] | undefined;
    handleOptionClick: (type: string) => void;
};

const MultiSelect: React.FC<Props> = (props) => {
    const { options, selectedOptions, handleOptionClick } = props;

    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className="w-100 mt-1 mb-1 text-black">
            <div className="relative">
                <button
                    className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    aria-haspopup="listbox"
                    aria-expanded="true"
                    aria-labelledby="listbox-label"
                    onClick={() => setShowOptions(!showOptions)}
                >
                    {showOptions ? 'Click to Close' : 'Select...'}
                </button>
                <div
                    className={`mt-1 w-full rounded-md bg-white shadow-lg ${
                        showOptions ? 'display' : 'hidden'
                    }`}
                >
                    <ul
                        className="rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                        role="listbox"
                        aria-labelledby="listbox-label"
                    >
                        {options.map((type, index) => (
                            <li
                                key={index}
                                className="cursor-pointer select-none relative py-2 pl-3 pr-9"
                                role="option"
                                aria-selected={selectedOptions?.includes(type)}
                                tabIndex={0}
                                onClick={() => handleOptionClick(type)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleOptionClick(type);
                                    }
                                }}
                            >
                                <div className="flex items-center">
                                    <input
                                        data-testid={type}
                                        type="checkbox"
                                        checked={selectedOptions?.includes(
                                            type
                                        )}
                                        onChange={() => handleOptionClick(type)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label
                                        title={type}
                                        className="ml-3 block truncate"
                                    >
                                        {type}
                                    </label>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MultiSelect;

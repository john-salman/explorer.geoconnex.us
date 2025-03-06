import React, { ChangeEvent } from 'react';

type Props = {
    startDate: string;
    handleStartDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
    endDate: string;
    handleEndDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const DateRange: React.FC<Props> = (props) => {
    const { startDate, handleStartDateChange, endDate, handleEndDateChange } =
        props;
    return (
        <>
            {/* Defined in global.css */}
            <div id="date-range-columns">
                <div className="flex flex-col">
                    <label
                        htmlFor="start-date"
                        className="text-sm font-medium mb-1"
                    >
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        className="p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="end-date"
                        className="text-sm font-medium mb-1"
                    >
                        End Date
                    </label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        className="p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </>
    );
};

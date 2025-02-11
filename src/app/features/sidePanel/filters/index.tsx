import React from 'react';
import { Variables } from '@/app/features/SidePanel/Filters/Variables';
import { TemporalCoverage } from '@/app/features/SidePanel/Filters/TemporalCoverage';

export const Filters: React.FC = () => {
    return (
        <>
            {/* <Types /> */}
            <Variables />
            <TemporalCoverage />
        </>
    );
};

'use client';
import React, { lazy } from 'react';
import { MapComponentProps } from './types';

const ClientSideMap = lazy(() => import('./ClientSide'));

const Map: React.FC<MapComponentProps> = (props) => {
    return (
        <>
            <ClientSideMap {...props} />
        </>
    );
};

export default Map;

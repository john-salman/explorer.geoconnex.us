// MapContexts.tsx
'use client';
import { Popup, Map } from 'mapbox-gl';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MapContextType {
    map: Map | null;
    hoverPopup: Popup | null;
    persistentPopup: Popup | null;
    setMap: (map: Map, hoverPopup: Popup, persistentPopup: Popup) => void;
}

interface MapContextsType {
    [key: string]: MapContextType;
}

const MapContexts = createContext<MapContextsType | undefined>(undefined);

export const MapProvider: React.FC<{
    mapIds: string[];
    children: ReactNode;
}> = ({ mapIds, children }) => {
    const setMap = (
        id: string,
        map: Map | null,
        hoverPopup: Popup,
        persistentPopup: Popup
    ) => {
        const _maps: MapContextsType = {
            ...maps,
            [id]: {
                map,
                hoverPopup,
                persistentPopup,
                setMap: (m: Map, h: Popup, p: Popup) => setMap(id, m, h, p),
            },
        };

        setMaps(_maps);
    };
    const DEFAULT_MAPS: MapContextsType = {};
    mapIds.forEach((mapId) => {
        DEFAULT_MAPS[mapId] = {
            map: null,
            hoverPopup: null,
            persistentPopup: null,
            setMap: (map: Map, hoverPopup: Popup, persistentPopup: Popup) =>
                setMap(mapId, map, hoverPopup, persistentPopup),
        };
    });

    const [maps, setMaps] = useState<MapContextsType>(DEFAULT_MAPS);

    return <MapContexts.Provider value={maps}>{children}</MapContexts.Provider>;
};

export const useMap = (id: string): MapContextType => {
    const context = useContext(MapContexts);
    if (!context) {
        throw new Error('useMap must be used within a MapProvider');
    }
    return context[id];
};

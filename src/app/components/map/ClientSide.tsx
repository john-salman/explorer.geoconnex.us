'use client';
// MapComponent.tsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMap } from '@/app/contexts/MapContexts';
import { MapComponentProps } from './types';
import {
    addClickFunctions,
    addHoverFunctions,
    addLayers,
    addSources,
} from './utils';

import 'mapbox-gl/dist/mapbox-gl.css';

const MapComponent: React.FC<MapComponentProps> = (props) => {
    const { id, sources, layers, options, accessToken } = props;

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const { map, setMap } = useMap(id);

    useEffect(() => {
        if (!map && mapContainerRef.current) {
            mapboxgl.accessToken = accessToken;
            const newMap = new mapboxgl.Map({
                ...options,
                container: mapContainerRef.current,
            });

            const hoverPopup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            });

            const persistentPopup = new mapboxgl.Popup();

            newMap.on('load', () => {
                setMap(newMap, hoverPopup, persistentPopup);
                addSources(newMap, sources);
                addLayers(newMap, layers);
                addHoverFunctions(newMap, layers, hoverPopup, persistentPopup);
                addClickFunctions(newMap, layers, hoverPopup, persistentPopup);
            });
        }

        return () => {
            if (map) map.remove();
        };
    }, []);

    // Style the container using #map-container-${id} in a global css file
    return <div id={`map-container-${id}`} ref={mapContainerRef} />;
};

export default MapComponent;

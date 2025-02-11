import { Dataset } from '@/app/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { GeoJSONFeature } from 'mapbox-gl';
import parse from 'wellknown';

export const defaultGeoJson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: [],
};

export const transformDatasets = (
    feature: GeoJSONFeature
): FeatureCollection<Geometry, Dataset> => {
    if (feature.properties && (feature.properties?.datasets ?? []).length > 0) {
        const features = feature.properties.datasets.map((dataset: any) => {
            const geometry = parse(dataset.wkt); // unnecessary
            return {
                type: 'Feature',
                geometry,
                properties: {
                    ...dataset,
                },
            };
        });

        return {
            type: 'FeatureCollection',
            features: features,
        };
    }

    return defaultGeoJson as FeatureCollection<Geometry, Dataset>;
};

export const extractLatLng = (wkt: string) => {
    const coordinates = wkt.replace('POINT (', '').replace(')', '');
    const [lng, lat] = coordinates.split(' ').map(Number);
    return { lat, lng };
};

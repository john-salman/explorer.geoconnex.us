import {
    MAINSTEM_DRAINAGE_MEDIUM,
    MAINSTEM_DRAINAGE_SMALL,
} from '@/app/features/MainMap/config';
import { Dataset } from '@/app/types';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { GeoJSONFeature } from 'mapbox-gl';

export const defaultGeoJson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: [],
};

export const transformDatasets = (
    feature: GeoJSONFeature
): FeatureCollection<Geometry, Dataset> => {
    if (feature.properties && (feature.properties?.datasets ?? []).length > 0) {
        const features = feature.properties.datasets.map((dataset: Dataset) => {
            const { lat, lng } = extractLatLng(dataset.wkt);
            if (!isNaN(lat) && !isNaN(lng)) {
                const geometry = { type: 'Point', coordinates: [lng, lat] };
                return {
                    type: 'Feature',
                    geometry,
                    properties: {
                        ...dataset,
                    },
                };
            } else {
                console.log('Error in dataset: ', dataset);
                console.log(
                    'Unable to extract lat lng from wkt: ',
                    dataset.wkt
                );
            }
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
    return { lat: lat || NaN, lng: lng || NaN };
};

export const getMainstemBuffer = (feature: GeoJSONFeature) => {
    if (feature.properties) {
        const drainageArea = feature.properties.outlet_drainagearea_sqkm;
        if (drainageArea < MAINSTEM_DRAINAGE_SMALL) {
            return 3;
        } else if (drainageArea < MAINSTEM_DRAINAGE_MEDIUM) {
            return 10;
        }
        // Large mainstem
        return 20;
    }
    return 0;
};

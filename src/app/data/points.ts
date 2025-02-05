import { FeatureCollection } from 'geojson';

export const points: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [102.0, 0.5],
            },
            properties: {
                name: 'Sample Point',
            },
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-74.005974, 40.712776],
            },
            properties: {
                name: 'New York City',
                description: 'The largest city in the United States.',
            },
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-118.243683, 34.052235],
            },
            properties: {
                name: 'Los Angeles',
                description:
                    'Known for its Mediterranean climate and the entertainment industry.',
            },
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-0.127758, 51.507351],
            },
            properties: {
                name: 'London',
                description: 'The capital of England and the United Kingdom.',
            },
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [139.691711, 35.689487],
            },
            properties: {
                name: 'Tokyo',
                description:
                    'The capital city of Japan and one of its 47 prefectures.',
            },
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [2.352222, 48.856613],
            },
            properties: {
                name: 'Paris',
                description: 'The capital and most populous city of France.',
            },
        },
    ],
};

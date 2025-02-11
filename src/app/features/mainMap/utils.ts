import {
    GeoJSONFeature,
    GeoJSONSource,
    LngLat,
    LngLatBoundsLike,
    Map,
    Popup,
} from 'mapbox-gl';
import { CLUSTER_TRANSITION_ZOOM, SourceId, SubLayerId } from './config';
import { Feature, LineString, Point } from 'geojson';
import * as turf from '@turf/turf';

export const calculateSpiderfiedPositionsConcentricCircle = (count: number) => {
    const leavesSeparation = 300; // Separation between points in each circle
    const baseOffset = [0, 0]; // Base offset
    const points = []; // Array to store positions
    const pointsPerCircle = 10; // Points per circle

    let circleIndex = 0;

    for (let i = 0; i < count; i += 1) {
        if (i % pointsPerCircle === 0 && i !== 0) {
            circleIndex += 1; // Move to the next circle after every 10 points
        }

        const radius = leavesSeparation * (circleIndex + 1); // Radius for the current circle
        const theta = (2 * Math.PI) / pointsPerCircle; // Angle between each point in the circle
        const angle = theta * (i % pointsPerCircle); // Current angle for the point

        const x = radius * Math.cos(angle) + baseOffset[0]; // X-coordinate of the point
        const y = radius * Math.sin(angle) + baseOffset[1]; // Y-coordinate of the point
        points.push([x, y]); // Add the point to the array
    }

    return points;
};

export const calculateSpiderfiedPositionsCircle = (count: number) => {
    const leavesSeparation = 350; // Separation between points
    const leavesOffset = [0, 0]; // Base offset
    const points = []; // Array to store positions
    const theta = (2 * Math.PI) / count; // Angle between each point
    let angle = theta;

    for (let i = 0; i < count; i += 1) {
        angle = theta * i; // Current angle for the point
        const x = leavesSeparation * Math.cos(angle) + leavesOffset[0]; // X-coordinate of the point
        const y = leavesSeparation * Math.sin(angle) + leavesOffset[1]; // Y-coordinate of the point
        points.push([x, y]); // Add the point to the array
    }
    return points;
};

export const calculateSpiderfiedPositions = (count: number) => {
    const legLengthStart = 100; // Initial leg length of the spiral
    const legLengthFactor = 100; // Factor for increasing the leg length
    const leavesSeparation = 500; // Separation between points
    const leavesOffset = [0, 0]; // Base offset
    const points = []; // Array to store positions
    let legLength = legLengthStart; // Current leg length
    let angle = 0; // Initial angle

    for (let i = 0; i < count; i += 1) {
        angle += leavesSeparation / legLength + i * 0.0005; // Increment the angle
        const x = legLength * Math.cos(angle) + leavesOffset[0]; // X-coordinate of the point
        const y = legLength * Math.sin(angle) + leavesOffset[1]; // Y-coordinate of the point
        points.push([x, y]); // Add the point to the array

        legLength += (Math.PI * 2 * legLengthFactor) / angle; // Increase the leg length
    }

    return points;
};

export const spiderfyClusters = async (
    map: Map,
    source: GeoJSONSource,
    features: GeoJSONFeature[]
) => {
    if (!map) return;
    const totalLeaves: GeoJSON.GeoJSON = {
        type: 'FeatureCollection',
        features: [],
    };

    const promises = features.map((feature) => {
        return new Promise((resolve, reject) => {
            if (!feature.properties) {
                return resolve(null);
            }
            const clusterId = feature.properties.cluster_id;
            const coordinates = (feature.geometry as Point).coordinates as [
                number,
                number
            ];
            const lngLat = {
                lng: coordinates[0],
                lat: coordinates[1],
            } as LngLat;

            source.getClusterLeaves(
                clusterId,
                Infinity,
                0,
                (error, features) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!features) return resolve(null);
                    if (features.length > 0) {
                        const spiderfiedPositions =
                            features.length > 25
                                ? calculateSpiderfiedPositionsConcentricCircle(
                                      features.length
                                  )
                                : features.length > 10
                                ? calculateSpiderfiedPositions(features.length)
                                : calculateSpiderfiedPositionsCircle(
                                      features.length
                                  );

                        const updatedFeatures = features.map(
                            (feature, index) => ({
                                ...feature,
                                properties: {
                                    ...feature.properties,
                                    iconOffset: spiderfiedPositions[index],
                                    isNotFiltered: 1,
                                },
                                geometry: {
                                    ...feature.geometry,
                                    type: 'Point',
                                    coordinates: [lngLat.lng, lngLat.lat],
                                },
                            })
                        );

                        return resolve(updatedFeatures);
                    }
                    resolve(null);
                }
            );
        });
    });

    try {
        const results = await Promise.all(promises);
        results.forEach((result) => {
            if (result) {
                totalLeaves.features = totalLeaves.features.concat(
                    result as Feature[]
                );
            }
        });

        const spiderfySource = map.getSource(
            SourceId.Spiderify
        ) as GeoJSONSource;
        spiderfySource.setData(totalLeaves);

        map.setPaintProperty(
            SubLayerId.AssociatedDataClusters,
            'circle-opacity',
            ['step', ['zoom'], 1, CLUSTER_TRANSITION_ZOOM, 0]
        );
        map.setPaintProperty(
            SubLayerId.AssociatedDataClusterCount,
            'text-opacity',
            ['step', ['zoom'], 1, CLUSTER_TRANSITION_ZOOM, 0]
        );
    } catch (error) {
        console.error('Error processing cluster leaves:', error);
    }
};

export const deletePointsSpiderfy = (map: Map) => {
    if (!map) return;
    const spiderfySource = map.getSource(SourceId.Spiderify) as GeoJSONSource;
    if (!spiderfySource) return;
    spiderfySource.setData({
        type: 'FeatureCollection',
        features: [],
    });
    map.setPaintProperty(
        SubLayerId.AssociatedDataClusters,
        'circle-opacity',
        1
    );
    map.setPaintProperty(
        SubLayerId.AssociatedDataClusterCount,
        'text-opacity',
        1
    );
};

// No longer in user
export const zoomToMainStem = (map: Map, id: number | null) => {
    if (!id) {
        return;
    }

    const features = map.queryRenderedFeatures({
        layers: [
            SubLayerId.MainstemsSmall,
            SubLayerId.MainstemsMedium,
            SubLayerId.MainstemsLarge,
        ],
        filter: ['==', 'id', String(id)],
    }) as Feature<LineString>[];

    if (features.length) {
        // Combine composite features
        const featureCollection = turf.featureCollection<LineString>([
            ...features,
        ]);
        const combined = turf.combine(featureCollection);
        const bbox = turf.bbox(combined) as LngLatBoundsLike;
        map.fitBounds(bbox);
    }
};

export const hasPeristentPopupOpenToThisItem = (
    popUp: Popup,
    itemId: string
) => {
    return popUp.isOpen() && popUp._content?.innerHTML.includes(itemId);
};

// export const zoomToHucBoundary = (map: Map) => {};

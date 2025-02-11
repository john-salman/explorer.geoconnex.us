import { GeoJSONSource, LngLat, LngLatBoundsLike, Map, Popup } from 'mapbox-gl';
import { CLUSTER_TRANSITION_ZOOM, SourceId, SubLayerId } from './config';
import { Feature, LineString } from 'geojson';
import * as turf from '@turf/turf';

export const calculateSpiderfiedPositionsCircle = (count: number) => {
    const leavesSeparation = 500; // Separation between points
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

export const spiderfyCluster = (
    map: Map,
    source: GeoJSONSource,
    clusterId: number,
    lngLat: LngLat
) => {
    if (!map) return;
    source.getClusterLeaves(clusterId, Infinity, 0, (error, features) => {
        if (error) return;
        if (!features) return;
        if (features.length > 0) {
            const spiderfiedPositions =
                features.length > 10
                    ? calculateSpiderfiedPositions(features.length)
                    : calculateSpiderfiedPositionsCircle(features.length);

            const geoJson: GeoJSON.GeoJSON = {
                type: 'FeatureCollection',
                features: features.map((feature, index) => ({
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
                })),
            };

            const spiderfySource = map.getSource(
                SourceId.Spiderify
            ) as GeoJSONSource;
            spiderfySource.setData(geoJson);

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
        }
    });
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

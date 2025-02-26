'use client';
import Map from '@/app/components/Map';
import React, { useEffect, useRef, useState } from 'react';
import {
    layerDefinitions,
    sourceConfigs,
    MAP_ID,
    SubLayerId,
    getLayerColor,
    LayerId,
    SourceId,
    BASEMAP,
    CLUSTER_TRANSITION_ZOOM,
    MAINSTEMS_SELECTED_COLOR,
    MAINSTEMS_SEARCH_COLOR,
} from '@/app/features/MainMap/config';
import { useMap } from '@/app/contexts/MapContexts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import {
    ExpressionSpecification,
    GeoJSONSource,
    LngLatBoundsLike,
    MapMouseEvent,
    NavigationControl,
    ScaleControl,
} from 'mapbox-gl';
import { extractLatLng } from '@/lib/state/utils';
import {
    fetchDatasets,
    setLayerVisibility,
    setSelectedData,
    setSelectedMainstemBBOX,
    setSelectedMainstemId,
} from '@/lib/state/main/slice';
import {
    hasPeristentPopupOpenToThisItem,
    spiderfyClusters,
    zoomToMainStem,
} from '@/app/features/MainMap/utils';
import * as turf from '@turf/turf';
import { Feature, FeatureCollection, Geometry, Point } from 'geojson';
import { Dataset } from '@/app/types';

const INITIAL_CENTER: [number, number] = [-98.5795, 39.8282];
const INITIAL_ZOOM = 4;

type Props = {
    accessToken: string;
};
export const MainMap: React.FC<Props> = (props) => {
    const { accessToken } = props;

    const { map, persistentPopup, hoverPopup } = useMap(MAP_ID);
    const dispatch: AppDispatch = useDispatch();

    const {
        searchResultIds,
        filteredDatasets,
        visibleLayers,
        hoverId,
        selectedMainstemId,
        selectedMainstemBBOX,
    } = useSelector((state: RootState) => state.main);

    const [reloadFlag, setReloadFlag] = useState(0);

    const previousClusterIds = useRef('');

    useEffect(() => {
        if (!map) {
            return;
        }
        const handleInitialZoom = () => {
            const zoom = map.getZoom();
            if (zoom >= 5) {
                dispatch(
                    setLayerVisibility({
                        [SubLayerId.MainstemsSmall]: true,
                        [SubLayerId.MainstemsMedium]: true,
                        [SubLayerId.MainstemsLarge]: true,
                        [LayerId.MajorRivers]: true,
                    })
                );

                // Remove this listener after
                map.off('zoom', handleInitialZoom);
            }
        };

        const createSpiderifiedClusters = () => {
            const zoom = map.getZoom();
            if (zoom >= CLUSTER_TRANSITION_ZOOM) {
                const features = map.queryRenderedFeatures({
                    layers: [SubLayerId.AssociatedDataClusters],
                });
                // Get unique ids
                const uniqueIds = new Set(
                    features.map((feature) => feature.properties!.cluster_id)
                );
                // Sort and convert to string
                const clusterIds = Array.from(uniqueIds).sort().join();
                // Check ids to prevent repeated spiderfy
                if (
                    features.length &&
                    clusterIds !== previousClusterIds.current
                ) {
                    previousClusterIds.current = clusterIds;
                    const source = map.getSource(
                        SourceId.AssociatedData
                    ) as GeoJSONSource;

                    spiderfyClusters(map, source, features);
                }
            }
        };

        map.on('zoom', handleInitialZoom);

        map.on('zoom', createSpiderifiedClusters);

        map.on('drag', createSpiderifiedClusters);

        map.loadImage('dot-marker.png', (error, image) => {
            if (error) throw error;
            if (!image) {
                throw new Error('Image not found: dot-marker.png');
            }
            map.addImage('observation-point', image);
        });

        map.on('error', function (e) {
            console.error('ERROR: ', e);
        });

        map.on(
            'click',
            [
                SubLayerId.MainstemsSmall,
                SubLayerId.MainstemsMedium,
                SubLayerId.MainstemsLarge,
            ],
            (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: [
                        SubLayerId.MainstemsSmall,
                        SubLayerId.MainstemsMedium,
                        SubLayerId.MainstemsLarge,
                    ],
                });

                if (features.length) {
                    const feature = features[0];
                    if (feature.properties) {
                        const id = feature.properties.id;
                        dispatch(fetchDatasets(id));
                        dispatch(setSelectedMainstemId(id));
                        zoomToMainStem(map, id);
                    }
                }
            }
        );

        // Allow the user to zoom into a boundary once from page load
        const HUC2BoundaryClickListener = (e: MapMouseEvent) => {
            const feature = map.queryRenderedFeatures(e.point, {
                layers: [SubLayerId.HUC2BoundaryFill],
            })?.[0];
            if (feature) {
                const bbox = turf.bbox(feature) as LngLatBoundsLike;
                map.fitBounds(bbox);
            }
        };

        map.once(
            'click',
            SubLayerId.HUC2BoundaryFill,
            HUC2BoundaryClickListener
        );

        // Temp hack to force Vector Tile layers to reload without breaking cache
        map.on('style.load', () => {
            setReloadFlag(Math.random());
            if (!map.hasImage('observation-point')) {
                map.loadImage('dot-marker.png', (error, image) => {
                    if (error) throw error;
                    if (!image) {
                        throw new Error('Image not found: dot-marker.png');
                    }
                    map.addImage('observation-point', image);
                });
            }
        });
    }, [map]);

    useEffect(() => {
        if (!map || !persistentPopup || !hoverPopup) {
            return;
        }

        map.on('click', LayerId.SpiderifyPoints, (e) => {
            const feature = e.features?.[0];
            if (feature && feature.properties) {
                if (persistentPopup.isOpen()) {
                    persistentPopup.remove();
                }
                hoverPopup.remove();
                const itemId = feature.properties.distributionURL;
                const latLng = extractLatLng(feature.properties.wkt);
                const html = `<span style="color: black;" data-observationId="${itemId}"> 
                <h6 style="font-weight:bold;">${
                    feature.properties.siteName
                }</h6>
                <div style="display:flex;"><strong>Type:</strong>&nbsp;<p>${
                    feature.properties.type
                }</p></div>
                <div style="display:flex;"><strong>Variable:</strong>&nbsp;<p>${
                    feature.properties.variableMeasured.split(' / ')?.[0]
                }</p></div>
                <div style="display:flex;"><strong>Unit:</strong>&nbsp;<p>${
                    feature.properties.variableUnit
                }</p></div>
                <div style="display:flex;"><strong>Latitude:</strong>&nbsp;<p>${
                    latLng.lat
                }</p></div>
                <div style="display:flex;"><strong>Longitude:</strong>&nbsp;<p>${
                    latLng.lng
                }</p></div>
                <a href="${
                    feature.properties.url
                }" target="_blank" style="margin:0 auto;">More Info</a>
              </span>`;
                persistentPopup.setLngLat(e.lngLat).setHTML(html).addTo(map);
                dispatch(setSelectedData(feature.properties as Dataset));
            }
        });

        // Copy of hover listener, ensure popup updates when in a tight cluster
        map.on('mousemove', LayerId.SpiderifyPoints, (e) => {
            map.getCanvas().style.cursor = 'pointer';
            const feature = e.features?.[0] as Feature<Point> | undefined;
            if (feature && feature.properties) {
                const itemId = feature.properties.distributionURL;
                if (!hasPeristentPopupOpenToThisItem(persistentPopup, itemId)) {
                    hoverPopup.remove();
                    const variableMeasured =
                        feature.properties.variableMeasured.split(' / ')[0];
                    const offset: [number, number] = JSON.parse(
                        feature.properties.iconOffset
                    );
                    const coordinates = feature.geometry.coordinates as [
                        number,
                        number
                    ];
                    const html = `<span style="color: black;"> 
                                            <h6 style="font-weight:bold;">${feature.properties.siteName}</h6>
                                            <div style="display:flex;"><strong>Type:</strong>&nbsp;<p>${variableMeasured} in ${feature.properties.variableUnit}</p></div>
                                          </span>`;

                    hoverPopup
                        .setLngLat(coordinates)
                        .setOffset(offset)
                        .setHTML(html)
                        .addTo(map);
                }
            }
        });
    }, [map]);

    useEffect(() => {
        if (!map) {
            return;
        }
        if (searchResultIds.length) {
            const opacityExpression: ExpressionSpecification = [
                'case',
                ['in', ['get', 'id'], ['literal', searchResultIds]],
                1,
                0.3, // Not In List
            ];
            map.setPaintProperty(
                SubLayerId.MainstemsSmall,
                'line-opacity',
                opacityExpression
            );
            map.setPaintProperty(
                SubLayerId.MainstemsMedium,
                'line-opacity',
                opacityExpression
            );
            map.setPaintProperty(
                SubLayerId.MainstemsLarge,
                'line-opacity',
                opacityExpression
            );
        } else {
            const opacityExpression: ExpressionSpecification = [
                'step',
                ['zoom'],
                0.1,
                7,
                0.8,
            ];
            map.setPaintProperty(
                SubLayerId.MainstemsSmall,
                'line-opacity',
                opacityExpression
            );
            map.setPaintProperty(
                SubLayerId.MainstemsMedium,
                'line-opacity',
                opacityExpression
            );
            map.setPaintProperty(
                SubLayerId.MainstemsLarge,
                'line-opacity',
                opacityExpression
            );
        }

        map.setPaintProperty(SubLayerId.MainstemsSmall, 'line-color', [
            'case',
            ['==', ['get', 'id'], String(hoverId)],
            MAINSTEMS_SELECTED_COLOR,
            ['==', ['get', 'id'], selectedMainstemId],
            MAINSTEMS_SELECTED_COLOR,
            ['in', ['get', 'id'], ['literal', searchResultIds]],
            MAINSTEMS_SEARCH_COLOR,
            getLayerColor(SubLayerId.MainstemsSmall), // Not In List
        ]);

        map.setPaintProperty(SubLayerId.MainstemsMedium, 'line-color', [
            'case',
            ['==', ['get', 'id'], String(hoverId)],
            MAINSTEMS_SELECTED_COLOR,
            ['==', ['get', 'id'], selectedMainstemId],
            MAINSTEMS_SELECTED_COLOR,
            ['in', ['get', 'id'], ['literal', searchResultIds]],
            MAINSTEMS_SEARCH_COLOR,
            getLayerColor(SubLayerId.MainstemsMedium), // Not In List
        ]);

        map.setPaintProperty(SubLayerId.MainstemsLarge, 'line-color', [
            'case',
            ['==', ['get', 'id'], String(hoverId)],
            MAINSTEMS_SELECTED_COLOR,
            ['==', ['get', 'id'], selectedMainstemId],
            MAINSTEMS_SELECTED_COLOR,
            ['in', ['get', 'id'], ['literal', searchResultIds]],
            MAINSTEMS_SEARCH_COLOR,
            getLayerColor(SubLayerId.MainstemsLarge), // Not In List
        ]);
    }, [searchResultIds, selectedMainstemId, hoverId]);

    useEffect(() => {
        if (!map || !filteredDatasets) {
            return;
        }

        const source = map.getSource(SourceId.AssociatedData) as GeoJSONSource;
        if (source) {
            source.setData(filteredDatasets);
            const spiderfySource = map.getSource(
                SourceId.Spiderify
            ) as GeoJSONSource;
            const spiderfySourceData =
                spiderfySource._data as FeatureCollection<Geometry, Dataset>;

            if (spiderfySourceData.features.length > 0) {
                let newData = JSON.parse(
                    JSON.stringify(spiderfySourceData)
                ) as FeatureCollection<Geometry, Dataset>;
                newData = {
                    type: 'FeatureCollection',
                    features: newData.features.map((feature) => {
                        return {
                            ...feature,
                            properties: {
                                ...feature.properties,
                                isNotFiltered: filteredDatasets.features.some(
                                    (dataSetFeature) =>
                                        dataSetFeature.properties.url ===
                                        feature.properties.url
                                )
                                    ? 1
                                    : 0.1,
                            },
                        };
                    }),
                };

                spiderfySource.setData(newData);
            }
        }
    }, [filteredDatasets]);

    useEffect(() => {
        if (!map) {
            return;
        }

        if (selectedMainstemBBOX) {
            map.fitBounds(selectedMainstemBBOX);
            dispatch(setSelectedMainstemBBOX(null));
        }
    }, [selectedMainstemBBOX]);

    useEffect(() => {
        if (!map) {
            return;
        }

        Object.entries(visibleLayers).forEach(([layerId, visible]) => {
            if (map.getLayer(layerId)) {
                const newVisibility = visible ? 'visible' : 'none';

                map?.setLayoutProperty(layerId, 'visibility', newVisibility);
            }
        });
    }, [reloadFlag, visibleLayers]);

    return (
        <>
            <Map
                accessToken={accessToken}
                id={MAP_ID}
                sources={sourceConfigs}
                layers={layerDefinitions}
                options={{
                    style: BASEMAP,
                    center: INITIAL_CENTER,
                    zoom: INITIAL_ZOOM,
                    maxZoom: 15,
                }}
                controls={{
                    scaleControl: true,
                    navigationControl: true,
                }}
            />
        </>
    );
};

export default MainMap;

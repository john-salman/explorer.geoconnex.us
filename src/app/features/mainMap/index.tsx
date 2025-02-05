'use client';
import Map from '@/app/components/map/Map';
import React, { useEffect, useRef } from 'react';
import {
    layerDefinitions,
    sourceConfigs,
    MAP_ID,
    SubLayerId,
    getLayerColor,
    LayerId,
    SourceId,
} from './config';
import { useMap } from '@/app/contexts/MapContexts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import { Feature, FeatureCollection, LineString } from 'geojson';
import { ExpressionSpecification, GeoJSONSource, TargetFeature, Map as MapType, LngLatBoundsLike } from 'mapbox-gl';
import * as turf from '@turf/turf';
import { defaultGeoJson, extractLatLng } from '@/lib/state/utils';
import { fetchDatasets, setLayerVisibility, setSelectedData, setSelectedMainstemId } from '@/lib/state/main/slice';

const INITIAL_CENTER: [number, number] = [-121.7139, 45.5586];
const INITIAL_ZOOM = 6;

type Props = {
    accessToken: string;
};
export const MainMap: React.FC<Props> = (props) => {
    const { accessToken } = props;

    const { map, persistentPopup } = useMap(MAP_ID);
    const dispatch: AppDispatch = useDispatch();

    const {
        searchResultIds,
        filteredDatasets,
        selectedMainstemId,
        visibleLayers,
        hoverId,
    } = useSelector((state: RootState) => state.main);

    console.log('map', map?.getLayer(SubLayerId.AssociatedDataUnclustered),map?.getLayer(SubLayerId.AssociatedDataClusters), map?.getLayer(SubLayerId.AssociatedDataClusterCount))
    useEffect(() => {
        if (!map || !persistentPopup) {
            return;
        }
            map.on('click', SubLayerId.AssociatedDataUnclustered, (e) => {
                const feature = e.features?.[0];
                if (feature && feature.properties) {
                    const latLng = extractLatLng(feature.properties.wkt);
                    const html = `<span style="color: black;"> 
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
                    persistentPopup
                        .setLngLat(e.lngLat)
                        .setHTML(html)
                        .addTo(map);
                    dispatch(setSelectedData(feature.properties));
                }
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
    }, [map]);


    useEffect(() => {

        if (
            !map
        ) {
            return;
        }

        const opacityExpression: ExpressionSpecification = [
            'case',
            ['in', ['get', 'id'], ['literal', searchResultIds]],
            1,
            0.3, // Not In List
        ];

        map.setPaintProperty(SubLayerId.MainstemsSmall, 'line-color', [
            'case',
            ['==', ['get', 'id'], hoverId],
            '#04BBDE',
            ['in', ['get', 'id'], ['literal', searchResultIds]],
            '#FAC60F',
            getLayerColor(SubLayerId.MainstemsSmall), // Not In List
        ]);
        map.setPaintProperty(
            SubLayerId.MainstemsSmall,
            'line-opacity',
            opacityExpression
        );
        map.setPaintProperty(SubLayerId.MainstemsMedium, 'line-color', [
            'case',
            ['==', ['get', 'id'], hoverId],
            '#04BBDE',
            ['in', ['get', 'id'], ['literal', searchResultIds]],
            '#FAC60F',
            getLayerColor(SubLayerId.MainstemsMedium), // Not In List
        ]);
        map.setPaintProperty(
            SubLayerId.MainstemsMedium,
            'line-opacity',
            opacityExpression
        );
        map.setPaintProperty(SubLayerId.MainstemsLarge, 'line-color', [
            'case',
            ['==', ['get', 'id'], hoverId],
            '#04BBDE',
            ['in', ['get', 'id'], ['literal', searchResultIds]],
            '#FAC60F',
            getLayerColor(SubLayerId.MainstemsLarge), // Not In List
        ]);
        map.setPaintProperty(
            SubLayerId.MainstemsLarge,
            'line-opacity',
            opacityExpression
        );
    }, [searchResultIds, hoverId]);

    useEffect(() => {
        if (
            !map || !filteredDatasets
        ) {
            return;
        }
        
        const source = map.getSource(SourceId.AssociatedData) as GeoJSONSource;
        if (source) {
            source.setData(
                filteredDatasets
            );
        }
    }, [filteredDatasets]);

    useEffect(() => {
        if (!map) {
            return;
        }

        if (selectedMainstemId) {
            zoomToMainStem(map, selectedMainstemId);
        }
    }, [selectedMainstemId]);

    useEffect(() => {
        if (
            !map 
        ) {
            return;
        }

        // previousVisibility.current = visibleLayers;

        Object.entries(visibleLayers).forEach(([layerId, visible]) => {
            const currentVisibility = map?.getLayoutProperty(
                layerId,
                'visibility'
            );
            const newVisibility = visible ? 'visible' : 'none';
            if (newVisibility !== currentVisibility) {
                map?.setLayoutProperty(layerId, 'visibility', newVisibility);
            }
        });
    }, [visibleLayers]);

    // TODO: resolve zoom errors
    const zoomToMainStem = (map: MapType, id: number | null) => {
        if (!id) {
            return;
        }
        console.log('id', id, typeof id)

        const features = map.queryRenderedFeatures({
            layers: [
                SubLayerId.MainstemsSmall,
                SubLayerId.MainstemsMedium,
                SubLayerId.MainstemsLarge,
            ],
            filter: ['==', 'id', String(id)],
        }) as Feature<LineString>[];

        // Combine composite features
        const featureCollection = turf.featureCollection<LineString>([...features]);
        const combined = turf.combine(featureCollection);
        const bbox = turf.bbox(combined) as LngLatBoundsLike;

        map.fitBounds(bbox);
    };

    return (
        <>
        <button  style={{position: 'absolute'}} onClick={() => dispatch(setLayerVisibility({ [LayerId.MajorRivers]: false }))}></button>
        <Map
            accessToken={accessToken}
            id={MAP_ID}
            sources={sourceConfigs}
            layers={layerDefinitions}
            options={{
                style: 'mapbox://styles/mapbox/dark-v11',
                center: INITIAL_CENTER,
                zoom: INITIAL_ZOOM,
            }}
        />
        </>
    );
};

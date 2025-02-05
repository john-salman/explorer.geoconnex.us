import {
    CustomListenerFunction,
    MainLayerDefinition,
    SourceConfig,
    Sources,
} from '@/app/components/map/types';
import { Point } from 'geojson';
import {
    DataDrivenPropertyValueSpecification,
    GeoJSONSource,
    LayerSpecification,
    LngLatLike,
    Map,
    Popup,
} from 'mapbox-gl';
import { defaultGeoJson } from '@/lib/state/utils';
import { majorRivers } from '@/app/data/majorRivers';

export const MAP_ID = 'main';

export enum SourceId {
    Mainstems = 'mainstems',
    MajorRivers = 'major-rivers-source',
    HUC2Boundaries = 'huc-2-boundaries-source',
    AssociatedData = 'associated-data-source',
}

export enum LayerId {
    Mainstems = 'mainstems-layer',
    HUC2Boundaries = 'huc-2-boundaries',
    MajorRivers = 'major-rivers',
    AssociatedData = 'associated-data',
}

export enum SubLayerId {
    MainstemsSmall = 'mainstems-small',
    MainstemsMedium = 'mainstems-medium',
    MainstemsLarge = 'mainstems-large',
    HUC2BoundaryLabels = 'huc-2-boundaries-labels',
    AssociatedDataClusters = 'associated-data-clusters',
    AssociatedDataClusterCount = 'associated-data-cluster-count',
    AssociatedDataUnclustered = 'associated-data-unclustered-point',
}

/**********************************************************************
 * Define the various datasources this map will use
 **********************************************************************/
export const sourceConfigs: SourceConfig[] = [
    {
        id: SourceId.Mainstems,
        type: Sources.VectorTile,
        definition: {
            type: 'vector',
            tiles: [
                'https://reference.geoconnex.us/collections/mainstems/tiles/WebMercatorQuad/{z}/{x}/{y}?f=mvt',
            ],
            minzoom: 0,
            maxzoom: 13,
            tileSize: 512,
        },
    },
    {
        id: SourceId.MajorRivers,
        type: Sources.GeoJSON,
        definition: {
            type: 'geojson',
            data: majorRivers,
        },
    },
    {
        id: SourceId.AssociatedData,
        type: Sources.GeoJSON,
        definition: {
            type: 'geojson',
            data: defaultGeoJson,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50,
        },
    },
    {
        id: SourceId.HUC2Boundaries,
        type: Sources.ESRI,
        definition: {
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/Watershed_Boundary_Dataset_HUC_2s/FeatureServer/0',
            simplifyFactor: 1,
        },
    },
];

/**********************************************************************
 * Create helper functions to group layer logic
 **********************************************************************/

export const getLayerName = (layerId: LayerId | SubLayerId): string => {
    switch (layerId) {
        case LayerId.Mainstems:
            return 'Mainstems'; // TODO determine if names are accurate
        case SubLayerId.MainstemsSmall:
            return 'Small'; // TODO determine if names are accurate
        case SubLayerId.MainstemsMedium:
            return 'Medium'; // TODO determine if names are accurate
        case SubLayerId.MainstemsLarge:
            return 'Large'; // TODO determine if names are accurate
        case LayerId.MajorRivers:
            return 'Major Rivers'; // TODO determine if names are accurate
        case LayerId.HUC2Boundaries:
            return 'HUC2 Boundaries'; // TODO determine if names are accurate
        case SubLayerId.HUC2BoundaryLabels:
            return 'Labels'; // TODO determine if names are accurate
        case LayerId.AssociatedData:
            return 'Associated Data'; // TODO determine if names are accurate
        default:
            return '';
    }
};

// Define the palette in a shared location
export const getLayerColor = (
    id: LayerId | SubLayerId
): DataDrivenPropertyValueSpecification<string> => {
    switch (id) {
        case LayerId.Mainstems:
            return '#7A9939';
        case SubLayerId.MainstemsSmall:
            return '#31575E';
        case SubLayerId.MainstemsMedium:
            return '#898030';
        case SubLayerId.MainstemsLarge:
            return '#DE0462';
        case LayerId.MajorRivers:
            return '#7A9939';
        case LayerId.HUC2Boundaries:
            return 'green';
        case SubLayerId.HUC2BoundaryLabels:
            return 'green';
        case LayerId.AssociatedData:
            return ''; // Special case, no parent layer def
        case SubLayerId.AssociatedDataClusters:
            return [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                5,
                '#f1f075',
                10,
                '#f28cb1',
            ];
        case SubLayerId.AssociatedDataClusterCount:
            return '#000';
        case SubLayerId.AssociatedDataUnclustered:
            return '#11b4da';
    }
};

// Group layer and sublayer configurations together
export const getLayerConfig = (
    id: LayerId | SubLayerId
): null | LayerSpecification => {
    switch (id) {
        case LayerId.Mainstems:
            return null;
        case SubLayerId.MainstemsSmall:
            return {
                id: SubLayerId.MainstemsSmall, // Layer ID
                type: 'line',
                source: SourceId.Mainstems,
                "source-layer": SourceId.Mainstems,
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    'visibility': 'visible',
                },
                filter: ['<', ['get', 'outlet_drainagearea_sqkm'], 160],
                paint: {
                    'line-opacity': [
                        'step',
                        ['zoom'],
                        0.3, // If lower than 7
                        7,
                        0.8, // Default to 0.1
                    ],
                    'line-color': getLayerColor(SubLayerId.MainstemsSmall),
                    'line-width': 4,
                },
            };
        case SubLayerId.MainstemsMedium:
            return {
                id: SubLayerId.MainstemsMedium, // Layer ID
                type: 'line',
                source: SourceId.Mainstems,
                "source-layer": SourceId.Mainstems,
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                filter: [
                    'all',
                    ['>=', ['get', 'outlet_drainagearea_sqkm'], 160],
                    ['<', ['get', 'outlet_drainagearea_sqkm'], 1600],
                ],
                paint: {
                    'line-opacity': [
                        'step',
                        ['zoom'],
                        0.3, // If lower than 7
                        7,
                        0.8, // Default to 0.1
                    ],
                    'line-color': getLayerColor(SubLayerId.MainstemsMedium),
                    'line-width': 4,
                },
            };
        case SubLayerId.MainstemsLarge:
            return {
                id: SubLayerId.MainstemsLarge, // Layer ID
                type: 'line',
                source: SourceId.Mainstems,
                "source-layer": SourceId.Mainstems,
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                filter: ['>', ['get', 'outlet_drainagearea_sqkm'], 1600],
                paint: {
                    'line-opacity': [
                        'step',
                        ['zoom'],
                        0.3, // If lower than 7
                        7,
                        0.8, // Default to 0.1
                    ],
                    'line-color': getLayerColor(SubLayerId.MainstemsLarge),
                    'line-width': 4,
                },
            };
        case LayerId.MajorRivers:
            return {
                id: LayerId.MajorRivers, // Layer ID
                type: 'line',
                source: SourceId.MajorRivers,

                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': [
                        'step',
                        ['zoom'],
                        0.8, // If lower than 7
                        7,
                        0.1, // Default to 0.1
                    ],
                    'line-color': getLayerColor(LayerId.MajorRivers),
                    'line-width': 4,
                },
            };
        case LayerId.HUC2Boundaries:
            return {
                id: LayerId.HUC2Boundaries, // Layer ID
                type: 'line',
                source: SourceId.HUC2Boundaries,
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': [
                        'step',
                        ['zoom'],
                        0.8, // If lower than 7
                        7,
                        0.1, // Default to 0.1
                    ],
                    'line-color': 'green',
                    'line-width': 2,
                },
            };
        case SubLayerId.HUC2BoundaryLabels:
            return {
                id: SubLayerId.HUC2BoundaryLabels,
                type: 'symbol',
                source: SourceId.HUC2Boundaries,
                layout: {
                    'text-field': ['get', 'NAME'],
                    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                    'text-radial-offset': 0.25,
                    'text-size': 16,
                    'text-justify': 'auto',
                },
                paint: {
                    'text-color': getLayerColor(SubLayerId.HUC2BoundaryLabels),
                    'text-opacity': ['step', ['zoom'], 1, 6, 0],
                },
            };
        case LayerId.AssociatedData:
            return null; // Special case, no parent layer def
        case SubLayerId.AssociatedDataClusters:
            return {
                id: SubLayerId.AssociatedDataClusters,
                type: 'circle',
                source: SourceId.AssociatedData,
                filter: ['has', 'point_count'],
                paint: {
                    // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
                    // with three steps to implement three types of circles:
                    //   * Blue, 20px circles when point count is less than 5
                    //   * Yellow, 30px circles when point count is between 5 and 10
                    //   * Pink, 40px circles when point count is greater than or equal to 10
                    'circle-color': getLayerColor(
                        SubLayerId.AssociatedDataClusters
                    ),
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        5,
                        30,
                        10,
                        40,
                    ],
                },
            };
        case SubLayerId.AssociatedDataClusterCount:
            return {
                id: SubLayerId.AssociatedDataClusterCount,
                type: 'symbol',
                source: SourceId.AssociatedData,
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': ['get', 'point_count_abbreviated'],
                    'text-font': [
                        'DIN Offc Pro Medium',
                        'Arial Unicode MS Bold',
                    ],
                    'text-size': 12,
                },
                paint: {
                    'text-color': getLayerColor(
                        SubLayerId.AssociatedDataClusterCount
                    ),
                },
            };
        case SubLayerId.AssociatedDataUnclustered:
            return {
                id: SubLayerId.AssociatedDataUnclustered,
                type: 'circle',
                source: SourceId.AssociatedData,
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': getLayerColor(
                        SubLayerId.AssociatedDataUnclustered
                    ),
                    'circle-radius': 4,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff',
                },
            };
    }
};

// Define and hover functions with curry-ed map and popup objects
export const getLayerHoverFunction = (
    id: LayerId | SubLayerId
): CustomListenerFunction => {
    return (map: Map, hoverPopup: Popup, persistentPopup: Popup) => {
        switch (id) {
            case SubLayerId.MainstemsSmall:
                return (e) => {
                    map.getCanvas().style.cursor = 'pointer';

                    const feature = e.features?.[0];
                    if (feature && feature.properties) {

                        const html = `<strong style="color:black;">${feature.properties.name_at_outlet}</strong>`;
                        hoverPopup
                            .setLngLat(e.lngLat)
                            .setHTML(html)
                            .addTo(map);
                    }
                };
            case SubLayerId.MainstemsMedium:
                return (e) => {
                    map.getCanvas().style.cursor = 'pointer';

                    const feature = e.features?.[0];
                    if (feature && feature.properties) {
                        const html = `<strong style="color:black;">${feature.properties.name_at_outlet}</strong>`;

                        hoverPopup
                            .setLngLat(e.lngLat)
                            .setHTML(html)
                            .addTo(map);
                    }
                };
            case SubLayerId.MainstemsLarge:
                return (e) => {
                    map.getCanvas().style.cursor = 'pointer';

                    const feature = e.features?.[0];
                    if (feature && feature.properties) {
                        const html = `<strong style="color:black;">${feature.properties.name_at_outlet}</strong>`;

                        hoverPopup
                            .setLngLat(e.lngLat)
                            .setHTML(html)
                            .addTo(map);
                    }
                };
            case SubLayerId.AssociatedDataUnclustered:
                return (e) => {
                    console.log('EEEE', e)
                    map.getCanvas().style.cursor = 'pointer';

                    const feature = e.features?.[0];
                    if (feature && feature.properties) {
                        const coordinates = (feature.geometry as Point)
                            .coordinates;
                        const html = `<span style="color: black;"> 
                            <h6 style="font-weight:bold;">${feature.properties.siteName}</h6>
                            <div style="display:flex;"><strong>Type:</strong>&nbsp;<p>${feature.properties.type}</p></div>
                          </span>`;
                        hoverPopup
                            .setLngLat(coordinates as LngLatLike)
                            .setHTML(html)
                            .addTo(map);
                    }
                };
            default:
                return (e) => {
                    console.log('Hover Event Triggered: ', e);
                    console.log('The map: ', map);
                    console.log('Available Popups: ');
                    console.log('Hover: ', hoverPopup);
                    console.log('Persistent: ', persistentPopup);

                    map.getCanvas().style.cursor = 'pointer';
                };
        }
    };
};

// Click handlers
export const getLayerClickFunction = (
    id: LayerId | SubLayerId
): CustomListenerFunction => {
    return (map: Map, hoverPopup: Popup, persistentPopup: Popup) => {
        switch (id) {
            case SubLayerId.AssociatedDataClusters:
                return (e) => {
                    const features = map.queryRenderedFeatures(e.point, {
                        layers: [SubLayerId.AssociatedDataClusters],
                    });
                    console.log('e', e, features)
                    const feature = features?.[0];
                    if (feature && feature.properties) {
                        const clusterId = feature.properties.cluster_id;
                        (
                            map.getSource(
                                SourceId.AssociatedData
                            ) as GeoJSONSource
                        )?.getClusterExpansionZoom(clusterId, (err, zoom) => {
                            if (err) return;
                            // TODO: clean this up
                            const coordinates = (feature.geometry as Point)
                                .coordinates as LngLatLike;
                            if (zoom) {
                                map.easeTo({
                                    center: coordinates,
                                    zoom: zoom,
                                });
                            }
                        });
                    }
                };
            default:
                return (e) => {
                    console.log('Click Event Triggered: ', e);
                    console.log('The map: ', map);
                    console.log('Available Popups: ');
                    console.log('Hover: ', hoverPopup);
                    console.log('Persistent: ', persistentPopup);
                };
        }
    };
};

// Use this as the master object to define layer hierarchies. Sublayers are nested layer definitions,
// meaning they have their own click and hover listeners
export const layerDefinitions: MainLayerDefinition[] = [
    {
        id: LayerId.Mainstems,
        controllable: true,
        config: getLayerConfig(LayerId.Mainstems),
        subLayers: [
            {
                id: SubLayerId.MainstemsSmall,
                controllable: true,
                config: getLayerConfig(SubLayerId.MainstemsSmall),
                hoverFunction: getLayerHoverFunction(SubLayerId.MainstemsSmall),
            },
            {
                id: SubLayerId.MainstemsMedium,
                controllable: true,
                config: getLayerConfig(SubLayerId.MainstemsMedium),
                hoverFunction: getLayerHoverFunction(
                    SubLayerId.MainstemsMedium
                ),
            },
            {
                id: SubLayerId.MainstemsLarge,
                controllable: true,
                config: getLayerConfig(SubLayerId.MainstemsLarge),
                hoverFunction: getLayerHoverFunction(SubLayerId.MainstemsLarge),
            },
        ],
    },
    {
        id: LayerId.HUC2Boundaries,
        controllable: true,
        config: getLayerConfig(LayerId.HUC2Boundaries),
        subLayers: [
            {
                id: SubLayerId.HUC2BoundaryLabels,
                controllable: true,
                config: getLayerConfig(SubLayerId.HUC2BoundaryLabels),
            },
        ],
    },
    {
        id: LayerId.MajorRivers,
        controllable: true,
        config: getLayerConfig(LayerId.MajorRivers),
    },
    {
        id: LayerId.AssociatedData,
        controllable: false,
        config: getLayerConfig(LayerId.AssociatedData),
        subLayers: [
            {
                id: SubLayerId.AssociatedDataClusters,
                controllable: false,
                config: getLayerConfig(SubLayerId.AssociatedDataClusters),
                clickFunction: getLayerClickFunction(
                    SubLayerId.AssociatedDataClusters
                ),
            },
            {
                id: SubLayerId.AssociatedDataClusterCount,
                controllable: false,
                config: getLayerConfig(SubLayerId.AssociatedDataClusterCount),
            },
            {
                id: SubLayerId.AssociatedDataUnclustered,
                controllable: false,
                config: getLayerConfig(SubLayerId.AssociatedDataUnclustered),
                hoverFunction: getLayerHoverFunction(
                    SubLayerId.AssociatedDataUnclustered
                ),
            },
        ],
    },
    // {
    //     id: LayerId.Points,
    //     controllable: true,
    //     config: getLayerConfig(LayerId.Points),
    //     hoverFunction: getLayerHoverFunction(LayerId.Points),
    //     clickFunction: getLayerClickFunction(LayerId.Points),
    //     subLayers: [
    //         {
    //             id: SubLayerId.PointsSmall,
    //             controllable: true,
    //             config: getLayerConfig(SubLayerId.PointsSmall),
    //         },
    //     ],
    // },
];

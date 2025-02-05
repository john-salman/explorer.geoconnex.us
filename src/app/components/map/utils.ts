import { Map, SourceSpecification, Popup } from 'mapbox-gl';
import { MainLayerDefinition, SourceConfig, Sources } from './types';
import FeatureService, {
    FeatureServiceOptions,
} from '@hansdo/mapbox-gl-arcgis-featureserver';

export const addSources = (map: Map, sourceConfigs: SourceConfig[]) => {
    sourceConfigs.forEach((sourceConfig) => {
        switch (sourceConfig.type) {
            case Sources.ESRI:
                new FeatureService(
                    sourceConfig.id,
                    map,
                    sourceConfig.definition as FeatureServiceOptions
                );
                break;

            case Sources.GeoJSON:
            case Sources.VectorTile:
            default:
                map.addSource(
                    sourceConfig.id,
                    sourceConfig.definition as SourceSpecification
                );
                break;
        }
    });
};

export const addLayers = (
    map: Map,
    layerDefinitions: MainLayerDefinition[]
) => {
    layerDefinitions.forEach((layer) => {
        if (layer.config) {
            map.addLayer(layer.config);
        }
        if ((layer?.subLayers ?? []).length > 0) {
            layer.subLayers!.forEach((subLayer) => {
                if (subLayer.config) {
                    map.addLayer(subLayer.config);
                }
            });
        }
    });
};

export const addHoverFunctions = (
    map: Map,
    layerDefinitions: MainLayerDefinition[],
    hoverPopup: Popup,
    persistentPopup: Popup
) => {
    layerDefinitions.forEach((layer) => {
        if (layer.hoverFunction) {
            map.on(
                'mouseenter',
                layer.id,
                layer.hoverFunction(map, hoverPopup, persistentPopup)
            );
            if (layer.customHoverExitFunction) {
                map.on(
                    'mouseleave',
                    layer.id,
                    layer.customHoverExitFunction(
                        map,
                        hoverPopup,
                        persistentPopup
                    )
                );
            } else {
                map.on('mouseleave', layer.id, () => {
                    map.getCanvas().style.cursor = '';
                    hoverPopup.remove();
                });
            }
        }
        if ((layer?.subLayers ?? []).length > 0) {
            layer.subLayers!.forEach((subLayer) => {
                if (subLayer.hoverFunction) {
                    map.on(
                        'mouseenter',
                        subLayer.id,
                        subLayer.hoverFunction(map, hoverPopup, persistentPopup)
                    );
                    if (subLayer.customHoverExitFunction) {
                        map.on(
                            'mouseleave',
                            subLayer.id,
                            subLayer.customHoverExitFunction(
                                map,
                                hoverPopup,
                                persistentPopup
                            )
                        );
                    } else {
                        map.on('mouseleave', subLayer.id, () => {
                            map.getCanvas().style.cursor = '';
                            hoverPopup.remove();
                        });
                    }
                }
            });
        }
    });
};

export const addClickFunctions = (
    map: Map,
    layerDefinitions: MainLayerDefinition[],
    hoverPopup: Popup,
    persistentPopup: Popup
) => {
    layerDefinitions.forEach((layer) => {
        if (layer.clickFunction) {
            map.on(
                'click',
                layer.id,
                layer.clickFunction(map, hoverPopup, persistentPopup)
            );
        }
        if ((layer?.subLayers ?? []).length > 0) {
            layer.subLayers!.forEach((subLayer) => {
                if (subLayer.clickFunction) {
                    map.on(
                        'click',
                        subLayer.id,
                        subLayer.clickFunction(map, hoverPopup, persistentPopup)
                    );
                }
            });
        }
    });
};

// I dont think an approach like this will be necessary
// export const addGeoJSONSource = (source: SourceDefinition) => {
//     return source as GeoJSONSource;
// };
// export const addVectorSource = (source: SourceDefinition) => {
//     return source as VectorSource;
// };
// export const addRasterSource = (source: SourceDefinition) => {
//     return source as RasterSource<'raster'>;
// };
// export const addImageSource = (source: SourceDefinition) => {
//     return source as ImageSource;
// };
// export const addVideoSource = (source: SourceDefinition) => {
//     return source as VideoSource;
// };

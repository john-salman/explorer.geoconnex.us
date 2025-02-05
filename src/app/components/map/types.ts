import { FeatureServiceOptions } from '@hansdo/mapbox-gl-arcgis-featureserver';
import {
    GeoJSONSource,
    VectorTileSource as VectorSource,
    RasterTileSource as RasterSource,
    ImageSource,
    VideoSource,
    SourceSpecification,
    LayerSpecification,
    MapOptions,
    MapMouseEvent,
    Map,
    Popup,
} from 'mapbox-gl';

export type SourceDefinition =
    | GeoJSONSource
    | VectorSource
    | RasterSource<'raster'>
    | ImageSource
    | VideoSource;
    

export enum Sources {
    GeoJSON = 'geojson',
    VectorTile = 'vector-tile',
    ESRI = 'esri',
}

export type SourceConfig = {
    id: string;
    type: Sources;
    definition: SourceSpecification | FeatureServiceOptions;
};

export type CustomListenerFunction = (
    map: Map,
    hoverPopup: Popup,
    persistentPopup: Popup
) => (e: MapMouseEvent) => void;

export type LayerDefinition = {
    id: string;
    controllable: boolean;
    config: LayerSpecification | null;
    hoverFunction?: CustomListenerFunction;
    customHoverExitFunction?: CustomListenerFunction;
    clickFunction?: CustomListenerFunction;
};

export type MainLayerDefinition = LayerDefinition & {
    subLayers?: LayerDefinition[];
};

export interface MapComponentProps {
    accessToken: string;
    id: string;
    sources: SourceConfig[];
    layers: MainLayerDefinition[];
    options: Omit<MapOptions, 'container'>;
}

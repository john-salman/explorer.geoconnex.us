import Circle from '@/app/assets/icons/Circle';
import Line from '@/app/assets/icons/Line';
import Square from '@/app/assets/icons/Square';
import {
    LayerDefinition,
    LayerType,
    MainLayerDefinition,
} from '@/app/components/Map/types';
import { LayerSpecification } from 'mapbox-gl';
import { useCallback } from 'react';

type Props = {
    getLayerName: (id: string) => string;
    getLayerColor: (id: string) => string;
    getLayerConfig: (id: string) => null | LayerSpecification;
    visibleLayers: { [key in string]: boolean };
    layerDefinitions: MainLayerDefinition[];
};

export const Legend: React.FC<Props> = (props) => {
    const {
        visibleLayers,
        layerDefinitions,
        getLayerName,
        getLayerColor,
        getLayerConfig,
    } = props;

    const renderSubLayers = (layer: MainLayerDefinition) => {
        return layer.subLayers
            ?.filter(
                (sublayer) => sublayer.legend && visibleLayers[sublayer.id]
            )
            .map((sublayer) => {
                const type = getLayerConfig(sublayer.id)?.type ?? 'none';
                const color = getLayerColor(sublayer.id);

                return (
                    <div
                        key={`legend-entry-${layer.id}-${sublayer.id}`}
                        className="ml-4 p-1 flex items-center w-[7vw]"
                    >
                        {color && typeof color === 'string' && (
                            <div className="mr-1">
                                {type === LayerType.Line && (
                                    <Line
                                        key={`legend-entry-${layer.id}-${sublayer.id}-color`}
                                        color={color}
                                    />
                                )}
                                {type === LayerType.Circle && (
                                    <Circle
                                        key={`legend-entry-${layer.id}-${sublayer.id}-color`}
                                        color={color}
                                    />
                                )}
                                {type === LayerType.Fill && (
                                    <Square
                                        key={`legend-entry-${layer.id}-${sublayer.id}-color`}
                                        color={color}
                                    />
                                )}
                                {type === LayerType.Symbol && (
                                    // TODO: Handle symbol type
                                    <div className="symbol-placeholder"></div>
                                )}
                            </div>
                        )}
                        {getLayerName(sublayer.id)}
                    </div>
                );
            });
    };

    const renderLayers = (layers: MainLayerDefinition[]) => {
        return layers
            .filter((layer) => layer.legend && visibleLayers[layer.id])
            .map((layer) => {
                const type = getLayerConfig(layer.id)?.type ?? 'none';
                const color = getLayerColor(layer.id);

                return (
                    <div
                        key={`legend-entry-${layer.id}`}
                        className="p-1 text-black"
                    >
                        <div className="flex items-center w-[10vw]">
                            {color && typeof color === 'string' && (
                                <div className="mr-1">
                                    {type === LayerType.Line && (
                                        <Line
                                            key={`legend-entry-${layer.id}-color`}
                                            color={color}
                                        />
                                    )}
                                    {type === LayerType.Circle && (
                                        <Circle
                                            key={`legend-entry-${layer.id}-color`}
                                            color={color}
                                        />
                                    )}
                                    {type === LayerType.Fill && (
                                        <Square
                                            key={`legend-entry-${layer.id}-color`}
                                            color={color}
                                        />
                                    )}
                                    {type === LayerType.Symbol && (
                                        // TODO: Handle symbol type
                                        <div className="symbol-placeholder"></div>
                                    )}
                                </div>
                            )}
                            {getLayerName(layer.id)}
                        </div>
                        {layer.subLayers && renderSubLayers(layer)}
                    </div>
                );
            });
    };

    const renderLegend = useCallback(() => {
        return renderLayers(layerDefinitions);
    }, [layerDefinitions, visibleLayers]);

    return <>{renderLegend()}</>;
};

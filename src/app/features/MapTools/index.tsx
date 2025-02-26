import Card from '@/app/components/common/Card';
import { Toggles } from '@/app/components/Map/tools/Toggles';
import { setLayerVisibility } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    LayerId,
    layerDefinitions,
    getLayerColor,
    getLayerName,
    getLayerConfig,
    SubLayerId,
} from '@/app/features/MainMap/config';
import IconButton from '@/app/components/common/IconButton';
import MapIcon from '@/app/assets/icons/MapIcon';
import { Legend } from '@/app/components/Map/tools/Legend';
import { LayerSpecification } from 'mapbox-gl';
import { LayerIcon } from '@/app/assets/icons/LayerIcon';
import { ControlsIcon } from '@/app/assets/icons/ControlsIcon';
import { LegendIcon } from '@/app/assets/icons/LegendIcon';
import Circle from '@/app/assets/icons/Circle';
import { Marker } from '@/app/assets/icons/Marker';

export const MapTools: React.FC = () => {
    const { visibleLayers } = useSelector((state: RootState) => state.main);

    const dispatch: AppDispatch = useDispatch();

    const [showTools, setShowTools] = useState(false);
    const [showLayerToggle, setShowLayerToggle] = useState(false);
    const [showLegend, setShowLegend] = useState(false);

    const handleLayerVizChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        isPrimary: boolean
    ) => {
        const { name, checked } = event.target;
        if (isPrimary) {
            const layerId = name as LayerId;
            const layerDef = layerDefinitions.find(
                (layerDef) => layerDef.id === layerId
            );
            dispatch(setLayerVisibility({ [layerId]: checked }));
            if (layerDef?.subLayers?.length) {
                layerDef.subLayers.forEach((subLayer) =>
                    dispatch(setLayerVisibility({ [subLayer.id]: checked }))
                );
            }
        } else {
            const subLayerId = name as LayerId;
            dispatch(setLayerVisibility({ [subLayerId]: checked }));
        }
    };

    return (
        <>
            <div className="flex flex-col items-end lg:items-center lg:flex-row-reverse space-x-0 lg:space-x-2 space-y-2 lg:space-y-0">
                <IconButton
                    title="Tools"
                    handleClick={() => setShowTools(!showTools)}
                    className="ml-2"
                >
                    <ControlsIcon />
                </IconButton>
                {showTools && (
                    <>
                        <IconButton
                            title="Layer Toggles"
                            handleClick={() =>
                                setShowLayerToggle(!showLayerToggle)
                            }
                        >
                            <LayerIcon />
                        </IconButton>
                        <IconButton
                            title="Legend"
                            handleClick={() => setShowLegend(!showLegend)}
                        >
                            <LegendIcon />
                        </IconButton>
                        {/* Add legend and other tools here */}
                    </>
                )}
            </div>
            {showLayerToggle && (
                <Card
                    className="mt-2 w-60"
                    handleClose={() => setShowLayerToggle(false)}
                >
                    <Toggles
                        visibleLayers={visibleLayers}
                        layerDefinitions={layerDefinitions}
                        handleChange={handleLayerVizChange}
                        getLayerColor={getLayerColor as (id: string) => string}
                        getLayerName={getLayerName as (id: string) => string}
                    />
                </Card>
            )}
            {showLegend && (
                <Card
                    className="mt-1 w-60"
                    handleClose={() => setShowLegend(false)}
                >
                    <Legend
                        visibleLayers={visibleLayers}
                        layerDefinitions={layerDefinitions}
                        getLayerColor={getLayerColor as (id: string) => string}
                        getLayerName={getLayerName as (id: string) => string}
                        getLayerConfig={
                            getLayerConfig as (
                                id: string
                            ) => null | LayerSpecification
                        }
                        custom={
                            <div className="-mt-2">
                                Dataset Clusters
                                <span className="flex">
                                    <Circle color="#51bbd6" />
                                    &lt; 5
                                </span>
                                <span className="flex">
                                    <Circle color="#f1f075" />
                                    &gt; 5
                                </span>
                                <span className="flex">
                                    <Circle color="#f28cb1" />
                                    &gt; 10
                                </span>
                                Dataset
                                <Marker />
                            </div>
                        }
                    />
                </Card>
            )}
        </>
    );
};

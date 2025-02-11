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
    BASEMAP as MAIN_BASEMAP,
    MAP_ID as MAIN_MAP_ID,
} from '@/app/features/MainMap/config';
import IconButton from '@/app/components/common/IconButton';
import MapIcon from '@/app/assets/icons/MapIcon';
import { useMap } from '@/app/contexts/MapContexts';
import BasemapSelector from '@/app/components/Map/tools/BasemapSelector';
import { BasemapStyles } from '@/app/components/Map/types';

export const MapTools: React.FC = () => {
    const { visibleLayers } = useSelector((state: RootState) => state.main);

    const dispatch: AppDispatch = useDispatch();

    const { map } = useMap(MAIN_MAP_ID);

    const [showTools, setShowTools] = useState(false);
    const [showLayerToggle, setShowLayerToggle] = useState(false);
    const [showBaseMapSelector, setShowBaseMapSelector] = useState(false);

    const [selectedBasemap, setSelectedBasemap] =
        useState<BasemapStyles>(MAIN_BASEMAP);

    const handleLayerVizChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, checked } = event.target;
        dispatch(setLayerVisibility({ [name as LayerId]: checked }));
    };

    const handleStyleChange = (style: BasemapStyles) => {
        setSelectedBasemap(style);
        if (map) {
            map.setStyle(style);
        }
    };

    return (
        <div className="mt-1">
            <div className="flex space-x-2 flex-row-reverse">
                <IconButton
                    title="Tools"
                    handleClick={() => setShowTools(!showTools)}
                    className="ml-2"
                >
                    <MapIcon />
                </IconButton>
                {showTools && (
                    <>
                        <IconButton
                            title="Layer Toggles"
                            handleClick={() =>
                                setShowLayerToggle(!showLayerToggle)
                            }
                        >
                            <MapIcon />
                        </IconButton>
                        <IconButton
                            title="Basemap Selector"
                            handleClick={() =>
                                setShowBaseMapSelector(!showBaseMapSelector)
                            }
                        >
                            <MapIcon />
                        </IconButton>
                        {/* Add legend and other tools here */}
                    </>
                )}
            </div>
            {showLayerToggle && (
                <Card
                    className="mt-1"
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
            {showBaseMapSelector && (
                <Card
                    className="mt-1"
                    handleClose={() => setShowBaseMapSelector(false)}
                >
                    <BasemapSelector
                        style={selectedBasemap}
                        handleStyleChange={handleStyleChange}
                    />
                </Card>
            )}
        </div>
    );
};

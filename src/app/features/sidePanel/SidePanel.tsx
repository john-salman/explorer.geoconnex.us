import { Toggles } from '@/app/components/map/tools/Toggles';
import {
    getLayerColor,
    getLayerName,
    layerDefinitions,
    LayerId,
} from '@/app/features/mainMap/config';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import { setLayerVisibility } from '@/lib/state/main/slice';
import { useState } from 'react';
import Card from '@/app/components/common/Card';
import Button from '@/app/components/common/Button';
import Search from '@/app/features/sidePanel/Search';
import { Filters } from './filters/Filters';

export const SidePanel: React.FC = () => {
    const { visibleLayers, datasets } = useSelector(
        (state: RootState) => state.main
    );

    const dispatch: AppDispatch = useDispatch();

    const [showLayerToggle, setShowLayerToggle] = useState(false);

    const handleLayerVizChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, checked } = event.target;
        dispatch(setLayerVisibility({ [name as LayerId]: checked }));
    };

    return (
        <div className="ml-[0.8rem]">
            <Search />
            <div className='mt-1'>
                {showLayerToggle ? (

                    <Card handleClose={() => setShowLayerToggle(false)}>
                        <Toggles
                            visibleLayers={visibleLayers}
                            layerDefinitions={layerDefinitions}
                            handleChange={handleLayerVizChange}
                            getLayerColor={getLayerColor as (id: string) => string}
                            getLayerName={getLayerName as (id: string) => string}
                        />
                    </Card>
                ) : (
                    <Button
                    handleClick={() => setShowLayerToggle(true)}
                    >
                        Show Layer Toggle                    
                    </Button>
                )}
            </div>
            <div className='mt-1'>
                {datasets.features.length > 0 && (
                    <Filters />
                )}
            </div>
            <div className='mt-1'>
           
            </div>
        </div>
    );
};

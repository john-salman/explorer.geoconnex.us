'use client'
import { Provider, useSelector } from "react-redux"
import { MainMap } from "@/app/features/mainMap"
import store, { RootState } from "@/lib/state/store";
import { MapProvider } from "@/app/contexts/MapContexts";
import { MAP_ID as MAIN_MAP_ID } from '@/app/features/mainMap/config';
import { SidePanel } from "@/app/features/sidePanel/SidePanel";
import { useState } from "react";
import IconButton from "@/app/components/common/IconButton";
import MapIcon from "@/app/assets/icons/MapIcon";
import TableIcon from "@/app/assets/icons/TableIcon";
import Table from "@/app/features/Table";

type Props = {
    accessToken: string;
};

export const App: React.FC<Props> = (props) => {
    const {
        accessToken
    } = props;

    const { datasets } = useSelector(
        (state: RootState) => state.main
    );

    const [mapView, setMapView] = useState(true);


    return (
            <>
                <div id="sidePanel" className="fixed">
                    <SidePanel />
                </div>
                <div id="map" className={`${mapView ? 'block' : 'hidden'}`}> 
                    <MainMap accessToken={accessToken}/>
                </div>
                <div id="table" className={`rounded-lg max-w-[73vw] max-h-[96vh] mr-5 my-5 overflow-hidden ${mapView ? 'hidden' : 'block'}`}> 
                    <Table />
                </div>
                <div id="views" className="fixed right-1 top-1">
                    <IconButton
                        handleClick={() => setMapView(true)}
                        className="mr-1"
                        disabled={mapView}
                    >
                        <MapIcon />
                    </IconButton>
                    <IconButton
                        handleClick={() => setMapView(false)}
                        disabled={!(datasets.features.length > 0) || !mapView}
                    >
                        <TableIcon />
                    </IconButton>
                </div>
            </>
    );
}



export const AppProvider: React.FC<Props> = (props) => {
    const {
        accessToken
    } = props;

    return (
        <Provider store={store}>
            <MapProvider mapIds={[MAIN_MAP_ID]}>
               <App accessToken={accessToken}/>
            </MapProvider>
        </Provider>
    );
}

export default AppProvider;
'use client';
import { Provider, useSelector } from 'react-redux';
// import { MainMap } from '@/app/features/MainMap';
import store, { RootState } from '@/lib/state/store';
import { MapProvider } from '@/app/contexts/MapContexts';
import { MAP_ID as MAIN_MAP_ID } from '@/app/features/MainMap/config';
import { SidePanel } from '@/app/features/SidePanel';
import Table from '@/app/features/Table';
import { MapTools } from './features/MapTools';
import dynamic from 'next/dynamic';
import { lazy } from 'react';

type Props = {
    accessToken: string;
};

// const MainMap = dynamic(() => import('@/app/features/MainMap'), { ssr: false });
const MainMap = lazy(() => import('@/app/features/MainMap'));

export const App: React.FC<Props> = (props) => {
    const { accessToken } = props;

    const { view } = useSelector((state: RootState) => state.main);

    return (
        <div className="w-[100vw] h-[100vw] max-w-[100vw] max-h-[100vh] overflow-hidden">
            <div id="sidePanel" className="fixed">
                <SidePanel />
            </div>
            <div id="map" className={`${view === 'map' ? 'block' : 'hidden'}`}>
                <MainMap accessToken={accessToken} />
            </div>
            <div
                id="table"
                className={`rounded-lg ml-auto max-w-[72vw] max-h-[96vh] mr-5 my-5 overflow-hidden ${
                    view === 'table' ? 'block' : 'hidden'
                }`}
            >
                <Table />
            </div>
            <div id="tools" className={`fixed top-2 right-2`}>
                {view === 'map' && <MapTools />}
            </div>
        </div>
    );
};

export const AppProvider: React.FC<Props> = (props) => {
    const { accessToken } = props;

    return (
        <Provider store={store}>
            <MapProvider mapIds={[MAIN_MAP_ID]}>
                <App accessToken={accessToken} />
            </MapProvider>
        </Provider>
    );
};

export default AppProvider;

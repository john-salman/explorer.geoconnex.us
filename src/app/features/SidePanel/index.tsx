import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import { setView } from '@/lib/state/main/slice';
import { useState } from 'react';
import Card from '@/app/components/common/Card';
import Button from '@/app/components/common/Button';
import Search from '@/app/features/SidePanel/Search';
import { Filters } from '@/app/features/SidePanel/Filters';
import { CSVDownload } from '@/app/features/SidePanel/CSVDownload';
import IconButton from '@/app/components/common/IconButton';
import MapIcon from '@/app/assets/icons/MapIcon';
import TableIcon from '@/app/assets/icons/TableIcon';
import Collapsible from '@/app/components/common/Collapsible';

type Props = {
    className: string;
};

export const SidePanel: React.FC<Props> = (props) => {
    const { className } = props;

    const { datasets, view } = useSelector((state: RootState) => state.main);

    const dispatch: AppDispatch = useDispatch();

    return (
        <div className={`w-[24vw]`}>
            <div className="border-b border-gray-300">
                <button
                    onClick={() => dispatch(setView('map'))}
                    className={`${
                        view === 'map' ? 'bg-[#46ab9d]' : 'bg-[#5fc0b1]'
                    } hover:bg-[#46ab9d] text-white font-bold py-2 px-4 w-[50%]`}
                    disabled={view === 'map'}
                >
                    Map
                </button>
                <button
                    onClick={() => dispatch(setView('table'))}
                    disabled={
                        datasets.features.length === 0 || view === 'table'
                    }
                    className={`${
                        view === 'table' ? 'bg-[#46ab9d]' : 'bg-[#5fc0b1]'
                    }  hover:enabled:bg-[#46ab9d] disabled:bg-[#5fc0b1] text-white font-bold py-2 px-4 w-[50%]`}
                >
                    Table
                </button>
            </div>
            {/* Defined in global.css */}
            <div id="scrollable-sidepanel">
                <Collapsible title="Search">
                    <Search />
                </Collapsible>
                {datasets.features.length > 0 && (
                    <Collapsible title="Filters">
                        <Filters />
                        <div className="mt-5">
                            <CSVDownload />
                        </div>
                    </Collapsible>
                )}
            </div>
        </div>
    );
};

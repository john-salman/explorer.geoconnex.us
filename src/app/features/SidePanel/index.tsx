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

export const SidePanel: React.FC = () => {
    const { datasets, view } = useSelector((state: RootState) => state.main);

    const dispatch: AppDispatch = useDispatch();

    const [showSearch, setShowSearch] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="ml-[0.8rem] w-[24vw]">
            <div className="mt-1">
                <IconButton
                    handleClick={() => dispatch(setView('map'))}
                    className="mr-1"
                    disabled={view === 'map'}
                >
                    <MapIcon />
                </IconButton>
                <IconButton
                    handleClick={() => dispatch(setView('table'))}
                    disabled={
                        datasets.features.length === 0 || view === 'table'
                    }
                >
                    <TableIcon />
                </IconButton>
            </div>
            {/* Defined in global.css */}
            <div id="scrollable-sidepanel">
                <div className="mt-1">
                    {/* Special case: dont rerender and refetch results on hide/show */}
                    <Card
                        className={`${showSearch ? 'block' : 'hidden'}`}
                        handleClose={() => setShowSearch(false)}
                    >
                        <Search />
                    </Card>
                    {!showSearch && (
                        <IconButton
                            handleClick={() => setShowSearch(true)}
                            className="mr-1"
                        >
                            <MapIcon />
                        </IconButton>
                    )}
                </div>
                <div className="mt-1">
                    {datasets.features.length > 0 && (
                        <>
                            {showFilters ? (
                                <Card handleClose={() => setShowFilters(false)}>
                                    <Filters />
                                    <div className="mt-1">
                                        <CSVDownload />
                                    </div>
                                </Card>
                            ) : (
                                <Button
                                    handleClick={() => setShowFilters(true)}
                                >
                                    Show Filters
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

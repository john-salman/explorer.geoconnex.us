import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import { setShowSidePanel, setView } from '@/lib/state/main/slice';
import Search from '@/app/features/SidePanel/Search';
import { Filters } from '@/app/features/SidePanel/Filters';
import { CSVDownload } from '@/app/features/SidePanel/CSVDownload';
import Collapsible from '@/app/components/common/Collapsible';
import CloseButton from '@/app/components/common/CloseButton';

type Props = {
    className?: string;
};

export const SidePanel: React.FC<Props> = (props) => {
    const { className } = props;

    const { datasets, view } = useSelector((state: RootState) => state.main);

    const dispatch: AppDispatch = useDispatch();

    return (
        <div className={`w-full mt-1`}>
            <div className=" flex justify-between border-b border-gray-300 shadow-lg">
                <div className="flex w-[60%]">
                    <button
                        onClick={() => dispatch(setView('map'))}
                        className={`${
                            view === 'map'
                                ? 'bg-primary -mb-px border-b-transparent'
                                : 'bg-primary-darker text-gray-200'
                        } hover:bg-primary 
                        border-t border-x border-white 
                        py-3 px-4 mx-2 
                        text-white hover:text-white font-bold 
                        rounded-t-lg
                        w-[50%] `}
                    >
                        Map
                    </button>
                    <button
                        onClick={() => dispatch(setView('table'))}
                        disabled={datasets.features.length === 0}
                        className={`${
                            view === 'table'
                                ? 'bg-primary -mb-px border-b-transparent'
                                : 'bg-primary-darker text-gray-200'
                        } hover:enabled:bg-primary 
                        disabled:opacity-60
                        border-t border-x border-white
                        py-3 px-4
                      text-white hover::enabled:text-white font-bold 
                        rounded-t-lg
                        w-[50%]`}
                    >
                        Table
                    </button>
                </div>
                <div
                    id="side-panel-close"
                    className="mr-1 text-white block lg:hidden"
                >
                    <CloseButton
                        handleClick={() => dispatch(setShowSidePanel(false))}
                        className="text-white hover:text-gray-200 text-xl"
                        closeIconClassName="w-10 h-10"
                    />
                </div>
            </div>
            <div id="scrollable-side-panel" className="overflow-y-auto">
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

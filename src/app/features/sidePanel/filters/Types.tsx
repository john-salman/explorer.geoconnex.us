import MultiSelect from '@/app/components/common/MultiSelect';
import { setFilter } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const Types: React.FC = () => {
    const { datasets, filter } = useSelector((state: RootState) => state.main);
    const dispatch: AppDispatch = useDispatch();

    const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

    useEffect(() => {
        if (!datasets || !datasets?.features?.length) {
            return;
        }

        const newUniqueTypes = [...uniqueTypes];
        datasets.features.forEach((feature) => {
            if (feature.properties) {
                if (!newUniqueTypes.includes(feature.properties.type)) {
                    newUniqueTypes.push(feature.properties.type);
                }
            }
        });

        if (JSON.stringify(uniqueTypes) !== JSON.stringify(newUniqueTypes)) {
            setUniqueTypes(newUniqueTypes);
        }
    }, [datasets]);

    const handleTypeOptionClick = (type: string) => {
        const newSelectedTypes =
            filter?.selectedTypes && filter.selectedTypes.includes(type)
                ? filter.selectedTypes.filter((item) => item !== type)
                : [...(filter?.selectedTypes ?? []), type];
        dispatch(
            setFilter({
                selectedTypes: newSelectedTypes,
            })
        );
    };

    return (
        <>
            {uniqueTypes.length > 0 && (
                <MultiSelect
                    options={uniqueTypes}
                    selectedOptions={filter.selectedTypes}
                    handleOptionClick={handleTypeOptionClick}
                />
            )}
        </>
    );
};

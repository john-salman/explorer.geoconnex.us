import MultiSelect from '@/app/components/common/MultiSelect';
import { setFilter } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const Variables: React.FC = () => {
    const { datasets, filter } = useSelector((state: RootState) => state.main);
    const dispatch: AppDispatch = useDispatch();

    const [uniqueVariables, setUniqueVariables] = useState<string[]>([]);

    useEffect(() => {
        if (!datasets || !datasets?.features?.length) {
            return;
        }

        const newUniqueVariables = [...uniqueVariables];
        datasets.features.forEach((feature) => {
            if (feature.properties) {
                const variable =
                    feature.properties.variableMeasured.split(' / ')[0];
                if (!newUniqueVariables.includes(variable)) {
                    newUniqueVariables.push(variable);
                }
            }
        });

        if (
            JSON.stringify(uniqueVariables) !==
            JSON.stringify(newUniqueVariables)
        ) {
            dispatch(setFilter({ selectedVariables: newUniqueVariables }));
            setUniqueVariables(newUniqueVariables);
        }
    }, [datasets]);

    const handleTypeOptionClick = (type: string) => {
        const newSelectedVariables =
            filter?.selectedVariables && filter.selectedVariables.includes(type)
                ? filter.selectedVariables.filter((item) => item !== type)
                : [...(filter?.selectedVariables ?? []), type];
        dispatch(
            setFilter({
                selectedVariables: newSelectedVariables,
            })
        );
    };

    return (
        <>
            <h6>Variable</h6>
            {uniqueVariables.length > 0 && (
                <MultiSelect
                    options={uniqueVariables}
                    selectedOptions={filter.selectedVariables}
                    handleOptionClick={handleTypeOptionClick}
                />
            )}
        </>
    );
};

import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import debounce from 'lodash.debounce';
import { FeatureCollection, Geometry } from 'geojson';
import { AppDispatch } from '@/lib/state/store';
import {
    fetchDatasets,
    setDatasets,
    setHoverId,
    setSearchResultIds,
    setSelectedMainstemId,
} from '@/lib/state/main/slice';
import { defaultGeoJson } from '@/lib/state/utils';
import { Dataset, MainstemData } from '@/app/types';

const SearchComponent: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MainstemData[]>([]);

    const dispatch: AppDispatch = useDispatch();

    const search = async (query: string) => {
        const _query = query.toLowerCase();

        if (_query) {
            const response = await fetch(
                `https://reference.geoconnex.us/collections/mainstems/items?filter=name_at_outlet+ILIKE+'%${query}%'+OR+uri+ILIKE+'%mainstems/${query}%'&f=json&skipGeometry=true`
            );
            const data: FeatureCollection<Geometry, MainstemData> =
                await response.json();
            const searchResults: MainstemData[] = data.features.map(
                (feature) =>
                    ({
                        ...feature.properties,
                        id: feature.id,
                    } as MainstemData)
            );
            setResults(searchResults);
        } else {
            setResults([]);
            dispatch(
                setDatasets(
                    defaultGeoJson as FeatureCollection<Geometry, Dataset>
                )
            );
        }
    };

    const debouncedSearch = useCallback(
        debounce(async (query: string) => search(query), 800),
        []
    );

    useEffect(() => {
        return function cleanup() {
            debouncedSearch.cancel();
        };
    }, []);

    useEffect(() => {
        debouncedSearch(query);
    }, [query]);

    useEffect(() => {
        const ids = results.map((result) => result.id);
        dispatch(setSearchResultIds(ids));
    }, [results]);

    const handleClick = async (id: number) => {
        dispatch(fetchDatasets(id));
        dispatch(setSelectedMainstemId(id));
    };

    return (
        <div
            className="mb-5 mt-5 mr-5 h-30% max-h-[35vh] overflow-auto border border-gray-500 p-2.5 w-[100%]"
            onMouseLeave={() => dispatch(setHoverId(null))}
        >
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="border p-2 rounded w-[95%]"
            />
            <ul>
                {results.map((result, index) => (
                    <li
                        key={index}
                        className="p-2 border-b truncate"
                        onClick={() => handleClick(Number(result.id))}
                        onMouseOver={() =>
                            dispatch(setHoverId(Number(result.id)))
                        }
                        title={`${result.name_at_outlet} - ${result.uri}`}
                    >
                        <strong>{result.name_at_outlet}</strong> - {result.uri}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchComponent;

import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import debounce from 'lodash.debounce';
import {
    Feature,
    FeatureCollection,
    GeoJsonProperties,
    Geometry,
} from 'geojson';
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
import { GeoJSONFeature } from 'mapbox-gl';
import { Linear } from '@/app/assets/Linear';

type Summary = {
    id: number;
    total: number;
    variables: string;
    types: string;
    techniques: string;
};

const SearchComponent: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MainstemData[]>([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<Summary | null>(null);

    const dispatch: AppDispatch = useDispatch();

    const search = async (query: string) => {
        const _query = query.toLowerCase();

        if (_query) {
            try {
                setLoading(true);
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
                setLoading(false);
            } catch (error) {
                console.error('Error fetching mainstems: ', error);
                setLoading(false);
            }
        } else {
            setResults([]);
            setSummary(null);
            dispatch(
                setDatasets(
                    defaultGeoJson as FeatureCollection<Geometry, Dataset>
                )
            );
        }
    };

    const getDatasets = async (id: number) => {
        if (summary && summary.id === id) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `https://reference.geoconnex.us/collections/mainstems/items/${id}`
            );
            const feature: Feature<
                Geometry,
                GeoJsonProperties & { datasets: Dataset[] }
            > = await response.json();

            const datasets = feature.properties.datasets;
            if (datasets && datasets.length) {
                const total = datasets.length;
                const variables: string[] = [];
                const types: string[] = [];
                const techniques: string[] = [];

                datasets.forEach((dataset) => {
                    const { variableMeasured, type, measurementTechnique } =
                        dataset;

                    const variable = variableMeasured.split(' / ')[0];
                    if (!variables.includes(variable)) {
                        variables.push(variable);
                    }

                    if (!types.includes(type)) {
                        types.push(type);
                    }

                    if (!techniques.includes(measurementTechnique)) {
                        techniques.push(measurementTechnique);
                    }
                });

                const summary: Summary = {
                    id,
                    total,
                    variables: variables.join(', '),
                    types: types.join(', '),
                    techniques: techniques.join(', '),
                };

                setSummary(summary);
                setLoading(false);
            } else {
                // No datasets, add placeholder to prevent additional fetches
                setSummary({
                    id,
                    total: 0,
                    variables: '',
                    types: '',
                    techniques: '',
                });
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching datasets: ', error);
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce(async (query: string) => search(query), 800),
        []
    );

    const debouncedGetDatasets = useCallback(
        debounce((id: number) => getDatasets(id), 300),
        [summary]
    );

    useEffect(() => {
        return function cleanup() {
            debouncedSearch.cancel();
            debouncedGetDatasets.cancel();
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
        dispatch(setSelectedMainstemId(String(id)));
    };

    return (
        <>
            <div className="bg-white flex flex-col justify-center m-1 pb-1 text-black border border-gray-500 rounded-lg shadow-lg">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="border p-2 mx-1 mt-1 mb-[0.3rem] rounded w-[98%] h-12 focus:outline-none focus:ring-2 focus:ring-[#4798e6] shadow-lg"
                />
                <div
                    className="h-30% max-h-[29vh] overflow-auto p-2.5 w-[100%] "
                    onMouseLeave={() => {
                        dispatch(setHoverId(null));
                        debouncedGetDatasets.cancel();
                    }}
                >
                    <ul>
                        {results.map((result, index) => {
                            const id = Number(result.id);

                            return (
                                <li
                                    key={index}
                                    className="p-2 border-b truncate cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleClick(id)}
                                    onMouseOver={() => {
                                        dispatch(setHoverId(id));
                                        debouncedGetDatasets(id);
                                    }}
                                    onMouseLeave={() => {
                                        debouncedGetDatasets.cancel();
                                    }}
                                    title={`${result.name_at_outlet} - ${result.uri}`}
                                >
                                    <strong>{result.name_at_outlet}</strong> -{' '}
                                    {result.uri}
                                    {summary !== null &&
                                        summary.id === id &&
                                        (summary.total > 0 ? (
                                            <ul
                                                key={`summary-${index}`}
                                                className="pl-4 mt-2"
                                            >
                                                {/* showSummary confirms summary existence */}
                                                <li className="list-disc list-inside break-words whitespace-normal">
                                                    Datasets: {summary!.total}
                                                </li>
                                                {summary!.types.length > 0 && (
                                                    <li className="list-disc list-inside break-words whitespace-normal">
                                                        Types: {summary!.types}
                                                    </li>
                                                )}
                                                {summary!.variables.length >
                                                    0 && (
                                                    <li className="list-disc list-inside break-words whitespace-normal">
                                                        Variables Measures:{' '}
                                                        {summary!.variables}
                                                    </li>
                                                )}
                                                {summary!.techniques.length >
                                                    0 && (
                                                    <li className="list-disc list-inside break-words whitespace-normal">
                                                        Techniques:{' '}
                                                        {summary!.techniques}
                                                    </li>
                                                )}
                                            </ul>
                                        ) : (
                                            <p className="mt-2 text-gray-500">
                                                No Observations
                                            </p>
                                        ))}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            {loading ? <Linear /> : <div className="h-2" />}
        </>
    );
};

export default SearchComponent;

'use client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultGeoJson, transformDatasets } from '../utils';
import { FeatureCollection, Geometry } from 'geojson';
import { LayerId, SubLayerId } from '@/app/features/MainMap/config';
import { Dataset } from '@/app/types';
import { GeoJSONFeature, LngLatBoundsLike } from 'mapbox-gl';
import * as turf from '@turf/turf';

type InitialState = {
    selectedMainstemId: number | null;
    selectedMainstemBBOX: LngLatBoundsLike | null;
    hoverId: number | null;
    selectedData: Dataset | null;
    searchResultIds: string[];
    status: string;
    error: string | null;
    datasets: FeatureCollection<Geometry, Dataset>;
    filteredDatasets: FeatureCollection<Geometry, Dataset>;
    view: 'map' | 'table';
    visibleLayers: {
        [LayerId.MajorRivers]: boolean;
        [LayerId.HUC2Boundaries]: boolean;
        [LayerId.Mainstems]: boolean;
        [SubLayerId.MainstemsSmall]: boolean;
        [SubLayerId.MainstemsMedium]: boolean;
        [SubLayerId.MainstemsLarge]: boolean;
        [SubLayerId.HUC2BoundaryLabels]: boolean;
        [LayerId.AssociatedData]: boolean;
        [LayerId.SpiderifyPoints]: boolean;
        [SubLayerId.AssociatedDataClusterCount]: boolean;
        [SubLayerId.AssociatedDataClusters]: boolean;
        [SubLayerId.AssociatedDataUnclustered]: boolean;
    };
    filter: {
        selectedTypes?: string[];
        selectedVariables?: string[];
        startTemporalCoverage?: string;
        endTemporalCoverage?: string;
    };
};

const initialState: InitialState = {
    selectedMainstemId: null,
    selectedMainstemBBOX: null,
    hoverId: null,
    selectedData: null,
    searchResultIds: [],
    status: 'idle', // Additional state to track loading status
    error: null,
    datasets: defaultGeoJson as FeatureCollection<Geometry, Dataset>,
    filteredDatasets: defaultGeoJson as FeatureCollection<Geometry, Dataset>,
    view: 'map',
    visibleLayers: {
        [LayerId.MajorRivers]: true,
        [LayerId.HUC2Boundaries]: true,
        [LayerId.Mainstems]: true,
        [SubLayerId.MainstemsSmall]: true,
        [SubLayerId.MainstemsMedium]: true,
        [SubLayerId.MainstemsLarge]: true,
        [SubLayerId.HUC2BoundaryLabels]: true,
        [LayerId.AssociatedData]: true,
        [LayerId.SpiderifyPoints]: true,
        [SubLayerId.AssociatedDataClusterCount]: true,
        [SubLayerId.AssociatedDataClusters]: true,
        [SubLayerId.AssociatedDataUnclustered]: true,
    },
    filter: {
        selectedTypes: [],
        selectedVariables: [],
    },
};

// Good candidate for caching
export const fetchDatasets = createAsyncThunk(
    'main/fetchDatasets',
    async (id: number) => {
        const response = await fetch(
            `https://reference.geoconnex.us/collections/mainstems/items/${id}`
        );
        const data = await response.json();
        return data;
    }
);

export const searchMainstemsCQL = createAsyncThunk(
    'main/fetchDatasets',
    async (query: string) => {
        const response = await fetch(
            `https://reference.geoconnex.us/collections/mainstems/items?filter=name_at_outlet+ILIKE+'%${query}%'+OR+uri+ILIKE+'%mainstems/${query}%'&f=json`
        );
        const data = await response.json();
        return data;
    }
);

export const mainSlice = createSlice({
    name: 'main',
    initialState: initialState,
    reducers: {
        setSearchResultIds: (
            state,
            action: PayloadAction<InitialState['searchResultIds']>
        ) => {
            state.searchResultIds = action.payload;
        },
        setDatasets: (
            state,
            action: PayloadAction<InitialState['datasets']>
        ) => {
            state.datasets = action.payload;
            state.filteredDatasets = action.payload;
        },
        setFilteredDatasets: (
            state,
            action: PayloadAction<InitialState['filteredDatasets']>
        ) => {
            state.filteredDatasets = action.payload;
        },
        setSelectedMainstemId: (
            state,
            action: PayloadAction<InitialState['selectedMainstemId']>
        ) => {
            state.selectedMainstemId = action.payload;
        },
        setSelectedData: (
            state,
            action: PayloadAction<InitialState['selectedData']>
        ) => {
            state.selectedData = action.payload;
        },
        setLayerVisibility: (
            state,
            action: PayloadAction<Partial<InitialState['visibleLayers']>>
        ) => {
            state.visibleLayers = {
                ...state.visibleLayers,
                ...action.payload,
            };
        },
        setFilter: (
            state,
            action: PayloadAction<Partial<InitialState['filter']>>
        ) => {
            // Update filter
            const newFilter = {
                ...state.filter,
                ...action.payload,
            };
            state.filter = newFilter;

            // Apply filter automatically to the main datasets obj
            const features = state.datasets.features.filter((feature) => {
                const { type, variableMeasured, temporalCoverage } =
                    feature.properties;
                const [startTemporal, endTemporal] =
                    temporalCoverage.split('/');

                const startDate = new Date(startTemporal);
                const endDate = new Date(endTemporal);

                // If filter exists apply it

                // Check type
                const isTypeSelected =
                    !newFilter.selectedTypes ||
                    newFilter.selectedTypes.length === 0 ||
                    newFilter.selectedTypes.includes(type);
                // Check variable measured
                const isVariableSelected =
                    !newFilter.selectedVariables ||
                    newFilter.selectedVariables.length === 0 ||
                    newFilter.selectedVariables.includes(
                        variableMeasured.split(' / ')[0]
                    );

                // Check start of temporal coverages
                const isStartDateValid =
                    !newFilter.startTemporalCoverage ||
                    new Date(newFilter.startTemporalCoverage) <=
                        new Date(startDate);
                // Check end of temporal coverages
                const isEndDateValid =
                    !newFilter.endTemporalCoverage ||
                    new Date(newFilter.endTemporalCoverage) >=
                        new Date(endDate);

                return (
                    isTypeSelected &&
                    isVariableSelected &&
                    isStartDateValid &&
                    isEndDateValid
                );
            });

            state.filteredDatasets = {
                type: 'FeatureCollection',
                features: features,
            };
        },
        setHoverId: (state, action: PayloadAction<InitialState['hoverId']>) => {
            state.hoverId = action.payload;
        },
        setView: (state, action: PayloadAction<InitialState['view']>) => {
            state.view = action.payload;
        },
        setSelectedMainstemBBOX: (
            state,
            action: PayloadAction<InitialState['selectedMainstemBBOX']>
        ) => {
            state.selectedMainstemBBOX = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDatasets.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                fetchDatasets.fulfilled,
                (state, action: PayloadAction<GeoJSONFeature>) => {
                    state.status = 'succeeded';
                    if (action.payload) {
                        const datasets = transformDatasets(action.payload);
                        state.datasets = datasets;
                        state.filteredDatasets = datasets;
                        const bbox = turf.bbox(
                            action.payload
                        ) as LngLatBoundsLike;
                        state.selectedMainstemBBOX = bbox;
                    }
                    return;
                }
            )
            .addCase(fetchDatasets.rejected, (state, action) => {
                state.status = 'failed';
                console.log('Error: ', action);
            });
    },
});

export const {
    setSearchResultIds,
    setSelectedMainstemId,
    setHoverId,
    setDatasets,
    setFilteredDatasets,
    setLayerVisibility,
    setSelectedData,
    setFilter,
    setView,
    setSelectedMainstemBBOX,
} = mainSlice.actions;

export default mainSlice.reducer;

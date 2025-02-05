'use client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { defaultGeoJson, transformDatasets } from '../utils';
import { FeatureCollection, Geometry } from 'geojson';
import { LayerId, SubLayerId } from '@/app/features/mainMap/config';
import { Dataset } from '@/app/types';

type InitialState = {
    selectedMainstemId: number | null;
    hoverId: number | null;
    selectedData: any | null;
    searchResultIds: string[];
    status: string;
    error: string | null;
    datasets: FeatureCollection<Geometry, Dataset>;
    filteredDatasets: FeatureCollection<Geometry, Dataset>;
    visibleLayers: {
        [LayerId.MajorRivers]: boolean;
        [LayerId.HUC2Boundaries]: boolean;
        [SubLayerId.MainstemsSmall]: boolean;
        [SubLayerId.MainstemsMedium]: boolean;
        [SubLayerId.MainstemsLarge]: boolean;
        [SubLayerId.HUC2BoundaryLabels]: boolean;
    };
    filter: {
        selectedTypes?: string[];
        selectedVariables?: string[];
    };
};

const initialState: InitialState = {
    selectedMainstemId: null,
    hoverId: null,
    selectedData: null,
    searchResultIds: [],
    status: 'idle', // Additional state to track loading status
    error: null,
    datasets: defaultGeoJson as FeatureCollection<Geometry, Dataset>,
    filteredDatasets: defaultGeoJson as FeatureCollection<Geometry, Dataset>,
    visibleLayers: {
        [LayerId.MajorRivers]: true,
        [LayerId.HUC2Boundaries]: true,
        [SubLayerId.MainstemsSmall]: true,
        [SubLayerId.MainstemsMedium]: true,
        [SubLayerId.MainstemsLarge]: true,
        [SubLayerId.HUC2BoundaryLabels]: true,
    },
    filter: {
        selectedTypes: [],
    },
};

// Good candidate for caching
export const fetchDatasets = createAsyncThunk(
    'main/fetchDatasets',
    async (id: number, thunkApi) => {
        const response = await fetch(
            `https://reference.geoconnex.us/collections/mainstems/items/${id}`
        );
        const data = await response.json();
        return data;
    }
);

export const searchMainstemsCQL = createAsyncThunk(
    'main/fetchDatasets',
    async (query: string, thunkApi) => {
        const response = await fetch(
            `https://reference.geoconnex.us/collections/mainstems/items?filter=name_at_outlet+ILIKE+'%${query}%'&f=json&skipGeometry=true`
        );
        const data = await response.json();
        return data;
    }
);

export const mainSlice = createSlice({
    name: 'main',
    initialState: initialState,
    reducers: {
        setSearchResultIds: (state, action) => {
            state.searchResultIds = action.payload;
        },
        setDatasets: (state, action) => {
            state.datasets = action.payload;
            state.filteredDatasets = action.payload;
        },
        setFilteredDatasets: (state, action) => {
            state.filteredDatasets = action.payload;
        },
        setSelectedMainstemId: (state, action) => {
            state.selectedMainstemId = action.payload;
        },
        setSelectedData: (state, action) => {
            state.selectedData = action.payload;
        },
        setLayerVisibility: (state, action) => {
            state.visibleLayers = {
                ...state.visibleLayers,
                ...action.payload,
            };
        },
        setFilter: (state, action) => {
            state.filter = {
                ...state.filter,
                ...action.payload,
            };
        },
        setHoverId: (state, action) => {
            state.hoverId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDatasets.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDatasets.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload) {
                    const datasets = transformDatasets(action.payload);
                    console.log('here', datasets);
                    state.datasets = datasets;
                    state.filteredDatasets = datasets;
                }
            })
            .addCase(fetchDatasets.rejected, (state, action) => {
                state.status = 'failed';
                console.log('Error: ', action);
            });
    },
});

// Action creators are generated for each case reducer function
export const {
    setSearchResultIds,
    setSelectedMainstemId,
    setHoverId,
    setDatasets,
    setFilteredDatasets,
    setLayerVisibility,
    setSelectedData,
    setFilter,
} = mainSlice.actions;

export default mainSlice.reducer;

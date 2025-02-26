import { configureStore, Store } from '@reduxjs/toolkit';
import mainReducer, {
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
} from '@/lib/state/main/slice';
import { FeatureCollection, Geometry } from 'geojson';
import { Dataset } from '@/app/types';
import { LayerId } from '@/app/features/MainMap/config';

describe('mainSlice', () => {
    let store: Store;

    beforeEach(() => {
        store = configureStore({ reducer: { main: mainReducer } });
    });

    test('should handle setSearchResultIds', () => {
        const searchResultIds = ['id1', 'id2'];
        store.dispatch(setSearchResultIds(searchResultIds));
        const state = store.getState().main;
        expect(state.searchResultIds).toEqual(searchResultIds);
    });

    test('should handle setSelectedMainstemId', () => {
        const selectedMainstemId = '';
        store.dispatch(setSelectedMainstemId(selectedMainstemId));
        const state = store.getState().main;
        expect(state.selectedMainstemId).toEqual(selectedMainstemId);
    });

    test('should handle setHoverId', () => {
        const hoverId = 2;
        store.dispatch(setHoverId(hoverId));
        const state = store.getState().main;
        expect(state.hoverId).toEqual(hoverId);
    });

    test('should handle setDatasets', () => {
        const datasets: FeatureCollection<Geometry, Dataset> = {
            type: 'FeatureCollection',
            features: [],
        };
        store.dispatch(setDatasets(datasets));
        const state = store.getState().main;
        expect(state.datasets).toEqual(datasets);
        expect(state.filteredDatasets).toEqual(datasets);
    });

    test('should handle setFilteredDatasets', () => {
        const filteredDatasets: FeatureCollection<Geometry, Dataset> = {
            type: 'FeatureCollection',
            features: [],
        };
        store.dispatch(setFilteredDatasets(filteredDatasets));
        const state = store.getState().main;
        expect(state.filteredDatasets).toEqual(filteredDatasets);
    });

    test('should handle setLayerVisibility', () => {
        const visibleLayers = { [LayerId.MajorRivers]: false };
        store.dispatch(setLayerVisibility(visibleLayers));
        const state = store.getState().main;
        expect(state.visibleLayers[LayerId.MajorRivers]).toEqual(false);
    });

    test('should handle setSelectedData', () => {
        const selectedData = {
            datasetDescription: '',
            distributionFormat: '',
            distributionName: '',
            distributionURL: '',
            measurementTechnique: '',
            monitoringLocation: '',
            siteName: '',
            temporalCoverage: '',
            type: '',
            url: '',
            variableMeasured: '',
            variableUnit: '',
            wkt: '',
        };
        store.dispatch(setSelectedData(selectedData));
        const state = store.getState().main;
        expect(state.selectedData).toEqual(selectedData);
    });

    test('should handle setFilter', () => {
        const filter = { selectedTypes: ['type1'] };
        store.dispatch(setFilter(filter));
        const state = store.getState().main;
        expect(state.filter.selectedTypes).toEqual(['type1']);
    });

    test('should handle setView', () => {
        const view = 'table';
        store.dispatch(setView(view));
        const state = store.getState().main;
        expect(state.view).toEqual(view);
    });

    test('should handle setSelectedMainstemBBOX', () => {
        const bbox: [number, number, number, number] = [0, 0, 1, 1];
        store.dispatch(setSelectedMainstemBBOX(bbox));
        const state = store.getState().main;
        expect(state.selectedMainstemBBOX).toEqual(bbox);
    });
});

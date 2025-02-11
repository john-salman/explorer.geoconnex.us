// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// import fetchMock from 'fetch-mock';
// import { fetchDatasets, searchMainstemsCQL } from '../slice';

// const middlewares = [thunk];
// const mockStore = configureMockStore(middlewares);

// describe('mainSlice thunks', () => {
//   afterEach(() => {
//     fetchMock.hardReset(); // Might not be optimal
//   });

//   it('dispatches correct actions on fetchDatasets success', async () => {
//     const mockData = { data: 'some data' };
//     fetchMock.getOnce('https://reference.geoconnex.us/collections/mainstems/items/1', {
//       body: mockData,
//       headers: { 'content-type': 'application/json' },
//     });

//     const expectedActions = [ 
//       { type: fetchDatasets.pending.type },
//       { type: fetchDatasets.fulfilled.type, payload: mockData },
//     ];
//     const store = mockStore({});

//     await store.dispatch(fetchDatasets(1));
//     expect(store.getActions()).toEqual(expectedActions);
//   });

//   it('dispatches correct actions on searchMainstemsCQL success', async () => {
//     const mockData = { data: 'some search results' };
//     const query = 'Willamette'
//     fetchMock.getOnce(`https://reference.geoconnex.us/collections/mainstems/items?filter=name_at_outlet+ILIKE+'%${query}%'&f=json&skipGeometry=true`, {
//       body: mockData,
//       headers: { 'content-type': 'application/json' },
//     });

//     const expectedActions = [
//       { type: searchMainstemsCQL.pending.type },
//       { type: searchMainstemsCQL.fulfilled.type, payload: mockData },
//     ];
//     const store = mockStore({});

//     await store.dispatch(searchMainstemsCQL(query));
//     expect(store.getActions()).toEqual(expectedActions);
//   });
// });
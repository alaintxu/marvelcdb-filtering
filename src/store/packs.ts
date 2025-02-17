const initialState = {
    numberOfPacks: 0
};

// ActionTypes
const NUMBER_OF_PACKS_CHANGED = 'numberOfPacksChanged';

// Actions
export const numberOfPacksChanged = (packs_count: number) => ({
    type: NUMBER_OF_PACKS_CHANGED,
    payload: {
        packs_count: packs_count
    }
});

// Reducer
export default function reducer(state: any = initialState, action: any) {
    // Reducers have to be "PURE FUNCTIONS"!!!
    switch (action.type) {
        case NUMBER_OF_PACKS_CHANGED:
            return {
                ...state,
                numberOfPacks: action.payload.packs_count
            };
        default:
            return state;
    }
}
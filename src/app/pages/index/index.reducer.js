// create statement reducer
export default function IndexReducer(state = {
	banks: [],
	provinces: [],
	initialFetching: false,
	isFetching: false
}, action) {
	switch(action.type) {
		case 'PREFETCH_INDEX': {
			return {...state, initialFetching: action.fetching }
		}

		case 'GET_BANK': {
			return { ...state, banks: action.payload }
		}

		case 'GET_PROVINCE': {
			return { ...state, provinces: action.payload }
		}
	}

	return state;
}
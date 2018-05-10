// create statement reducer
export default function MockReducer(state = {}, action) {
	switch(action.type) {
		case 'mock': {
			return { ...state }
		}
	}

	return state;
}
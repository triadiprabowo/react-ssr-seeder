// create statement reducer
export default function LoanFormReducer(state = { obj: {} }, action) {
	switch(action.type) {
		case 'GET_BANK': {
			return { data: action.payload }
		}
	}

	return state;
}
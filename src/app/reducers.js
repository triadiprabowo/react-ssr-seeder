// import core module
import { combineReducers } from "redux"

// import component reducers
import IndexReducer from './pages/index/index.reducer';

// import shared reducers
import SharedReducers from './shared/reducers';

export default combineReducers({
	SharedReducers,
	IndexReducer
});
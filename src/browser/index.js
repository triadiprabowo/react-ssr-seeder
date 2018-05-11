import React from 'react';
import { hydrate } from 'react-dom';
import Main from '../Main';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from "redux";
import { createLogger as logger } from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

const initialState = window.__PRELOADED_STATE__;
const environment = window.__env__;

let middleware;

if(environment != 'production') {
	middleware = applyMiddleware(promise(), thunk, logger());	
}
else {
	middleware = applyMiddleware(promise(), thunk);
}


hydrate(
	<Provider store={createStore((state=initialState) => state, middleware)}>
		<BrowserRouter>
			<Main initialState={initialState} />
		</BrowserRouter>
	</Provider>,
	document.getElementById('app')
);
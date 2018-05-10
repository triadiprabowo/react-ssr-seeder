import React from 'react';
import { hydrate } from 'react-dom';
import Main from '../Main';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../app/store';

const initialState = window.__PRELOADED_STATE__;

hydrate(
	<Provider store={store}>
		<BrowserRouter>
			<Main initialState={initialState} />
		</BrowserRouter>
	</Provider>,
	document.getElementById('app')
);
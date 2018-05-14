import express from "express";
import cors from "cors";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import serialize from "serialize-javascript";
import Main from '../Main';
import routes from '../app/routes';
import { Provider } from 'react-redux';
import store from '../app/server.store';
import compression from 'compression';

/*
** declare express application
*/
const app = express()

/*
** define express middleware
*/
app.use(compression({ level: 9}));
app.use(cors());

/*
** If environment set is production
** Send gzip version of javascript files
*/
if(process.env.NODE_ENV == 'production') {
	app.get(['*.js'], (req, res, next) => {
		req.url = `${req.url}.gz`;
		res.set('Content-Encoding', 'gzip');
		res.set('Content-Type', 'text/javascript');

		next();
	});
}

/*
** Set dist folder as static folder
** and public path of /dist
*/
app.use('/dist', express.static("dist"));

/*
** Rendering page
** get all routes except asset files
*/
app.get("*", (req, res, next) => {
	const activeRoute = routes.find((route) => matchPath(req.url, route)) || {}
	let promise;

	if(Object.keys(activeRoute).length > 0) {
		promise = activeRoute.onInit
			? activeRoute.onInit(store.dispatch)
			: Promise.resolve();
	}
	else {
		promise = Promise.reject();
	}

	promise.then((data) => {
		let state;

		if(activeRoute.onInit) {
			state = JSON.stringify(store.getState());	
		}		

		const markup = renderToString(
			<Provider store={store}>
				<StaticRouter location={req.url} context={store.getState()}>
					<Main initialState={state} />
				</StaticRouter>
			</Provider>
		);

		res.send(`
			<!DOCTYPE html>
			<html>
				<head>
					<title>${activeRoute.title || 'TP React SSR'}</title>
					<meta name="description" content="${activeRoute.description || 'No description set'}">

					<script type="text/javascript">
						window.__PRELOADED_STATE__ = ${state || null};
					</script>

					<script type="text/javascript">
						window.__env__ = '${process.env.NODE_ENV}';
					</script>
				</head>

				<body>
					<div id="app">${markup}</div>

					<script src="/dist/polyfills.bundle.js" defer></script>
					<script src="/dist/main.bundle.js" defer></script>
					<script src="/dist/styles.bundle.js" async></script>
				</body>
			</html>
		`)
	}).catch(next);
});

/*
** Listen port based on environment of SERVER_PORT
*/
app.listen(process.env.SERVER_PORT, () => {
	console.log(`Server is listening on port: ${process.env.SERVER_PORT}`)
});
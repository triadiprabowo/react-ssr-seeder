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

const app = express()

app.use(compression({ level: 9}));
app.use(cors())
app.use('/public', express.static("public"));

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

					<script src="/public/main.bundle.js" defer></script>
					<script src="/public/styles.bundle.js" async></script>
				</body>
			</html>
		`)
	}).catch(next);
});

app.listen(3000, () => {
	console.log(`Server is listening on port: 3000`)
});
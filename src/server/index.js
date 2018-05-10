import express from "express";
import cors from "cors";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import serialize from "serialize-javascript";
import Main from '../Main';
import routes from '../app/routes';
import { Provider } from 'react-redux';
import store from '../app/store';
import compression from 'compression';

const app = express()

app.use(compression({ level: 9}));
app.use(cors())
app.use('/public', express.static("public"))

app.get("*", (req, res, next) => {
	const activeRoute = routes.find((route) => matchPath(req.url, route)) || {}

	const promise = activeRoute.onInit
		? activeRoute.onInit(store.dispatch)
		: Promise.resolve()

	promise.then((data) => {
		const state = JSON.stringify(store.getState()).replace(/</g, '\\u003c');

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
					<meta name="description" content="${activeRoute.description}">

					<script>
						window.__PRELOADED_STATE__ = ${state}
					</script>
				</head>

				<body>
					<div id="app">${markup}</div>

					<script src="/public/bundle.js" async defer></script>
				</body>
			</html>
		`)
	}).catch(next)
})

app.listen(3000, () => {
	console.log(`Server is listening on port: 3000`)
});
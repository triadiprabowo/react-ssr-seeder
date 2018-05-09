import express from "express";
import cors from "cors";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import serialize from "serialize-javascript";
import App from '../shared/App';
import routes from '../shared/routes';
import { Provider } from 'react-redux';
import store from '../shared/store';

const app = express()

app.use(cors())
app.use(express.static("public"))

app.get("*", (req, res, next) => {
	const activeRoute = routes.find((route) => matchPath(req.url, route)) || {}

	const promise = activeRoute.fetchInitialData
		? activeRoute.fetchInitialData(req.path)
		: Promise.resolve()

	promise.then((data) => {
		const context = { data }

		const markup = renderToString(
			<Provider store={store}>
				<StaticRouter location={req.url} context={context}>				
					<App />
				</StaticRouter>
			</Provider>
		);

		res.send(`
			<!DOCTYPE html>
			<html>
				<head>
					<title>SSR with RR</title>
					<script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
					<script>
						window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState()).replace(/</g, '\\u003c')}
					</script>
				</head>

				<body>
					<div id="app">${markup}</div>

					<script src="/bundle.js" defer></script>
				</body>
			</html>
		`)
	}).catch(next)
})

app.listen(3000, () => {
	console.log(`Server is listening on port: 3000`)
})

/*
  1) Just get shared App rendering to string on server then taking over on client.
  2) Pass data to <App /> on server. Show diff. Add data to window then pick it up on the client too.
  3) Instead of static data move to dynamic data (github gists)
  4) add in routing.
*/
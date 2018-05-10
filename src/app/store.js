import { applyMiddleware, createStore } from "redux";
import { createLogger as logger } from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

// import reducer index
import reducers from "./reducers";

// let middleware = applyMiddleware(promise(), thunk, logger());
let middleware = applyMiddleware(promise(), thunk);

export default createStore(reducers, middleware);
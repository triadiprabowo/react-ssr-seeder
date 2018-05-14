# React SSR
![React SSR](https://img.shields.io/badge/react--ssr-beta-orange.svg) ![Build Success](https://img.shields.io/badge/build-success-green.svg) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)
React server side rendering seeder using ReactDOM/server and Express, state management using React Redux and Redux Thunk. Support initial async process or fetching, unit test using Enzyme and Jest, style pre-processor using SASS / Stylus supported.

### How-To Install
* `git clone https://github.com/triadiprabowo/react-ssr-seeder.git && cd react-ssr-seeder`
* `npm install`

### Command List
* `npm start` - Start development server (SSR-Enabled) on localhost port 3000 (default)
* `npm test` - Start unit test with jest

### Production Environment/Build
* `npm run build:prod` - Build dependencies with production environment
* `npm run start:prod` - Start production server using PM2
* `npm run restart:prod` - Restart production server
* `npm run stop:prod` - Stop production server

### Environment Config
Located in package.json, you may edit to accepted environment used in this project.

| Environment Name | Default Value |
|------------------|---------------|
| NODE_ENV         | development   |
| SERVER_PORT      | 3000          |

### Global Variables
|   Name    | Object    |   Value   |
|-----------|-----------|-----------|
| \__PRELOADED_STATE__ | `window` | Initial State from `onInit` method called in router
| staticContext | `this.props` | Initial state from `onInit` method called in router (accessible from server side only)
| \__isBrowser__ | none | `true` or `false` (get client platform)

### Style Guidelines / Project Structure
This project used style guidelines or project structure similar like Angular project, you may check [Angular.io](https://angular.io) or [Angular Style Guideline](https://angular.io/guide/styleguide), main differences are we are using `*.action.js` `*.reducer.js` as our service and model.
```
src = root folder
|____browser = browser (client-side) react initialization including redux store for client-side
|____server = server (server-side) rendering and react initialization
|____app = application folder
      |_____pages = pages folder (whole page component)
      |_____shared = shared folder contains reducer, components (containers), actions, etc.
      |_____reducers.js = reducers from shared and pages folder, include here for new reducer
      |_____routes.js = router config
      |_____server.store.js = Store will be used in server-side render (../server/index.js) 
```

### Initial State / Async Operations onInit
#### 1. Defined from router
You must include `onInit` in src/app/routes.js to run initial async operations.
```javascript
import ImportedComponent from '...';
import exampleAction from '...';
// react-router options
{
    path: '/',
    exact: true|false,
    component: ImportedComponent,
    title: 'Page title',
    description: "Meta Description",
    onInit: (dispatch) => exampleAction(dispatch)
}
```

#### 2. Initial Action Process
Create action within pages folder example `index.action.js`, you may look example at `src/app/pages/index/index.action.js`.

```javascript
import Q from 'q;

export function getData() {
        return (dispatch) => {
            // ... action here
        }
    }
    
export function getData2() {
    return (dispatch) => {
        // ... action here
    }
}
    
export default function OnInit(dispatch) {
    // ...
    /* for multiple request or async process use Q
    ** example:
    */ 
    Q.all([getData()(dispatch), getData2()(dispatch)].then((data) => dispatch({ ... }));
    
    // because we use redux-thunk so initial call procedure is like this-> actionName()(dispatch) to make sure initial state set properly on client-side
}
```

#### 3. Get Initial State from Component (Declaration Example)
```javascript
class ExampleComponent extends React.Component {
    constructor(props) {
		super(props)
        
        // initial state
		let initialState;
        
        // check client platform if it is browser get from window object
		if(__isBrowser__) {
			initialState = window.__PRELOADED_STATE__['ExampleReducer'];
            
            // dont forget to delete preloaded state after initiated
			delete window.__PRELOADED_STATE___;
		} else {
			initialState = this.props.staticContext['ExampleReducer'];
		}
        
        // set to react state or any other methods
		this.state = { ...initialState };
	}
}
```
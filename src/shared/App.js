import React, { Component } from 'react'
import routes from './routes'
import { Route, Link, Redirect, Switch } from 'react-router-dom'
import Header from './Header'
import NoMatch from './NoMatch'

class App extends Component {
	render() {
		return (
			<div>
				<Header />

				<Switch>
					{routes.map(({ path, exact, component: Component, ...rest }) => (
						<Route key={path} path={path} exact={exact} render={(props) => (
							<Component {...props} {...rest} />
						)} />
					))}
					
					<Route render={(props) => <NoMatch {...props} /> } />
				</Switch>
			</div>
		)
	}
}

export default App
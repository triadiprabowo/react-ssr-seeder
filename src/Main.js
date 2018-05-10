import React, { Component } from 'react'
import routes from './app/routes'
import { Route, Link, Redirect, Switch } from 'react-router-dom'
import NotFound from './app/pages/404/NotFound.component';

class Main extends Component {
	render() {
		return (
			<div>
				<Switch>
					{routes.map(({ path, exact, component: Component, ...rest }) => (
						<Route key={path} path={path} exact={exact} render={(props) => (
							<Component {...props} {...rest} initialState={this.props.initialState} />
						)} />
					))}
					
					<Route render={(props) => <NotFound {...props} /> } />
				</Switch>
			</div>
		)
	}
}

export default Main
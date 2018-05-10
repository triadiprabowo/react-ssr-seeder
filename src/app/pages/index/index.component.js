import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as IndexActions from './index.action';

class IndexComponent extends Component {
	constructor(props) {
		super(props)

		let initialState;

		if (__isBrowser__) {
			initialState = window.__PRELOADED_STATE__['IndexReducer'];

			delete window.__PRELOADED_STATE___;
		} else {
			initialState = this.props.staticContext['IndexReducer'];
		}

		this.state = { ...initialState }
	}

	render() {
		const { banks, isFetching, initialFetching } = this.state;

		if(initialFetching) {
			return <p>Loading</p>
		}

		return (
			<ul style={{display: 'flex', flexWrap: 'wrap'}}>
				{banks.map(({ id, code, name}) => (
					<li key={id} style={{margin: 30}}>
						<ul>
							<li>{name} {code}</li>
						</ul>
					</li>
				))}
			</ul>
		)
	}
}

function mapStateToProps(state, props) {
	return { IndexReducer: props.initialState['IndexReducer'] };
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ ...IndexActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexComponent)
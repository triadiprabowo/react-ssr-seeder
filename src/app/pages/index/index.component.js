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

		this.state = { ...initialState };
	}

	componentWillMount() {
		this.props.getBank();
	}

	render() {
		const { banks, isFetching, initialFetching } = this.state;

		if(initialFetching) {
			return <p>Loading...</p>
		}

		return (
			<table className={'table table--bordered table--odd-even'}>
				<thead>
					<tr>
						<th>Code</th>
						<th>Name</th>
					</tr>
				</thead>

				<tbody>
				{banks.map(({ id, code, name}) => (
					<tr key={id}>
						<td>{code}</td>
						<td>{name}</td>
					</tr>
				))}
				</tbody>
			</table>
		)
	}
}

function mapStateToProps(state, props) {
	return {
		IndexReducer: state['IndexReducer']
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ ...IndexActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexComponent)
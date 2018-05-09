import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ManualFormComponent extends Component {
	constructor(props) {
		super(props)

		let repos, state;

		if (__isBrowser__) {
			repos = window.__INITIAL_DATA__;
			state = window.__PRELOADED_STATE__;

			delete window.__INITIAL_DATA__;
			delete window.__PRELOADED_STATE__;
		} else {
			repos = this.props.staticContext.data;
			state = this.props.staticContext.state;
		}

		this.state = {
			repos,
			loading: repos ? false : true,
		}

		this.fetchRepos = this.fetchRepos.bind(this)
	}

	componentDidMount () {
		// if (!this.state.repos) {
			this.fetchRepos(this.props.match.params.id)
		// }
	}

	componentDidUpdate (prevProps, prevState) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.fetchRepos(this.props.match.params.id)
		}
	}

	fetchRepos (lang) {
		this.setState(() => ({
			loading: true
		}))

		this.props.fetchInitialData(lang)
		.then((results) => {
			this.props.addStatement(results);

			this.setState(() => ({
				loading: false
			}))
		})
	}

	render() {
		const { loading, repos } = this.state

		if (loading === true) {
			return <p>LOADING</p>
		}

		return (
			<ul style={{display: 'flex', flexWrap: 'wrap'}}>
				{repos.map(({ id, code, name}) => (
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

function mapStateToProps(state) {
	return {
		statements: state.StatementReducer
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ addStatement: addStatement }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid)
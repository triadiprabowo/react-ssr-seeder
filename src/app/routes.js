import IndexComponent from './pages/index/index.component';
import ManualFormComponent from './pages/manual-form/manual-form.component';
import IndexOnInit from './pages/index/index.action';

const routes =  [
	{
		path: '/',
		exact: true,
		component: IndexComponent,
		title: "TP React SSR :: Index",
		description: "Meta description example", // meta description example
		onInit: (dispatch) => IndexOnInit(dispatch) // any http request here will be ssr'ed
	}
]

export default routes
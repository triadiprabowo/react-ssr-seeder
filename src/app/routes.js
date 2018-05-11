import IndexComponent from './pages/index/index.component';
import IndexOnInit from './pages/index/index.action';
import NotFoundComponent from './pages/404/NotFound.component';

const routes =  [
	{
		path: '/',
		exact: true,
		component: IndexComponent,
		title: "TP React SSR :: Index",
		description: "Meta description example",
		onInit: (dispatch) => IndexOnInit(dispatch)
	},
	{
		path: '/404',
		component: NotFoundComponent,
		title: '404 Not Found',
		description: '404 Not Found'
	}
]

export default routes
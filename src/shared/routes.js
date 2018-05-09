import Home from './Home';
import ManualFormComponent from './pages/manual-form/manual-form.component';
import { getBank } from './actions/loan-form.action';

const routes =  [
	{
		path: '/',
		exact: true,
		component: Home,
	},
	{
		path: '/manual-form',
		component: ManualFormComponent,
		fetchInitialData: (path = '') => getBank()
	}
]

export default routes
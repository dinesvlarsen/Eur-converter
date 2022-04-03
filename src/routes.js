import Home from './views/Home.vue';
import Error from './components/Error.vue';

export default [
	{ name: 'home', path: '/', component: Home },
	{ name: 'error', path: '/error', component: Error },
];

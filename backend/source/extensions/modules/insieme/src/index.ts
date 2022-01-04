import { defineModule } from '@directus/extensions-sdk';
import ModuleComponent from './module.vue';

export default defineModule({
	id: 'biomarkers',
	name: 'Biomarkers',
	icon: 'biotech',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
		{
			path: 'v2',
			component: ModuleComponent,
		},
	],
});

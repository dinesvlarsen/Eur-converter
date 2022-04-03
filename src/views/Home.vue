<template>
	<converter />
</template>

<script>
import Converter from '../components/Converter.vue';
export default {
	components: {
		Converter,
	},
	data() {
		return {
			appName: import.meta.env.VITE_APP_NAME,
		};
	},
};
</script>

<template>
	<h1>Error something went wrong</h1>
	<button
		type="button"
		@click="hasHistory() ? $router.go(-1) : $router.push('/')"
		class="my-5 btn btn-outline-success"
	>
		&laquo; Back
	</button>
</template>

<script>
export default {
	methods: {
		hasHistory() {
			return window.history.length > 2;
		},
	},
};
</script>

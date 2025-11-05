<script>
	import { enhance } from '$app/forms';

	let { loading = $bindable(false) } = $props();
</script>

<form method="POST" action="?/refresh" use:enhance={() => {
	loading = true;
	return async ({ update }) => {
		loading = false;
		await update();
	};
}}>
	<button
		type="submit"
		class="btn btn-primary gap-2"
		disabled={loading}
	>
		{#if loading}
			<span class="loading loading-spinner loading-sm"></span>
		{/if}
		{loading ? "Refreshing..." : "Refresh Prices"}
	</button>
</form>

<style>
	form {
		display: contents;
	}
</style>

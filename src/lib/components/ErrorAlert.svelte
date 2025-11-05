<script>
	let { message, dismissible = true } = $props();
	let visible = $state(true);

	const dismiss = () => {
		visible = false;
	};
</script>

{#if visible && message}
	<div class="alert alert-error mb-6">
		<span>{message}</span>
		{#if dismissible}
			<button type="button" class="btn btn-sm btn-ghost" onclick={dismiss}>
				✕
			</button>
		{/if}
	</div>
{/if}

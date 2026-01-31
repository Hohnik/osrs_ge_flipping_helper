<script>
	let { strategy } = $props();
</script>

<div class="card card-border bg-base-100 w-96">
	<div class="card-body">
		<h2 class="card-title">{strategy.name}</h2>
		<p>{strategy.description}</p>
		<div class="card-actions justify-end">
			<a class="btn btn-primary" href={strategy.path}>Try</a>
		</div>
	</div>
</div>

<script>
	import "../app.css";
	import { injectAnalytics } from "@vercel/analytics/sveltekit";
	injectAnalytics();

	let { children } = $props();
</script>

<div class="app">
	<div class="navbar bg-base-100 shadow-md">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost normal-case text-xl">OSRS Trade</a>
		</div>
		<div class="flex-none gap-2">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/">Home</a></li>
				<li><a href="/jewelry">Jewelry Crafting</a></li>
				<li><a href="/decanting">Decanting</a></li>
				<li><a href="/cleaning">Cleaning</a></li>
				<li><a href="/cutting">Cutting</a></li>
				<li><a href="/alching">Alching</a></li>
			</ul>
		</div>
	</div>

	<main>
		{@render children()}
	</main>
</div>

<script>
	import "../app.css";
	import { asset } from "$app/paths";

	let { children } = $props();
</script>

<div class="app">
	<div class="navbar bg-base-100 shadow-md">
		<div class="navbar-start">
			<a
				href="/"
				class="btn btn-ghost normal-case text-lg flex items-center gap-2 px-2"
			>
				<img alt="OSRS coinstack" src={asset("/logo.svg")} />
				OSRS Trade
			</a>
		</div>
		<div class="navbar-center navbar-end gap-2">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/decanting">Potion Decanting</a></li>
				<li><a href="/cleaning">Herb Cleaning</a></li>
				<li><a href="/jewelry">Jewelry Crafting</a></li>
				<li><a href="/cutting">Gem Cutting</a></li>
				<li><a href="/alching">High Alching</a></li>
			</ul>
		</div>
	</div>

	<main>
		{@render children()}
	</main>
</div>

<script>
	import "../app.css";
	import { asset } from "$app/paths";

	let { children } = $props();
</script>

<div class="navbar bg-base-100 shadow-sm mb-4">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost text-xl">
			<img alt="OSRS coinstack" src={asset("/favicon.svg")} /> RuneRich
		</a>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<li>
				<details>
					<summary>Stragegies</summary>
					<ul class="bg-base-100 rounded-t-none p-2">
						<li><a href="/decanting">Potion Decanting</a></li>
						<li><a href="/cleaning">Herb Cleaning</a></li>
						<li><a href="/jewelry">Jewelry Crafting</a></li>
						<li><a href="/alching">High Alching</a></li>
					</ul>
				</details>
			</li>
		</ul>
	</div>
</div>

<div class="container mx-auto px-4">
	{@render children()}
</div>

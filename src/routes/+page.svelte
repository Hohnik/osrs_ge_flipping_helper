<script>
	import heroImage from "$lib/images/osrs_map.webp";
	import { strategies } from "./strategies.js";
	import StrategyCard from "$lib/components/StrategyCard.svelte";
</script>

<svelte:head>
	<title>RuneRich</title>
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	{#each strategies as strategy (strategy.path)}
		<StrategyCard {strategy} />
	{/each}
</div>

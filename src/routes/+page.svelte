<script>
	const strategies = [
		{
			name: "Potion Decanting",
			path: "/decanting",
			description: "Buy potions in lower doses and decant them into 4-dose variants for profit.",
			difficulty: "Easy"
		},
		{
			name: "Herb Cleaning",
			path: "/cleaning",
			description: "Clean grimy herbs and sell them for profit. Track volume to find the best herbs to clean.",
			difficulty: "Easy"
		},
		{
			name: "Gem Cutting",
			path: "/cutting",
			description: "Cut uncut gems and sell them for profit. Requires Crafting skill.",
			difficulty: "Easy"
		},
		{
			name: "Alching",
			path: "/alching",
			description: "Buy items cheap and alch them for profit. Instant conversion to gold with no reselling needed.",
			difficulty: "Easy"
		}
	];
</script>

<svelte:head>
	<title>Home - OSRS Trade</title>
</svelte:head>

<section class="container mx-auto p-4">
	<div class="hero bg-base-200 rounded-lg mb-8">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold mb-4">OSRS Trade Strategies</h1>
				<p class="py-4">Maximize your GPs with data-driven trading strategies in Old School RuneScape.</p>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each strategies as strategy (strategy.path)}
			<a href={strategy.path} class="no-underline">
				<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition hover:scale-105 cursor-pointer h-full">
					<div class="card-body flex flex-col">
						<h2 class="card-title text-xl">{strategy.name}</h2>
						<p class="text-sm text-gray-600 mb-4 flex-grow">{strategy.description}</p>
						<div class="badge badge-secondary">{strategy.difficulty}</div>
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>

<style></style>

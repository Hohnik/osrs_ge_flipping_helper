<script>
	import HeroImage from "$lib/images/osrs_map.webp";

	const strategies = [
		{
			name: "Jewelry Crafting",
			path: "/jewelry",
			description:
				"Craft jewelry from uncut gems and gold bars. Profitable skill training with consistent demand.",
			difficulty: "Easy",
			skill: "Crafting",
			skillIcon: "https://oldschool.runescape.wiki/images/Crafting_icon.png",
			skillLevel: "20+",
		},
		{
			name: "Potion Decanting",
			path: "/decanting",
			description:
				"Buy potions in lower doses and decant them into 4-dose variants for profit.",
			difficulty: "Easy",
			skill: "Herblore",
			skillIcon: "https://oldschool.runescape.wiki/images/Herblore_icon.png",
			skillLevel: "1+",
		},
		{
			name: "Herb Cleaning",
			path: "/cleaning",
			description: "Clean grimy herbs and sell them for profit.",
			difficulty: "Easy",
			skill: "Herblore",
			skillIcon: "https://oldschool.runescape.wiki/images/Herblore_icon.png",
			skillLevel: "1+",
		},
		{
			name: "Gem Cutting",
			path: "/cutting",
			description: "Cut uncut gems and sell them for profit.",
			difficulty: "Easy",
			skill: "Crafting",
			skillIcon: "https://oldschool.runescape.wiki/images/Crafting_icon.png",
			skillLevel: "10+",
		},
		{
			name: "Alching",
			path: "/alching",
			description:
				"Buy items cheap and alch them for profit. Instant conversion to gold with no reselling needed.",
			difficulty: "Easy",
			skill: "Magic",
			skillIcon: "https://oldschool.runescape.wiki/images/Magic_icon.png",
			skillLevel: "55+",
		},
	];
</script>

<svelte:head>
	<title>RuneRich</title>
</svelte:head>

<!-- Hero Image -->
<div class="hero min-h-screen" stype="background-image: url({HeroImage})">
	<div class="max-w-md">
		<h1 class="text-5xl font-bold mb-4">OSRS Trade Strategies</h1>
		<p class="py-4">
			Maximize your GPs with data-driven trading strategies in Old School
			RuneScape.
		</p>
	</div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	{#each strategies as strategy (strategy.path)}
		<a href={strategy.path} class="no-underline">
			<div
				class="card bg-base-100 shadow-xl hover:shadow-2xl transition hover:scale-105 cursor-pointer h-full"
			>
				<div class="card-body flex flex-col">
					<div class="flex items-start justify-between mb-2">
						<h2 class="card-title text-xl">{strategy.name}</h2>
						{#if strategy.skillIcon}
							<img
								src={strategy.skillIcon}
								alt={strategy.skill}
								class="w-8 h-8"
								loading="lazy"
							/>
						{/if}
					</div>

					<p class="text-sm text-gray-600 mb-4 flex-grow">
						{strategy.description}
					</p>

					<div class="flex items-center justify-between">
						<div class="badge badge-secondary">{strategy.difficulty}</div>
						{#if strategy.skill}
							<div class="text-xs font-semibold text-primary">
								{strategy.skill}
								{strategy.skillLevel}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</a>
	{/each}
</div>

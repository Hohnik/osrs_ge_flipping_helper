class Strategy {
  constructor(name, description, path, difficulty, skill = null, skillLevel = null, skillIcon = null) {
    this.name = name;
    this.description = description;
    this.path = path;
    this.difficulty = difficulty;
    this.skill = skill;
    this.skillLevel = skillLevel;
    this.skillIcon = skillIcon;
  }
}

const jewelryCrafting = new Strategy(
  "Jewelry Crafting",
  "Craft jewelry from uncut gems and gold bars. Profitable skill training with consistent demand.",
  "/jewelry",
  "Easy",
  "Crafting",
  "20+",
  "https://oldschool.runescape.wiki/images/Crafting_icon.png",
);

const potionDecanting = new Strategy(
  "Potion Decanting",
  "Buy potions in lower doses and decant them into 4-dose variants for profit.",
  "/potion-decanting",
  "Easy",
  "https://oldschool.runescape.wiki/images/Herblore_icon.png",
  null,
  null
);

const herbCleaning = new Strategy(
  "Herb Cleaning",
  "Clean grimy herbs and sell them for profit.",
  "/herb-cleaning",
  "Easy",
  "Herblore",
  "1+",
  "https://oldschool.runescape.wiki/images/Herblore_icon.png",
);

const highAlching = new Strategy(
  "High Alching",
  "Use the High Level Alchemy spell to convert items into gold coins for profit.",
  "/high-alching",
  "Easy",
  "Magic",
  "55+",
  "https://oldschool.runescape.wiki/images/Magic_icon.png",
);


export const strategies = [
  jewelryCrafting,
  potionDecanting,
  herbCleaning,
  highAlching,
];

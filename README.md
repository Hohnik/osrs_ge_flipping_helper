# OSRS Trade Strategies

A data-driven tool for identifying profitable trading strategies in Old School RuneScape (OSRS). Fetch real-time item prices from the OSRS Wiki API and instantly see profit margins for various money-making methods.

## Features

- **Real-time Price Data**: Fetches live item prices from the OSRS Wiki API
- **Multiple Strategies**: Compare profit margins across different trading methods
- **Volume Tracking**: View 24-hour trading volumes to assess market demand
- **Responsive UI**: Clean, intuitive interface built with SvelteKit and DaisyUI
- **Instant Calculation**: Get profit percentages and flat gold amounts immediately

## Current Trading Strategies

### Potion Decanting
Buy potions in lower doses and decant them into 4-dose variants. Profitable when buy costs for lower doses are cheap enough compared to 4-dose sale prices.

### Herb Cleaning
Clean grimy herbs and sell clean herbs for profit. Track volume to identify herbs with consistent demand and optimal profit margins.

### Gem Cutting
Cut uncut gems into cut gems for immediate profit. High-margin gems include diamonds, rubies, sapphires, and emeralds.

### Alching
Buy items cheap and convert them to gold via high alchemy. This strategy works best with items where the GE price is significantly lower than the alch value.

## Planned Features

Future versions will add support for additional trading strategies:

- **Flipping/Merching**: Buy items at low prices and sell at high prices
- **Crafting Flips**: Buy raw materials, craft items, compare costs vs. finished product value
- **Herblore Flips**: Buy herbs, grind to powder, create potions, compare profit at each stage
- **Cooking**: Buy raw food, cook it, sell cooked for profit
- **Tanning/Leather Working**: Buy hides, tan them, sell leather
- **Smithing**: Buy ore, smelt into bars, forge into items, compare profit margins
- **Log Processing**: Buy logs, process into planks, sell
- **Rune Crafting**: Buy essence, craft runes, compare against market prices

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd osrs_trade_svelte
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally

## Deployment

### Environment Setup
No environment variables are required. The app connects directly to the public OSRS Wiki API.

### Building
```bash
npm run build
```

This creates an optimized production build in the `.svelte-kit/output` directory.

### Deployment Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
Vercel automatically detects SvelteKit and deploys it optimally.

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

#### Docker
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "build"]
```

Build and run:
```bash
docker build -t osrs-trade .
docker run -p 3000:3000 osrs-trade
```

#### Self-hosted (Node.js)
```bash
npm run build
npm install -g pm2
pm2 start build/index.js --name "osrs-trade"
pm2 startup
pm2 save
```

## Technology Stack

- **Framework**: SvelteKit 2.43.2
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.13 with DaisyUI 5.3.10
- **Language**: JavaScript (ES modules)
- **API**: OSRS Wiki API (https://prices.runescape.wiki)

## Project Structure

```
src/
├── routes/              # Page components and routes
│   ├── +layout.svelte   # Root layout with navigation
│   ├── +page.svelte     # Home page with strategy cards
│   ├── decanting/       # Potion decanting strategy
│   ├── cleaning/        # Herb cleaning strategy
│   ├── cutting/         # Gem cutting strategy
│   └── alching/         # Alching strategy
├── lib/
│   ├── components/      # Reusable UI components
│   ├── osrsApi.js       # Core API utilities and calculations
│   ├── alchingApi.js    # Alching-specific logic
│   ├── herbsApi.js      # Herb cleaning logic
│   └── gemsApi.js       # Gem cutting logic
└── app.css              # Global styles
```

## How It Works

1. **Data Fetching**: When you visit a strategy page, the app fetches current prices from the OSRS Wiki API
2. **Profit Calculation**: Prices are compared to calculate profit margins (percentage and flat gold)
3. **Volume Analysis**: 24-hour trading volumes are fetched to assess market liquidity
4. **Display**: Items are sorted by profitability, making it easy to identify the best trades
5. **Real-time Updates**: Click "Refresh Prices" to get the latest data

## API Information

The application uses the public OSRS Wiki API:
- **Base URL**: `https://prices.runescape.wiki/api/v1/osrs`
- **Endpoints**:
  - `/latest` - Current buy/sell prices for all items
  - `/mapping` - Item ID mapping with alch values and item properties
  - `/timeseries` - Historical price and volume data

No API key required. All data is publicly available.

## Contributing

Ideas for new strategies or improvements? Feel free to submit issues or pull requests.

## License

MIT

## Disclaimer

This tool is for informational purposes only. Trading strategies and profit margins are based on current market data and may change rapidly. Always verify prices in-game before executing trades.

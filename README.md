# Pokédex App 🏆

A modern, interactive Pokédex built with Next.js featuring Pokemon Go-style scanning animations, comprehensive Pokemon data, and beautiful UI components.

## ✨ Features

- **Interactive Scanning Animation**: Pokemon Go-inspired scanning interface with horizontal net patterns and vertical scanning bars
- **Comprehensive Pokemon Database**: Detailed information for all Pokemon across different regions
- **Region-Based Organization**: Browse Pokemon by their respective regions
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS for a sleek experience
- **Performance Optimized**: Service worker caching for Pokemon images to reduce network requests
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pokedex
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Data**: JSON-based Pokemon database
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
pokedex/
├── app/                    # Next.js app directory
│   ├── components/         # Reusable React components
│   ├── hooks/             # Custom React hooks
│   ├── pokedex/           # Dynamic routes for regions/Pokemon
│   └── types/             # TypeScript type definitions
├── data-extractions/      # Web scraping scripts and data
├── public/                # Static assets and Pokemon data
├── scripts/               # Utility scripts
└── swiper-demo/           # Demo swiper implementation
```

## 🎯 Usage

Navigate through different Pokemon regions, view detailed Pokemon information, and enjoy the immersive scanning animation experience. The app features a smooth, interactive interface with optimized performance through intelligent caching.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for Pokemon fans everywhere.

# Peer Web Frontend

The official web client for **Peer Network**, built with Vue.js.

> 🚧 **Status:** In Development

---

## Tech Stack

- **Vue 3** (Composition API)
- **Vite** 
- **Pinia**
- **Vue Router 4**
- **SCSS**
- **GraphQL** + **Firebase**

**Architecture:** Feature-driven + Repository pattern

---

## Project Structure

```
peer-web/src/
├── api/                  # GraphQL client & API calls
├── components/
│   ├── base/             # Design system
│   ├── common/           # App-wide (header, sidebar)
│   └── features/         # Feature modules (auth, posts, wallet)
├── composables/          # Vue composition functions
├── layouts/              # Page layouts
├── pages/                # Route views
├── router/               # Vue Router config
├── stores/               # Pinia stores
└── helpers/              # Utilities
```

---

## Setup

```bash
cd peer-web
cp .env.example .env.development  # Configure API & Firebase keys
npm install
npm run dev
```

**Dev URL:** http://localhost:5173

---

## Build

```bash
npm run build
npm run preview
```

---

## Contributing

See [Git Guidelines](https://github.com/peer-network/how_to_git)

---

## License

Proprietary — Peer Network GmbH

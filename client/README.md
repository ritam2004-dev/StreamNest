# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---
```
src/
├── api/
│   ├── axios.js
│   ├── auth.api.js
│   ├── video.api.js
│   ├── comment.api.js
│   ├── like.api.js
│   ├── subscription.api.js
│   └── playlist.api.js
│
├── assets/
│   └── vtube-logo.png
│
├── components/
│   ├── navbar/
│   │   └── Navbar.jsx
│   │
│   ├── sidebar/
│   │   ├── Sidebar.jsx
│   │   └── MobileSidebar.jsx
│   │
│   ├── video/
│   │   ├── VideoCard.jsx
│   │   ├── VideoGrid.jsx
│   │   └── VideoPlayer.jsx
│   │
│   ├── comment/
│   │   ├── CommentList.jsx
│   │   ├── CommentForm.jsx
│   │   └── CommentItem.jsx
│   │
│   ├── playlist/
│   │   ├── PlaylistModal.jsx
│   │   └── PlaylistCard.jsx
│   │
│   └── ui/
│       ├── LikeButton.jsx
│       ├── SubscribeButton.jsx
│       ├── EmptyState.jsx
│       ├── Loader.jsx
│       └── Modal.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
│
├── hooks/
│   ├── useFetch.js
│   └── useDebounce.js
│
├── layout/
│   ├── MainLayout.jsx
│   ├── AuthLayout.jsx
│   └── DashboardLayout.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Watch.jsx
│   ├── Upload.jsx
│   ├── Channel.jsx
│   ├── Dashboard.jsx
│   ├── Playlists.jsx
│   ├── Profile.jsx
│   ├── SearchResults.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── NotFound.jsx
│
├── routes/
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
│
├── utils/
│   ├── formatDate.js
│   ├── formatViews.js
│   └── normalize.js
│
├── index.css
└── main.jsx

```
---
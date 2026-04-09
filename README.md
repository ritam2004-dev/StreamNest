🎬 StreamNest

StreamNest is a full-stack video streaming platform inspired by YouTube, where users can upload, watch, and interact with videos seamlessly.

This project includes:
	•	🎨 client/ → React + Vite frontend
	•	⚙️ server/ → Node.js + Express backend

⸻

🚀 Features
	•	🔐 JWT Authentication (Access + Refresh Token)
	•	📹 Video Upload with Cloudinary Integration
	•	👍 Like / Comment System
	•	📂 Playlists Management
	•	📺 Channel & Subscription System
	•	📊 User Dashboard APIs
	•	🔍 Search Channels & Profiles
	•	🕓 Watch History Tracking

⸻

🛠 Tech Stack

Frontend
	•	React
	•	Vite
	•	Tailwind CSS
	•	Axios
	•	React Router

Backend
	•	Node.js
	•	Express.js
	•	MongoDB (Mongoose)
	•	JWT Authentication
	•	Multer (File Upload)
	•	Cloudinary (Media Storage)

.
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
│
└── server/
    ├── src/
    │   ├── controllers/
    │   ├── db/
    │   ├── middlewares/
    │   ├── models/
    │   ├── routes/
    │   ├── utils/
    │   ├── app.js
    │   └── index.js
    └── package.json
## Setup

---


1. Clone this repository:

git clone https://github.com/ritam2004-dev/streamnest.git
cd streamnest

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Install frontend dependencies:

```bash
cd ../client
npm install
```

## Environment Variables (server/.env)

Create `server/.env` with:

```env
PORT=8000
MONGODB_URI=
CORS_ORIGIN=http://localhost:5174

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Run Locally

1. Start backend (from `server/`):

```bash
npm run dev
```

2. Start frontend (from `client/`):

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:8000` by default.

## API Base Path

Backend routes are mounted under:

- `/api/v1/healthcheck`
- `/api/v1/users`
- `/api/v1/videos`
- `/api/v1/comments`
- `/api/v1/likes`
- `/api/v1/playlists`
- `/api/v1/subscriptions`
- `/api/v1/tweets`
- `/api/v1/dashboard`

## Author

Ritam Khatua
GitHub: https://github.com/ritam2004-dev

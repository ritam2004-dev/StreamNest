⚙️ StreamNest — Backend API

This repository contains the backend API for StreamNest, a full-stack video streaming platform inspired by YouTube.

It is built using Node.js, Express, and MongoDB, and provides REST APIs for managing users, videos, comments, likes, playlists, and subscriptions.

⸻

📌 About

StreamNest backend handles all server-side logic including:
	•	Authentication & Authorization
	•	Video management
	•	User interactions (likes, comments, subscriptions)
	•	Media storage via Cloudinary

This API is designed to work with a frontend client (React-based or mobile apps).

⸻

🚀 Features
	•	🔐 JWT Authentication (Access + Refresh Token)
	•	👤 User Registration & Profile Management
	•	📹 Video Upload & Metadata Handling
	•	💬 Comments System
	•	👍 Like / Unlike Functionality
	•	📂 Playlist Management
	•	🔔 Channel Subscriptions
	•	📊 Dashboard APIs
	•	☁️ Cloudinary Integration (Images & Videos)

⸻

🛠 Tech Stack
	•	Node.js
	•	Express.js
	•	MongoDB (Mongoose)
	•	JWT (Authentication)
	•	Multer (File Upload)
	•	Cloudinary (Media Storage)


## Quick start

1. Clone the repository:

   git clone https://github.com/ritam2004-dev/streamnest.git
cd streamnest/server

2. Install dependencies:

   npm install

3. Create a `.env` file in the project root and set required environment variables (see next section).

4. Start the server:

   # production
   node index.js

   # or, if you have a dev script (recommended)
   npm run dev

Note: The exact start script name may vary—check `package.json` for available npm scripts.

## Environment variables

Create a `.env` (or otherwise inject) the variables your environment requires. Typical variables used in projects like this are:

- PORT — server port (e.g. 3000)
- NODE_ENV — `development` or `production`
- MONGO_URI (or MONGODB_URI) — MongoDB connection string
- JWT_SECRET — JWT signing secret for auth
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET — Cloudinary credentials

If you want exact variable names, search `constants.js`, `db/index.js`, and `utils/cloudinary.js` for the exact names used in this repo.

## Available endpoints (overview)

Below are the main resource prefixes. For exact routes and query parameters, inspect the route files in `routes/`.

- /api/users — register, login, profile
- /api/videos — upload, list, detail, update, delete
- /api/comments — comment on videos
- /api/likes — like/unlike videos
- /api/playlists — create and manage playlists
- /api/subscriptions — follow/unfollow channels
- /api/tweets — (if present) small micro-post resource
- /api/dashboard — summary endpoints
- /health or /api/healthcheck — basic health endpoint

Example: GET /api/videos to list videos, POST /api/videos to upload (multipart/form-data with `multipart` middleware).

## Project structure

Key folders and files (top-level in the `server` folder):

- `index.js` — application bootstrap and server start
- `app.js` — express app configuration, global middleware
- `routes/` — route definitions per resource
- `controllers/` — request handlers and business logic
- `models/` — Mongoose models/schema definitions
- `db/` — database connection logic
- `utils/` — helper classes (ApiError, ApiResponse, cloudinary integration)
- `middlewares/` — auth, error handling and upload handling

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests where applicable
4. Open a pull request describing your changes

Please follow existing code style and add tests for new behaviors.

## License

Specify a license file in the repository (e.g., `LICENSE`). If there is none yet, add one appropriate to your project. A common choice for open source is the MIT license.

---


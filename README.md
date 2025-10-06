# Interviews Reports App JavaScript

Interviews Reports App is a small HR portal built with Vanilla JavaScript that lets recruiters manage companies, candidates, interview reports, and user accounts. Data is served through a `json-server` REST API with authentication middleware, all wrapped inside a lightweight Express server.

## Features

- **Authentication**: login/logout flow with JWT stored in `localStorage`.
- **Companies**: browse seeded companies and add new ones.
- **Candidates**: list candidates with profile details and avatars.
- **Reports**: create, edit, and delete interview reports.
- **Users**: view, add, and delete user accounts (admin only operations).

All UI code lives in `public/` and is delivered as static assets by Express.

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6), HTML5, CSS3.
- **Backend**: Express, `json-server`, `json-server-auth`.
- **Data store**: `db.json` (mock database with seed data).
- **Package scripts**: plain npm scripts; no bundler required.

## Getting Started

### Prerequisites
- Node.js 16+ (or any version supported by the JSON Server packages)
  
 ## Admin password reset
node -e "console.log(require('bcryptjs').hashSync('MyNewPassword123', 10))"

### Installation

```bash
npm install

npm run auth-server
Open the app in your browser at http://localhost:3333/ (the REST API is available at http://localhost:3333/api).



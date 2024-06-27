# Discussion Forum

This application is a discussion forum where users can post content, upvote, downvote, and comment on posts. It leverages Supabase for backend services including authentication, database, and storage.

## Features

- **User Authentication**: Sign up and log in to access the forum.
- **Post Creation**: Users can create posts within the forum.
- **Upvotes and Downvotes**: Users can upvote or downvote posts.
- **Comments**: Users can comment on posts.

## Technologies

- **Frontend**: React
- **Backend**: Supabase (Authentication, Realtime Database)
- **Styling**: CSS/SCSS

## API Endpoints

- `POST /auth/signup`: Sign up new users.
- `POST /auth/login`: Authenticate users.
- `GET /posts`: Fetch all posts.
- `POST /posts`: Create a new post.
- `POST /posts/:id/upvote`: Upvote a post.
- `POST /posts/:id/downvote`: Downvote a post.
- `POST /posts/:id/comments`: Comment on a post.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g

### Installation

1. Clone the repo
```
https://github.com/nh0397/DiscussionForum.git
```
2. Go to the directory
```
cd DiscussionForum
```
3. Install packages
```
npm install
```
4. Set up your environment variables in a .env file with your Supabase credentials
```
VITE_APP_SUPABASE_URL=your_supabase_url
VITE_APP_SUPABASE_KEY=your_supabase_key
```
5. Start the development server
```
npm start
```
## Usage
After logging in, users can create posts, upvote or downvote existing posts, and comment on posts. The user profile page displays all user activities including posts and upvotes.

## Contributing
Contributions are welcome. Any contributions you make are greatly appreciated.

## Fork the project
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a pull request
## License
Distributed under the MIT License. See LICENSE for more information.
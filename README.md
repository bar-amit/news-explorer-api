# news-explorer-api

A backend for my News Explorer app.

## [API](https://api.bar-news-explorer.students.nomoreparties.sbs)

- POST /signin  -- Sign in to the app.
- POST /signup -- Register.
- GET /users/me -- Get your user info.
- GET /articles -- Get your saved articles.
- POST /articles -- Save an article.
- DELETE /articles/:id -- Delete a saved article.

The app uses Express, MongoDB, Celebrate, Winston, Helmet and other packages.

## Scripts

- `npm run dev` -- Runs the app with hot reload.
- `npm run start` -- Starts the app.
- `npm run lint` -- Runs Eslint.
- `npm run lintf` -- Runs Eslint with --fix.

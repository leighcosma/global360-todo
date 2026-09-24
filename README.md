# global360-todo

A TODO list app built for the Global 360 Senior Software Engineer role, with an Angular frontend, a .NET Web API backend and in-memory data.

## Prerequisites

- Node.js 24 — `.nvmrc` is provided, so `nvm use` picks it up
- .NET SDK 10 (pinned in `global.json`)

## Run the API

```sh
cd api
dotnet run --project TodoApp.Api
```

The API listens on http://localhost:5016.

Make sure to run the API before the client.

## Run the client

```sh
cd client
npm install
npm start
```

The app is served at http://localhost:4200.

To access the app from another device on your network, run `npx ng serve --host 0.0.0.0` instead of `npm start`.

## Third-party references

- Icons from [Lucide](https://lucide.dev) (ISC licence)

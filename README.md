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

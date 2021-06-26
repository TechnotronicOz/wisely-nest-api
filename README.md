# Wisely Test API

Take home project, built by [Matt Carter](mailto:matt@mattcarter.io) stands up both a Graphql API

[![Build](https://github.com/TechnotronicOz/wisely-nest-api/actions/workflows/ci.yml/badge.svg)](https://github.com/TechnotronicOz/wisely-nest-api/actions/workflows/ci.yml)

## Start Backing Services
```bash
$ docker compose up -d
```

## Installation
Runs on Node 12 or 14. _(Note: don't forget to `cd api` first!)_
```bash
$ nvm use
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Generating fixture data in Postgres

Uses Typeorm fixtures to insert test data into the database.

**Status: currently broke :(**

```bash
$ npm run seed:build
```

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

Simple API for stock symbols

## Project setup with docker

Create a new env file, based on the example:

```bash
$ cp .env.example .env
```

Set the finnhub API key in the new env file, then:

```bash
$ docker compose up -d

# Setup git hooks with husky
$ npx husky
```

## Project setup without docker

Create a new env file, based on the example:

```bash
$ cp .env.example .env
```

Set the finnhub API key in the new env file, then:

```bash
$ npm run install

# development
$ npm run start

# Setup git hooks with husky
$ npm run husky
```

## Run tests

```bash
# unit tests
$ npm run test
```

## Swagger documentation

<a href="http://localhost:3000/api" target="blank">http://localhost:3000/api</a>

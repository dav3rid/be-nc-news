# NC News API Project

An API that contacts a database to add, retrieve, edit and delete elements. These elements may include:

- users
- articles
- topics
- comments

Follow this link for a JSON of possible endpoints and capabilities:

https://nc-news-fresh.herokuapp.com/api

## Getting Started

Clone this Github Repository.

### Prerequisites

All required packages and dependencies are in the included `package.json`.

Run `npm install` in the terminal.

Dependencies:

```
`express` - Web application framework for `Node.js`
`knex` - SQL query builder
`pg` - PostgreSQL client for `Node.js`
```

Dev-dependencies:

```
`chai` - Assertion library
`chai-sorted` - Chai plugin for testing array sorting
`mocha` - Testing framework
`nodemon` - Automatically restarts application as file changes are made
`supertest` - For testing HTTP
```

### Installing

Install dependencies

```
npm install
```

## Running the tests

Run tests for utility functions

```
npm run test-utils
```

Run tests for application

```
npm test
```

# fastify-router

A Simple Express-like router for Fastify.

## Installation

> This package was tested with Node 20 and Fastify 5

```sh
npm i fastify @chooks22/fastify-router
```

## Usage

```js
// api.js
import { createRouter } from '@chooks22/fastify-router';

const router = createRouter();
export default router;

router.get('/time', async () => {
  return { time: Date.now() };
});

// index.js
import fastify from 'fastify';
import api from './api.js';

const app = fastify();
const port = Number(process.env.PORT) || 3000;

await app.register(api, { prefix: '/api/v1' });
await app.listen({ port });

const res = await fetch(`http://localhost:${port}/api/v1/time`);
const data = await res.json();

console.log(data.time); // number
```

## License

MIT

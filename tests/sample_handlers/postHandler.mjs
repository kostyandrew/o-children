// tests/sample_handlers/postHandler.mjs
import express from 'express';

// Middleware to parse JSON bodies, needed for POST requests
const jsonParser = express.json();

export function POST(req, res) {
  // Accessing the body directly might work if global middleware is applied
  // by the framework. If not, we might need to apply express.json()
  // specifically for this route or ensure it's part of the test server setup.
  // For now, let's assume req.body is populated.
  if (req.body && req.body.echo) {
    res.status(200).json({ received_echo: req.body.echo });
  } else {
    res.status(400).json({ error: 'Missing echo field in POST body' });
  }
}

// It seems the framework might automatically apply wrappers or expect default exports for middleware.
// Let's add a default export that includes the JSON parser as middleware for this route.
// This is a guess based on the `_middleware` handling in `makeRouter.mjs`.
// If the framework doesn't pick this up, the test setup will need to ensure an Express app
// instance with `express.json()` middleware is used when testing postHandler.
export default [jsonParser];

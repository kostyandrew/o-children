// tests/sample_handlers/middlewareAndErrorTester.mjs
import { meta } from '#framework/request.mjs'; // Adjusted path

export function GET(req, res) {
  // Retrieve metadata set by _middleware.mjs
  const metadataFromMiddleware = meta(); 

  res.status(200).json({ 
    message: 'Middleware and metadata test', 
    retrievedMetadata: metadataFromMiddleware 
  });
}

export function GET_error(req, res) { // Route will be /middlewareAndErrorTester/error
  throw new Error("Intentional test error");
}

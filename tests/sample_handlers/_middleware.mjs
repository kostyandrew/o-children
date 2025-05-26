// tests/sample_handlers/_middleware.mjs

// This middleware should return an object that becomes request metadata.
export default function() {
  return {
    customMetadata: 'Hello from Middleware',
    middlewareTimestamp: Date.now() // Adding another piece of metadata
  };
}

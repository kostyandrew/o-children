# o-children

o-children is a Node.js server library that leverages Express to provide a file-system-based routing mechanism. Designed for testing and educational purposes, this library facilitates an intuitive way to organize and handle HTTP routes. It is not recommended for production.

## Features

- **Express-Based**: Built upon Express for robust HTTP request handling.
- **Filesystem Routing**: Allows for routes to be defined by the filesystem, making route management straightforward and scalable.
- **Helper Functions**: Includes functions like `json` for returning JSON responses with ease.
- **Return Objects from Handlers**: Enables handlers to return objects directly, streamlining the response creation process.
- **Middleware Support**: Offers the capability to include middleware files that apply logic to multiple routes in a directory.

## Installation

```bash
npm install o-children
```

## Directory Structure and Route Mapping

The `o-children` library maps the directory structure of your project to HTTP routes. Here’s how different files correspond to URL paths:

### Products

```
app/
├── products/
│   ├── :productId.mjs     # Handles requests for specific products by ID.
│   └── index.mjs          # Manages requests to the products listing.
```

- `app/products/:productId.mjs`: This file will handle requests to URLs like `/products/1`, where `1` is the ID of the product. The `:productId` in the filename indicates a dynamic segment in the URL path.

  Example:

  ```javascript
  // app/products/:productId.mjs
  import { params } from 'o-children/request';
  import { json } from 'o-children/response';

  export function GET() {
  	const productId = params().get('productId');
  	// Logic to retrieve product details...
  	return { productId, name: 'Example Product' };
  }
  ```

- `app/products/index.mjs`: This file responds to the `/products` endpoint and is typically used to list all products.

  Example:

  ```javascript
  // app/products/index.mjs

  export function GET() {
  	// Logic to retrieve all products...
  	return [
  		{ productId: 1, name: 'Example Product 1' },
  		{ productId: 2, name: 'Example Product 2' },
  	];
  }
  ```

### Checkout

```
app/
└── checkout/
    └── summary.mjs        # Serves the summary page of the checkout process.
```

- `app/checkout/summary.mjs`: Maps to the `/checkout/summary` URL, which could display a summary of the items in the user's cart and the total cost.

  Example:

  ```javascript
  // app/checkout/summary.mjs
  import { json } from 'o-children/response';

  export function GET() {
  	// Logic to create a summary of the checkout...
  	return json({ itemCount: 3, totalCost: 150.0 });
  }
  ```

## Middleware and Metadata

In `o-children`, middleware functions are used to process and augment requests before they reach the route handlers. Unlike some other frameworks, middleware functions in `o-children` do not directly receive `req`, `res`, and `next` parameters. Instead, they return a function that can interact with the request and response objects.

To access metadata set in middleware, use the `getMeta` function provided by the library.

Example of setting metadata in `_middleware.mjs`:

```javascript
// _middleware.mjs
export default function () {
	return {
		timestamp: Date.now(),
	};
}
```

To retrieve the metadata in your route handler:

```javascript
// In your route handler file
import { meta } from 'o-children/request';

export function GET() {
	// You can now use the metadata, for example:
	const timestamp = meta().timestamp;
	//...
}
```

Please note, any object returned by a middleware function will not be sent as a response (use `json` function instead`). Instead, it is stored as metadata for the request, which can then be accessed by route handlers.

## Configuration

Configure your `o-children` application with an `o.config.mjs` file in the root of your project. This file should define the server and application settings using the `defineConfig` function provided by the library. Below is an example of how to structure your configuration with TypeScript type annotations:

```typescript
/**
 * Main configuration object for the o-children application.
 */
type Config = {
	server?: ServerConfig;
	app?: AppConfig;
};

/**
 * Application-specific configuration.
 */
type AppConfig = {
	// Directory where application files are located. Defaults to 'app'.
	dir?: string;
};

/**
 * Server configuration options.
 */
type ServerConfig = {
	// The port number the server listens on.
	port?: number;
	// The host name or IP address the server listens on.
	host?: string;
};
```

```javascript
import defineConfig from 'o-children/defineConfig';
// Example configuration using defineConfig
export default defineConfig({
	server: {
		port: 8080,
	},
	app: {
		dir: 'src',
	},
});
```

Make sure to adjust your configuration according to your application's needs and the `o-children` library's capabilities.

## Running the Server

- To start the server, use the command: `o-children start`
- To watch for file changes and automatically restart the server, use the command: `o-children watch`

## License

This project is licensed under the MIT License.

## Disclaimer

`o-children` is intended solely for testing and development purposes and should not be deployed in a production setting.
